import Constants from './constants';
import {Utils} from './utils';

export class Handlers {  

  constructor(setup, internal){
    this.setup = setup;
    this.internal = internal;
  }

  onDragstart (mouseEvent, $cell, gridstrapContext) { 
    let context = this.setup.Context; 

    if (gridstrapContext === context) {
      mouseEvent.preventDefault();
    }
  }

  onMousedown (mouseEvent, $cell, gridstrapContext) {
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;

    if (gridstrapContext !== context) {
      return;
    }

    if (options.resizeHandleSelector &&
      $(mouseEvent.target).closest(options.resizeHandleSelector).length) {
      // is resizing, not dragging.
      if (!$cell.hasClass(options.resizeCellClass)) {
        $cell.addClass(options.resizeCellClass);

        this.internal.SetMouseDownData(mouseEvent, $cell); 
      }

      return;
    } 

    if (options.draggable && !$cell.hasClass(options.dragCellClass)) {

      this.internal.SetMouseDownData(mouseEvent, $cell);  

      $cell.addClass(options.dragCellClass);

      this.internal.MoveDraggedCell(mouseEvent, $cell);
    }
  }

  onMouseover(mouseEvent, $cell, gridstrapContext) {
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;

    // clear initially.
    this.internal.LastMouseOverCellTarget = null;
 
    if (!gridstrapContext.options.draggable) {
      return;
    }

    let $draggedCell = this.internal.$GetDraggingCell();
    if ($draggedCell.length) {
      // Is currently dragging. 
      if ($cell.length && !$draggedCell.closest($cell).length) {
        // make sure you're not mouseover-ing the dragged cell itself.
        // css' 'pointer-events', 'none' should do this job, but this double checks.

        this.internal.LastMouseOverCellTarget = $cell;

        if (!Utils.IsElementThrottled($, $cell, options.dragMouseoverThrottle)) {
          // do not move two cells that have recently already moved.

          if (gridstrapContext.options.rearrangeOnDrag) { 

            this.internal.MoveCell($draggedCell, $cell, gridstrapContext); 
            
            // reset dragged object to mouse pos, not pos of hidden cells. 
            this.internal.MoveDraggedCell(mouseEvent, $draggedCell);
          }
        }
      }
    }
  }

  onMousemove (mouseEvent) {
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;

    let $resizedCell = $(this.setup.ResizeCellSelector);
    if ($resizedCell.length) {
      // is resizing 

      let originalMouseDownDiff = $resizedCell.data(Constants.DATA_MOUSEDOWN_POSITION_DIFF); 
      let originalMouseDownSize = $resizedCell.data(Constants.DATA_MOUSEDOWN_SIZE); 

      // will change as resizing.
      let cellPositionAndSize = $resizedCell.data(Constants.DATA_CELL_POSITION_AND_SIZE);

      let absoluteOffset = Utils.GetAbsoluteOffsetForElementFromMouseEvent($resizedCell, mouseEvent, originalMouseDownDiff); 

      let newW = originalMouseDownSize.width + absoluteOffset.left - cellPositionAndSize.left;
      let newH = originalMouseDownSize.height + absoluteOffset.top - cellPositionAndSize.top;

      $resizedCell.css('width', newW);
      $resizedCell.css('height', newH);

      if (options.resizeOnDrag) {
        this.internal.ResizeCell($resizedCell, newW, newH);
      }

    } else {

      let $draggedCell = this.internal.$GetDraggingCell();
      if ($draggedCell.length) { // should just be one.

        this.internal.MoveDraggedCell(mouseEvent, $draggedCell);


        // ATTEMPT TO GET NONCONTIG WOKING...
        ////////not overlapping any existing managed cell while dragging.
        let nonContiguousOptions = options.nonContiguousOptions;
        let nonContiguousSelector = nonContiguousOptions.selector;
        if (nonContiguousSelector &&
          nonContiguousSelector.length) {

          let $hiddenCells = this.internal.$GetHiddenCellsInElementOrder();

          let lastHiddenCellPositionAndSize = Utils.GetPositionAndSizeOfCell( $hiddenCells.last());
          let draggedCellPositionAndSize = Utils.GetPositionAndSizeOfCell($draggedCell);

          while (draggedCellPositionAndSize.top + draggedCellPositionAndSize.height > lastHiddenCellPositionAndSize.top) {
            // if mouse beyond or getting near end of static hidden element, then make some placeholder ones.
            // insert dummy cells if cursor is beyond where the cells finish.
            let $insertedCell = context.insertCell(
              nonContiguousOptions.getHtml(),
              $hiddenCells.length
            );
            $insertedCell.addClass(options.nonContiguousPlaceholderCellClass);
            let $insertedHiddenCell = $insertedCell.data(Constants.DATA_HIDDEN_CELL);

            // might have to keep adding them.
            lastHiddenCellPositionAndSize = Utils.GetPositionAndSizeOfCell($insertedHiddenCell);

            $hiddenCells = $hiddenCells.add($insertedHiddenCell);

            // inserting cells trigers a repositioning.
            this.internal.MoveDraggedCell(mouseEvent, $draggedCell);
            draggedCellPositionAndSize = Utils.GetPositionAndSizeOfCell($draggedCell);
          }

          // remove ones at end when we have too much.          
          let $lastHiddenCell = $hiddenCells.last();
          let $bottomRowHiddenCells = null;
          let $getBottomRowHiddenCells = () => {
            $bottomRowHiddenCells = $bottomRowHiddenCells || $hiddenCells.filter((i,e) => {
              return Utils.GetPositionAndSizeOfCell($(e)).top === Utils.GetPositionAndSizeOfCell($lastHiddenCell).top;
            });
            return $bottomRowHiddenCells;
          };
          while (draggedCellPositionAndSize.top + draggedCellPositionAndSize.height < lastHiddenCellPositionAndSize.top &&
            $getBottomRowHiddenCells().filter((i,e) => $(e).data(Constants.DATA_VISIBLE_CELL).hasClass(options.nonContiguousPlaceholderCellClass)).length === $getBottomRowHiddenCells().length) {

            $hiddenCells = $hiddenCells.not($lastHiddenCell);

            context.removeCell($lastHiddenCell.data(Constants.DATA_VISIBLE_CELL));

            $lastHiddenCell = $hiddenCells.last();

            lastHiddenCellPositionAndSize = Utils.GetPositionAndSizeOfCell($lastHiddenCell);

            // removing cells triggers redraw.
            this.internal.MoveDraggedCell(mouseEvent, $draggedCell);
            draggedCellPositionAndSize = Utils.GetPositionAndSizeOfCell($draggedCell);

            $bottomRowHiddenCells = null;
          }
        }
      }
    }
  }

  onMouseup (mouseEvent) {
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;

    if (!options.draggable) {
      return;
    }

    let $resizedCell = $(this.setup.ResizeCellSelector);
    if (options.resizeHandleSelector && $resizedCell.length) {
      if (!options.resizeOnDrag) {
        let originalMouseDownDifference = $resizedCell.data(Constants.DATA_MOUSEDOWN_POSITION_DIFF); 

        let newW = originalMouseDownCellPosition.w + mouseEvent.pageX - originalMouseDownPagePosition.x;
        let newH = originalMouseDownCellPosition.h + mouseEvent.pageY - originalMouseDownPagePosition.y;

        this.internal.ResizeCell($resizedCell, newW, newH);
      }

      $resizedCell.removeClass(options.resizeCellClass);
      Utils.ClearMouseDownData($resizedCell);

      return;
    }

    let $draggedCell = this.internal.$GetDraggingCell();
    if ($draggedCell.length > 0) {

      // no more dragging.
      $draggedCell.removeClass(options.dragCellClass);
      Utils.ClearMouseDownData($resizedCell);

      let cellOriginalPosition = $draggedCell.data(Constants.DATA_CELL_POSITION_AND_SIZE);
      context.setCellAbsolutePositionAndSize($draggedCell, cellOriginalPosition);

      if (this.internal.LastMouseOverCellTarget &&
        !options.rearrangeOnDrag) {
        // else just rearrange on mouseup
        this.internal.MoveCell($draggedCell, this.internal.LastMouseOverCellTarget, context);
      }
    }
  }  
}