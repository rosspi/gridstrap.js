import {Setup} from './setup';

export class Handlers {  

  constructor(setup){
    this.setup = setup;


  }

  onDragstart (mouseEvent, $cell, gridstrapData) {
    if (gridstrapData === this.base) {
      mouseEvent.preventDefault();
    }
  }

  onMousedown (mouseEvent, $cell, gridstrapData) {

    if (gridstrapData !== this.base) {
      return;
    }

    if (this.base.options.resizeHandleSelector &&
      $(mouseEvent.target).closest(this.base.options.resizeHandleSelector).length) {
      // is resizing, not dragging.
      if (!$cell.hasClass(this.base.options.resizeCellClass)) {
        $cell.addClass(this.base.options.resizeCellClass);

        $cell.data(this.base.constants.DATA_MOUSEDOWN_PAGE_POSITION, {
          x: mouseEvent.pageX,
          y: mouseEvent.pageY
        });
        $cell.data(this.base.constants.DATA_MOUSEDOWN_CELL_POSITION, this.base.options.getAbsolutePositionAndSizeOfCell.call(this.base, $cell));
      }

      return;
    } 

    if (this.base.options.enableDragging && 
      !$cell.hasClass(this.base.options.dragCellClass)) {

      $cell.data(this.base.constants.DATA_MOUSEDOWN_PAGE_POSITION, {
        x: mouseEvent.pageX,
        y: mouseEvent.pageY
      });
      $cell.data(this.base.constants.DATA_MOUSEDOWN_CELL_POSITION, this.base.options.getAbsolutePositionAndSizeOfCell.call(this.base, $cell));

      $cell.addClass(this.base.options.dragCellClass);

      _internal.moveDraggedCell(mouseEvent, $cell);
    }
  }

  onMouseover(mouseEvent, $cell, gridstrapData) {
    // clear initially.
    _internal.lastMouseOverCellTarget = null;

    if (!gridstrapData.options.enableDragging) {
      return;
    }

    var $draggedCell = _internal.$getDraggingCell();
    if ($draggedCell.length) {
      // Is currently dragging. 
      if ($cell && $draggedCell.closest($cell).length === 0) {
        // make sure you're not mouseover-ing the dragged cell itself.
        // css' 'pointer-events', 'none' should do this job, but this double checks.

        _internal.lastMouseOverCellTarget = $cell;

        if (!_internal.setAndGetElementRecentlyDraggedMouseOver($cell)) {
          // do not move two cells that have recently already moved.

          if (gridstrapData.options.rearrangeWhileDragging) {

            _internal.moveCell($draggedCell, $cell, gridstrapData);

            // reset dragged object to mouse pos, not pos of hidden cells. 
            _internal.moveDraggedCell(mouseEvent, $draggedCell);
          }
        }
      }
    }
  }

  onMousemove (mouseEvent) {

    var $resizedCell = $(_internal.resizeCellSelector);
    if ($resizedCell.length) {
      // is resizing

      var originalMouseDownCellPosition = $resizedCell.data(this.base.constants.DATA_MOUSEDOWN_CELL_POSITION);
      var originalMouseDownPagePosition = $resizedCell.data(this.base.constants.DATA_MOUSEDOWN_PAGE_POSITION);

      var newW = originalMouseDownCellPosition.w + mouseEvent.pageX - originalMouseDownPagePosition.x;
      var newH = originalMouseDownCellPosition.h + mouseEvent.pageY - originalMouseDownPagePosition.y;

      $resizedCell.css('width', newW);
      $resizedCell.css('height', newH);

      if (this.base.options.resizeOnDrag) {
        _internal.resizeCell($resizedCell, newW, newH);
      }

    } else {

      var $draggedCell = _internal.$getDraggingCell();
      if ($draggedCell.length) { // should just be one.

        _internal.moveDraggedCell(mouseEvent, $draggedCell);


        // ATTEMPT TO GET NONCONTIG WOKING...
        ////////not overlapping any existing managed cell while dragging.
        var nonContiguousOptions = this.base.options.nonContiguousOptions;
        var nonContiguousSelector = nonContiguousOptions.selector;
        if (nonContiguousSelector &&
          nonContiguousSelector.length) {

          var $hiddenCells = this.base.getHiddenCells();

          var lastHiddenCellPositionAndSize = this.base.options.getAbsolutePositionAndSizeOfCell.call(this.base, $hiddenCells.last());
          var draggedCellPositionAndSize = this.base.options.getAbsolutePositionAndSizeOfCell.call(this.base, $draggedCell);

          while (draggedCellPositionAndSize.y + draggedCellPositionAndSize.h > lastHiddenCellPositionAndSize.y) {
            // if mouse beyond or getting near end of static hidden element, then make some placeholder ones.
            // insert dummy cells if cursor is beyond where the cells finish.
            var $insertedCell = this.base.insertCell(
              nonContiguousOptions.getHtml(),
              $hiddenCells.length
            );
            $insertedCell.addClass(this.base.options.nonContiguousPlaceholderCellClass);
            var $insertedHiddenCell = $insertedCell.data(this.base.constants.DATA_HIDDEN_CELL);

            // might have to keep adding them.
            lastHiddenCellPositionAndSize = this.base.options.getAbsolutePositionAndSizeOfCell.call(this.base, $insertedHiddenCell);
            draggedCellPositionAndSize = this.base.options.getAbsolutePositionAndSizeOfCell.call(this.base, $draggedCell);

            $hiddenCells = $hiddenCells.add($insertedHiddenCell);
          }
          // remove ones at end when we have too much.
          // THIS PART FIXINFG BELOW BPLEASE.l
          var $lastHiddenCell = $hiddenCells.last();
          while (draggedCellPositionAndSize.y + draggedCellPositionAndSize.h < lastHiddenCellPositionAndSize.y &&
            $lastHiddenCell.data(this.base.constants.DATA_VISIBLE_CELL).hasClass(this.base.options.nonContiguousPlaceholderCellClass)) {

            $hiddenCells = $hiddenCells.not($lastHiddenCell);

            this.base.removeCell($lastHiddenCell.data(this.base.constants.DATA_VISIBLE_CELL));

            $lastHiddenCell = $hiddenCells.last();

            lastHiddenCellPositionAndSize = this.base.options.getAbsolutePositionAndSizeOfCell.call(this.base, $lastHiddenCell);
            var draggedCellPositionAndSize = this.base.options.getAbsolutePositionAndSizeOfCell.call(this.base, $draggedCell);
          }
        }
      }
    }
  }

  onMouseup (mouseEvent) {
    if (!this.base.options.enableDragging) {
      return;
    }

    var $resizedCell = $(_internal.resizeCellSelector);
    if (this.base.options.resizeHandleSelector && $resizedCell.length) {
      if (!this.base.options.resizeOnDrag) {
        var originalMouseDownCellPosition = $resizedCell.data(this.base.constants.DATA_MOUSEDOWN_CELL_POSITION);
        var originalMouseDownPagePosition = $resizedCell.data(this.base.constants.DATA_MOUSEDOWN_PAGE_POSITION);

        var newW = originalMouseDownCellPosition.w + mouseEvent.pageX - originalMouseDownPagePosition.x;
        var newH = originalMouseDownCellPosition.h + mouseEvent.pageY - originalMouseDownPagePosition.y;

        _internal.resizeCell($resizedCell, newW, newH);
      }

      $resizedCell.removeClass(this.base.options.resizeCellClass);
      $resizedCell.removeData(this.base.constants.DATA_MOUSEDOWN_PAGE_POSITION);

      return;
    }

    var $draggedCell = _internal.$getDraggingCell();
    if ($draggedCell.length > 0) {

      // no more dragging.
      $draggedCell.removeClass(this.base.options.dragCellClass);
      $draggedCell.removeData(this.base.constants.DATA_MOUSEDOWN_PAGE_POSITION);

      var cellOriginalPosition = $draggedCell.data(this.base.constants.DATA_CELL_POSITION_AND_SIZE);
      this.base.setCellAbsolutePositionAndSize($draggedCell, cellOriginalPosition);

      if (_internal.lastMouseOverCellTarget &&
        !this.base.options.rearrangeWhileDragging) {
        // else just rearrange on mouseup
        _internal.moveCell($draggedCell, _internal.lastMouseOverCellTarget, this.base);
      }
    }
  }  
}