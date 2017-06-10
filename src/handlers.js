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

  onTouchStart (touchEvent, $cell, gridstrapContext){
    let $ = this.setup.jQuery;
    let options = this.setup.Options;

    touchEvent.preventDefault(); 

    if (touchEvent.touches.length){
      this.onMousedown(
        Utils.ConvertTouchToMouseEvent(touchEvent), 
        $cell, 
        gridstrapContext);
    }
  }

  onMousedown (mouseEvent, $cell, gridstrapContext) {
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;

    if (gridstrapContext !== context) {
      return;
    }

    if ($cell.hasClass(options.nonContiguousPlaceholderCellClass)){
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

        Utils.Limit(() => {
          if (gridstrapContext.options.rearrangeOnDrag) { 

            this.internal.MoveCell($draggedCell, $cell, gridstrapContext); 
            
            // reset dragged object to mouse pos, not pos of hidden cells. 
            // do not trigger overlapping now.
            this.internal.MoveDraggedCell(mouseEvent, $draggedCell, true);
          }
        }, options.dragMouseoverThrottle); 
      }
    }
  }

  onTouchmove (touchEvent) {

    this.onMousemove(Utils.ConvertTouchToMouseEvent(touchEvent));
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

        if (options.nonContiguousCellHtml && 
          options.rearrangeOnDrag && 
          options.autoPadNonContiguousCells){
          this.internal.UpdateNonContiguousCellsForDrag($draggedCell, mouseEvent);
        } 
      }
    }
  }

  onTouchend(touchEvent){
    // don't convert to mouseEVent becuase there are no touches.
    this.onMouseup(touchEvent);
  }

  onMouseup (mouseEvent) {
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;
    let $element = this.setup.$Element;
    let document = this.setup.Document;

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

      if (options.nonContiguousCellHtml && 
        !options.rearrangeOnDrag &&
        options.autoPadNonContiguousCells){
          
        this.internal.UpdateNonContiguousCellsForDrag($draggedCell, mouseEvent);

        // mouse event may be over a new placeholder cell now.
        let $overlappedCell = this.internal.$GetNonDraggedCellFromPoint($draggedCell, mouseEvent);

        if ($overlappedCell.length){
          this.internal.LastMouseOverCellTarget = $overlappedCell;
        } else {
          this.internal.LastMouseOverCellTarget = null;
        }
      }

      // no more dragging.
      $draggedCell.removeClass(options.dragCellClass);
      Utils.ClearMouseDownData($resizedCell);

      let cellOriginalPosition = $draggedCell.data(Constants.DATA_CELL_POSITION_AND_SIZE);
      context.setCellAbsolutePositionAndSize($draggedCell, cellOriginalPosition);

      if (this.internal.LastMouseOverCellTarget && !options.rearrangeOnDrag) { 

        // rearrange on mouseup
        this.internal.MoveCell($draggedCell, this.internal.LastMouseOverCellTarget, context);
      }
    }
  }  
}