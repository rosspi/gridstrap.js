import Constants from './constants';
import {Utils} from './utils';

export class Methods { 
  constructor(setup, internal, handlers){
    this.setup = setup; 
    this.internal = internal;
    this.handlers = handlers;
   
  }

 
  // initCellsHiddenCopyAndSetAbsolutePosition($cell){

  // }
  $getCellOfElement(element) { // could be selector
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options; 

    var found = this.internal.GetCellAndInternalIndex(element);
    if (!found){
      return $();
    }
    return found.$cell;
  }

  setCellAbsolutePositionAndSize($cell, positionAndSize){
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options; 
    let $element = this.setup.$Element;

    let event = $.Event(Constants.EVENT_CELL_REDRAW, {
      left: positionAndSize.left,
      top: positionAndSize.top,
      width: positionAndSize.left,
      height: positionAndSize.top,
      target: $cell[0]
    });
    $element.trigger(event);

    if (event.isDefaultPrevented()){
      return;
    } 

    // data here is relied upon when drag-stop. 
    $cell.data(Constants.DATA_CELL_POSITION_AND_SIZE, positionAndSize);

    $cell.css('left', positionAndSize.left);
    $cell.css('top', positionAndSize.top);
    $cell.css('width', positionAndSize.width);
    $cell.css('height', positionAndSize.height);

  }

  updateVisibleCellCoordinates() {
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;

    for (var i = 0; i < this.internal.CellsArray.length; i++) {
      let $this = this.internal.CellsArray[i];

      let $hiddenClone = $this.data(Constants.DATA_HIDDEN_CELL);

      let positionNSizeOfHiddenClone = Utils.GetPositionAndSizeOfCell($hiddenClone);

      this.setCellAbsolutePositionAndSize($this, positionNSizeOfHiddenClone);
    }
    // need to also update the first child gristrap - one that might exist within this one - it is then obviously recursive.
    for (var i = 0; i < this.internal.CellsArray.length; i++) {
      var $nestedGridstrap = this.internal.CellsArray[i].find('*').filter(function () {
        return !!$(this).data(Constants.DATA_GRIDSTRAP);
      });

      if ($nestedGridstrap.length) {
        $nestedGridstrap.first().data(Constants.DATA_GRIDSTRAP).updateVisibleCellCoordinates();
      }
    }
  }
 

  // returns jquery object of new cell.
  // index is optional.
  insertCell (cellHtml, index) {
    let $ = this.setup.jQuery;
    let $element = this.setup.$Element;

    var $existingHiddenCells = this.internal.$GetHiddenCellsInElementOrder();
    if (typeof(index) === 'undefined') {
      index = $existingHiddenCells.length; // insert at end.
    }

    var $insertedCell;
    if (index === $existingHiddenCells.length) {
      if ($existingHiddenCells.length === 0) {
        // the grid is empty.
        $insertedCell = $(cellHtml).appendTo($element);
      } else {
        $insertedCell = $(cellHtml).insertAfter($existingHiddenCells.last());
      }
    } else {
      $insertedCell = $(cellHtml).insertBefore($existingHiddenCells.eq(index));
    }

    this.attachCell($insertedCell);

    return $insertedCell;
  }

  attachCell(selector) {
    let $ = this.setup.jQuery;
    let options = this.setup.Options;
    let $element = this.setup.$Element;

    if (!$(selector).closest($element).is($element)) {
      throw new Error(Constants.ERROR_INVALID_ATTACH_ELEMENT);
    }

    this.internal.InitCellsHiddenCopyAndSetAbsolutePosition(selector);

    this.updateVisibleCellCoordinates();

    return $(selector);
  }

  detachCell(selector) {
    let options = this.setup.Options;

    var cellNIndex = this.internal.GetCellAndInternalIndex(selector);

    var $hiddenClone = cellNIndex.$cell.data(Constants.DATA_HIDDEN_CELL);

    var $detachedVisibleCell = cellNIndex.$cell.detach();

    // remove 'visible' things, and put the cell back where it came from.
    Utils.ClearAbsoluteCSS($detachedVisibleCell);
    $detachedVisibleCell.removeData(Constants.DATA_HIDDEN_CELL);
    $detachedVisibleCell.removeClass(options.visibleCellClass);

    var $reattachedOriginalCell = $detachedVisibleCell.insertAfter($hiddenClone);

    // remove hidden clone.
    $hiddenClone.remove();

    // finally remove from managed array
    this.internal.ModifyCellsArray((array) => array.splice(cellNIndex.index, 1)); 

    return $reattachedOriginalCell;
  }

  removeCell(selector) {
    let $detachedCell = this.detachCell(selector);

    $detachedCell.remove();

    this.updateVisibleCellCoordinates();
  }

  moveCell(selector, toIndex, targetGridstrap) { // targetGridstrap optional..
    let context = this.setup.Context;

    let cellNIndex = this.internal.GetCellAndInternalIndex(selector);

    let $existingVisibleCells = this.$getCells();

    this.internal.MoveCell(cellNIndex.$cell, $existingVisibleCells.eq(toIndex), targetGridstrap || context);
    
  }

  moveCellToCoordinates(selector, x, y, targetGridstrap) {
    // TODO, use document.getlement at blah
  }

  $getCells() {
    let $ = this.setup.jQuery;

    let $attachedHiddenCells = this.internal.$GetHiddenCellsInElementOrder();

    let attachedVisibleCellElements = $attachedHiddenCells.map(function () {
      return $(this).data(Constants.DATA_VISIBLE_CELL)[0]; // TODO is this correct [0] ?
    });

    return $(attachedVisibleCellElements);
  }

  $getHiddenCells() {

    return this.internal.$GetHiddenCellsInElementOrder();
  }

  getCellContainer() {
    let $ = this.setup.jQuery;

    return $(this.setup.VisibleCellContainerSelector);
  }

  updateOptions(newOptions) {
    let $ = this.setup.jQuery;
    let options = this.setup.Options;

    this.setup.Options = $.extend({}, options, newOptions);
  }

  getCellIndexOfElement(element) { // could be selector
    var $cell = this.$getCellOfElement(element);

    var $cells = this.$getCells();

    return $cells.index($cell);
  }

  setAdditionalGridstrapDragTarget(selector) {
    let $ = this.setup.jQuery;
    let eventHandlers = this.handlers;

    let self = this;
    let mouseOverAdditionalEventName = `${Constants.EVENT_MOUSEOVER}.gridstrap-additional-${this.setup.IdPrefix}`;

    if (self.internal.AdditionalGridstrapDragTargetSelector) {
      $(self.internal.AdditionalGridstrapDragTargetSelector).each(function () {
        var $visibleCellContainer = $($(this).data(Constants.DATA_GRIDSTRAP).options.visibleCellContainerParentSelector);

        // remove any old handlers.
        // have to prefix it to prevent clashes with other gridstraphs,
        $visibleCellContainer.off(mouseOverAdditionalEventName);
      });
    }

    self.internal.AdditionalGridstrapDragTargetSelector = selector;

    // handle certain mouse event for potential other gridstraps.
    if (self.internal.AdditionalGridstrapDragTargetSelector) {
      $(self.internal.AdditionalGridstrapDragTargetSelector).each(function () {

        self.internal.HandleCellMouseEvent(
          $(this).data(Constants.DATA_GRIDSTRAP), 
          mouseOverAdditionalEventName, 
          false, 
          eventHandlers.onMouseover.bind(eventHandlers));
      });
    }
  }

  modifyCell(cellIndex, callback){     
    let context = this.setup.Context;

    let $visibleCell = this.$getCells().eq(cellIndex);
    let $hiddenCell = $visibleCell.data(Constants.DATA_HIDDEN_CELL);

    let getVisibleCellCalled = false, getHiddenCellCalled = false;

    callback.call(context, function(){
      getVisibleCellCalled = true;
      return $visibleCell;
    }, function(){
      getHiddenCellCalled = true;
      return $hiddenCell;
    });
    
    if (getVisibleCellCalled){
      // copy contents to hidden cell.
      $hiddenCell.html($visibleCell.html());
    } 
    
    this.updateVisibleCellCoordinates();
  }

}