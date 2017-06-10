import Constants from './constants';
import {Utils} from './utils';

export class Methods { 
  constructor(setup, internal, handlers){
    this.setup = setup; 
    this.internal = internal;
    this.handlers = handlers;
   
  }
 
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
      width: positionAndSize.width,
      height: positionAndSize.height,
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

    
    let $draggedCell = this.internal.$GetDraggingCell();

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

      $nestedGridstrap.each(function(){
        $(this).data(Constants.DATA_GRIDSTRAP).updateVisibleCellCoordinates();
      }); 
    }
  } 

  // returns jquery object of new cell.
  // index is optional.
  insertCell (cellHtml, index) {
    let $ = this.setup.jQuery;
    let options = this.setup.Options;
    let $element = this.setup.$Element; 

    var $existingHiddenCells = this.internal.$GetHiddenCellsInElementOrder();
    if (typeof(index) === 'undefined') {
      index = $existingHiddenCells.length; // insert at end.
    }

    if (index > $existingHiddenCells.length && 
      options.nonContiguousCellHtml && 
      options.autoPadNonContiguousCells) {
      
      this.internal.AppendOrRemoveNonContiguousCellsWhile(($hiddenCells, appending) => {

        if (!appending){
          // do not remove when trying to remove.
          return false; 
        }
        // insert placeholders until quantity of cells is index -1.
        return $hiddenCells.length < index;
      });

      // update these.
      $existingHiddenCells = this.internal.$GetHiddenCellsInElementOrder();
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

  attachCell(element) {
    let $ = this.setup.jQuery;
    let options = this.setup.Options;
    let $element = this.setup.$Element;

    if (!$(element).closest($element).is($element)) {
      throw new Error(Constants.ERROR_INVALID_ATTACH_ELEMENT);
    }

    this.internal.InitCellsHiddenCopyAndSetAbsolutePosition(element);

    this.updateVisibleCellCoordinates();

    return $(element);
  }

  detachCell(element) {
    let options = this.setup.Options;

    var cellNIndex = this.internal.GetCellAndInternalIndex(element);

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

    this.updateVisibleCellCoordinates();

    return $reattachedOriginalCell;
  }

  removeCell(element) {
    let $detachedCell = this.detachCell(element);

    $detachedCell.remove();

    this.updateVisibleCellCoordinates();
  }

  moveCell(element, toIndex, targetGridstrap) { // targetGridstrap optional..
    let options = this.setup.Options;
    let context = this.setup.Context;

    let $existingVisibleCells = this.$getCells();

    if (toIndex > $existingVisibleCells.length && 
      options.nonContiguousCellHtml && 
      options.autoPadNonContiguousCells) {
      
      this.internal.AppendOrRemoveNonContiguousCellsWhile(($hiddenCells, appending) => {

        if (!appending){
          // do not remove when trying to remove.
          return false; 
        }
        // insert placeholders until quantity of cells is index -1.
        return $hiddenCells.length <= toIndex;
      });

      // update these.
      $existingVisibleCells = this.$getCells();
    }

    let cellNIndex = this.internal.GetCellAndInternalIndex(element);

    this.internal.MoveCell(cellNIndex.$cell, $existingVisibleCells.eq(toIndex), targetGridstrap || context);
    
  }

  $getCellFromCoordinates(clientX, clientY) { 
    let document = this.setup.Document;
    let $ = this.setup.jQuery;

    let element = document.elementFromPoint(clientX, clientY); 
    let cellAndIndex = this.internal.GetCellAndInternalIndex(element);
    if (!cellAndIndex){
      return $();
    }
    return cellAndIndex.$cell;
  }

  getCellIndexFromCoordinates(clientX, clientY) { 
    let document = this.setup.Document;
    let $ = this.setup.jQuery;

    let element = document.elementFromPoint(clientX, clientY); 
    let cellAndIndex = this.internal.GetCellAndInternalIndex(element);
    if (!cellAndIndex){
      return -1;
    } 
    return this.$getCells().index(cellAndIndex.$cell);
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

  $getCellContainer() {
    let $ = this.setup.jQuery;

    return $(this.setup.VisibleCellContainerSelector);
  }

  updateOptions(newOptions) {
    let $ = this.setup.jQuery;
    let options = this.setup.Options;

    this.setup.Options = $.extend({}, options, newOptions);
  }

  getCellIndexOfElement(element) { 
    var $cell = this.$getCellOfElement(element);

    var $cells = this.$getCells();

    return $cells.index($cell);
  }

  setAdditionalGridstrapDragTarget(element) {
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

    self.internal.AdditionalGridstrapDragTargetSelector = element;

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

  padWithNonContiguousCells(callback){
    let $ = this.setup.jQuery;
    let options = this.setup.Options;
    
    if (!options.nonContiguousCellHtml){
      throw new Error(Constants.ERROR_NONCONTIGUOUS_HTML_UNDEFINED);
    }
    
    let $attachedHiddenCells = this.internal.$GetHiddenCellsInElementOrder();

    this.internal.AppendOrRemoveNonContiguousCellsWhile(($hiddenCells, appending) => {

      if (!appending){
        // do not remove, when trying to remove.
        // only append/pad.
        return false; 
      }
      let cellCount = $hiddenCells.length;
      let placeHolderCount = $hiddenCells.filter((i, e) => {
        return $(e).data(Constants.DATA_VISIBLE_CELL).hasClass(options.nonContiguousPlaceholderCellClass);
      }).length;

      return callback(cellCount, placeHolderCount);
    });
  }

}