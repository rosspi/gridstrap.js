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

    if (options.enableDragging && !$cell.hasClass(options.dragCellClass)) {

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
 
    if (!gridstrapContext.options.enableDragging) {
      return;
    }

    var $draggedCell = this.internal.$GetDraggingCell();
    if ($draggedCell.length) {
      // Is currently dragging. 
      if ($cell.length && !$draggedCell.closest($cell).length) {
        // make sure you're not mouseover-ing the dragged cell itself.
        // css' 'pointer-events', 'none' should do this job, but this double checks.

        this.internal.LastMouseOverCellTarget = $cell;

        if (!Utils.IsElementThrottled($, $cell, options.dragMouseoverThrottle)) {
          // do not move two cells that have recently already moved.

          if (gridstrapContext.options.rearrangeWhileDragging) {

            this.internal.MoveCell($draggedCell, $cell, gridstrapContext);

// fix dual broen
            hrthis.internal.SetMouseDownData(mouseEvent, $draggedCell);

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

    var $resizedCell = $(this.setup.ResizeCellSelector);
    if ($resizedCell.length) {
      // is resizing

      var originalMouseDownCellPosition = $resizedCell.data(Constants.DATA_MOUSEDOWN_CELL_POSITION);
      var originalMouseDownPagePosition = $resizedCell.data(Constants.DATA_MOUSEDOWN_PAGE_POSITION);

      var newW = originalMouseDownCellPosition.w + mouseEvent.pageX - originalMouseDownPagePosition.x;
      var newH = originalMouseDownCellPosition.h + mouseEvent.pageY - originalMouseDownPagePosition.y;

      $resizedCell.css('width', newW);
      $resizedCell.css('height', newH);

      if (options.resizeOnDrag) {
        this.internal.ResizeCell($resizedCell, newW, newH);
      }

    } else {

      var $draggedCell = this.internal.$GetDraggingCell();
      if ($draggedCell.length) { // should just be one.

        this.internal.MoveDraggedCell(mouseEvent, $draggedCell);


        // ATTEMPT TO GET NONCONTIG WOKING...
        ////////not overlapping any existing managed cell while dragging.
        var nonContiguousOptions = options.nonContiguousOptions;
        var nonContiguousSelector = nonContiguousOptions.selector;
        if (nonContiguousSelector &&
          nonContiguousSelector.length) {

          var $hiddenCells = this.base.getHiddenCells();

          var lastHiddenCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $hiddenCells.last());
          var draggedCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $draggedCell);

          while (draggedCellPositionAndSize.y + draggedCellPositionAndSize.h > lastHiddenCellPositionAndSize.y) {
            // if mouse beyond or getting near end of static hidden element, then make some placeholder ones.
            // insert dummy cells if cursor is beyond where the cells finish.
            var $insertedCell = this.base.insertCell(
              nonContiguousOptions.getHtml(),
              $hiddenCells.length
            );
            $insertedCell.addClass(options.nonContiguousPlaceholderCellClass);
            var $insertedHiddenCell = $insertedCell.data(Constants.DATA_HIDDEN_CELL);

            // might have to keep adding them.
            lastHiddenCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $insertedHiddenCell);
            draggedCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $draggedCell);

            $hiddenCells = $hiddenCells.add($insertedHiddenCell);
          }
          // remove ones at end when we have too much.
          // THIS PART FIXINFG BELOW BPLEASE.l
          var $lastHiddenCell = $hiddenCells.last();
          while (draggedCellPositionAndSize.y + draggedCellPositionAndSize.h < lastHiddenCellPositionAndSize.y &&
            $lastHiddenCell.data(Constants.DATA_VISIBLE_CELL).hasClass(options.nonContiguousPlaceholderCellClass)) {

            $hiddenCells = $hiddenCells.not($lastHiddenCell);

            this.base.RemoveCell($lastHiddenCell.data(Constants.DATA_VISIBLE_CELL));

            $lastHiddenCell = $hiddenCells.last();

            lastHiddenCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $lastHiddenCell);
            var draggedCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $draggedCell);
          }
        }
      }
    }
  }

  onMouseup (mouseEvent) {
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;

    if (!options.enableDragging) {
      return;
    }

    var $resizedCell = $(this.setup.ResizeCellSelector);
    if (options.resizeHandleSelector && $resizedCell.length) {
      if (!options.resizeOnDrag) {
        var originalMouseDownCellPosition = $resizedCell.data(Constants.DATA_MOUSEDOWN_CELL_POSITION);
        var originalMouseDownPagePosition = $resizedCell.data(Constants.DATA_MOUSEDOWN_PAGE_POSITION);

        var newW = originalMouseDownCellPosition.w + mouseEvent.pageX - originalMouseDownPagePosition.x;
        var newH = originalMouseDownCellPosition.h + mouseEvent.pageY - originalMouseDownPagePosition.y;

        this.internal.ResizeCell($resizedCell, newW, newH);
      }

      $resizedCell.removeClass(options.resizeCellClass);
      $resizedCell.removeData(Constants.DATA_MOUSEDOWN_PAGE_POSITION);

      return;
    }

    var $draggedCell = this.internal.$GetDraggingCell();
    if ($draggedCell.length > 0) {

      // no more dragging.
      $draggedCell.removeClass(options.dragCellClass);
      $draggedCell.removeData(Constants.DATA_MOUSEDOWN_PAGE_POSITION);

      var cellOriginalPosition = $draggedCell.data(Constants.DATA_CELL_POSITION_AND_SIZE);
      context.setCellAbsolutePositionAndSize($draggedCell, cellOriginalPosition);

      if (this.internal.LastMouseOverCellTarget &&
        !options.rearrangeWhileDragging) {
        // else just rearrange on mouseup
        this.internal.MoveCell($draggedCell, this.internal.LastMouseOverCellTarget, context);
      }
    }
  }  
}