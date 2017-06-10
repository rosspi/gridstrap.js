import Constants from './constants';
import {Utils} from './utils';

export class Internal { 
  constructor(setup){
    this.setup = setup; 
    this.document = document;

    this.cellsArray = [];
  } 

  InitOriginalCells(){
    let self = this;
    let $ = self.setup.jQuery;

    self.cellsArray = []; 

    self.setup.$OriginalCells.each(function (e) {
      self.InitCellsHiddenCopyAndSetAbsolutePosition($(this));
    });
  }

  InitEventHandlers(eventHandlers){
    let window = this.setup.Window;
    let context = this.setup.Context;
    let options = this.setup.Options;

    let appendNamespace = function(eventName){
      return `${eventName}.gridstrap`;
    };

    this.HandleCellMouseEvent(
      context, 
      `${appendNamespace(Constants.EVENT_DRAGSTART)}`, 
      true, 
      eventHandlers.onDragstart.bind(eventHandlers));

    this.HandleCellMouseEvent(
      context, 
      `${appendNamespace(Constants.EVENT_MOUSEDOWN)}`, 
      true, 
      eventHandlers.onMousedown.bind(eventHandlers));

    this.HandleCellMouseEvent(
      context, 
      `${appendNamespace(Constants.EVENT_TOUCHSTART)}`, 
      true, 
      eventHandlers.onTouchStart.bind(eventHandlers));

    // pass false as param because we need to do non-contiguous stuff in there.
    this.HandleCellMouseEvent(
      context, 
      `${appendNamespace(Constants.EVENT_MOUSEOVER)}`, 
      false, 
      eventHandlers.onMouseover.bind(eventHandlers)); 

    // it is not appropriate to confine the events to the visible cell wrapper.
    $(options.mouseMoveSelector)
      .on(
        `${appendNamespace(Constants.EVENT_MOUSEMOVE)}`, 
        Utils.Debounce(
          eventHandlers.onMousemove.bind(eventHandlers),
          options.mousemoveDebounce
        )) 
      .on(
        `${appendNamespace(Constants.EVENT_TOUCHMOVE)}`, 
        Utils.Debounce(
          eventHandlers.onTouchmove.bind(eventHandlers),
          options.mousemoveDebounce
      ))
      .on(
        `${appendNamespace(Constants.EVENT_MOUSEUP)}`,  
        eventHandlers.onMouseup.bind(eventHandlers))
      .on(
        `${appendNamespace(Constants.EVENT_TOUCHEND)}`,  
        eventHandlers.onTouchend.bind(eventHandlers));

    if (options.updateCoordinatesOnWindowResize) {
      $(window).on(
        `${appendNamespace(Constants.EVENT_RESIZE)}`,  
        Utils.Debounce(
          context.updateVisibleCellCoordinates,
          options.windowResizeDebounce
        ));
    }
  }
 
  InitCellsHiddenCopyAndSetAbsolutePosition($cell){
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;

    this.ModifyCellsArray((array) => array.push($cell));

    // Create html clone to take place of original $cell.
    // Treat it as the 'hidden' cell, and turn the original $cell
    // into the visible/absolute cell.

    if (options.debug && !$cell.is(':visible')) {
      console.log(`Grid cell is invisible. Gridstrap should not initialise an invisible grid. (${this.el.nodeName}): ${$cell[0].nodeName})`);
    }

    let htmlOfOriginal = options.getHtmlOfSourceCell.call(context, $cell);
    let positionNSize = Utils.GetPositionAndSizeOfCell($cell);

    $cell.before(htmlOfOriginal);
    let $hiddenClone = $cell.prev();

    $hiddenClone.addClass(options.hiddenCellClass);
    $cell.addClass(options.visibleCellClass);

    // make it ref hidden cloned cell, both ways.
    $cell.data(Constants.DATA_HIDDEN_CELL, $hiddenClone);
    $hiddenClone.data(Constants.DATA_VISIBLE_CELL, $cell);

    // put absolute $cell in container.
    $(this.setup.VisibleCellContainerSelector).append($cell.detach());

    context.setCellAbsolutePositionAndSize($cell, positionNSize);
  }

  HandleCellMouseEvent (context, eventName, onlyCallWhenTargetsCell, callback) {
    // only call event if occured on one of managed cells that has been initialised.
    let draggableSelector = context.options.gridCellSelector + ' ' + context.options.dragCellHandleSelector;
    if (context.options.dragCellHandleSelector === $.Gridstrap.defaultOptions.dragCellHandleSelector ||
      eventName === Constants.EVENT_MOUSEOVER) {
      // If the default settings apply for drag handle mouse events,
      // or if mouseover, then we want the event to be lenient as to what triggers it.
      // Prepend selector with grid cell itself as an OR/, selector.
      // To become the cell itself OR any dragCellHandleSelector within the cell. 
      draggableSelector = context.options.gridCellSelector + ',' + draggableSelector;
    }

    $(context.options.visibleCellContainerParentSelector).on(eventName, draggableSelector, function (mouseEvent) {
      // user clicked on perhaps child element of draggable element.
      var $managedCell = context.$getCellOfElement(mouseEvent.target);

      if (onlyCallWhenTargetsCell && !$managedCell.length) {
        // do nothing if mouse is not interacting with a cell
        // and we're not meant to do anything unless it is.
        return;
      }
      // $managedCell may be null, callback needs to take care of that.
      callback(mouseEvent, $managedCell, context);
    });
  }

  SetMouseDownData(mouseEvent, $cell) {
    let context = this.setup.Context;
    let options = this.setup.Options;  

    // compare page with element' offset.
    let cellOffset = $cell.offset(); 
    var w = $cell.outerWidth();
    var h = $cell.outerHeight();

    $cell.data(Constants.DATA_MOUSEDOWN_POSITION_DIFF, {
      x: mouseEvent.pageX - cellOffset.left,
      y: mouseEvent.pageY - cellOffset.top
    });
    $cell.data(Constants.DATA_MOUSEDOWN_SIZE, {
      width: w,
      height: h
    });
  }

  GetNonDraggedElementFromPoint($draggedCell, mouseEvent) {
    let document = this.setup.Document;
    let $ = this.setup.jQuery;

    //remove mouse events from dragged cell, because we need to test for overlap of underneath things.
    let oldPointerEvents = $draggedCell.css('pointer-events');
    let oldTouchAction = $draggedCell.css('touch-action');
    $draggedCell.css('pointer-events', 'none');
    $draggedCell.css('touch-action', 'none');

    let element = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY); 

    // restore pointer-events css.
    $draggedCell.css('pointer-events', oldPointerEvents);
    $draggedCell.css('touch-action', oldTouchAction); 

    return element; 
  }

  MoveDraggedCell (mouseEvent, $cell, dontLookForOverlappedCell /*optional*/) {
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;
    let document = this.setup.Document;
    let $element = this.setup.$Element;

    let mouseDownPositionDifference = $cell.data(Constants.DATA_MOUSEDOWN_POSITION_DIFF);

    let absoluteOffset = Utils.GetAbsoluteOffsetForElementFromMouseEvent($cell, mouseEvent, mouseDownPositionDifference);

    let event = $.Event(Constants.EVENT_CELL_DRAG, {
      left: absoluteOffset.left,
      top: absoluteOffset.top,
      target: $cell[0]
    });
    $element.trigger(event);

    if (event.isDefaultPrevented()){
      return;
    } 

    $cell.css('left', absoluteOffset.left);
    $cell.css('top', absoluteOffset.top); 

    if (dontLookForOverlappedCell){
      return;
    }

    let triggerMouseOverEvent = function ($element) {
      $element.trigger(
        $.Event(Constants.EVENT_MOUSEOVER, {
          pageX: mouseEvent.pageX,
          pageY: mouseEvent.pageY,
          target: $element[0]
        }));
    };

    let overlappedElement = this.GetNonDraggedElementFromPoint($cell, mouseEvent);
    let $overlappedCell = context.$getCellOfElement(overlappedElement);
    
    if ($overlappedCell.length) {
      // have to create event here like this other mouse coords are missing.
      triggerMouseOverEvent($overlappedCell);

    } else {

      // have possibly dragged over non-managed cell.
      // it might be from a linked 'additional' gridstrap.
      if (this.AdditionalGridstrapDragTargetSelector) {
        $(this.AdditionalGridstrapDragTargetSelector).each(function () {
          
          let additionalContext = $(this).data(Constants.DATA_GRIDSTRAP);
          if (additionalContext) {
            // $getCellOfElement is a 'public' method.
            let $additionalContextCell = additionalContext.$getCellOfElement(overlappedElement);
            if ($additionalContextCell.length) {
              // have to create event here like this other mouse coords are missing.
              triggerMouseOverEvent($additionalContextCell);
            }
          }
        });
      }
    }
  }

  GetCellAndInternalIndex (element) { // element or jquery selector, child of cell or cell itself.
    
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;

    if (!element) {
      return null;
    }

    let $visibleCellElement = $(element);

    let visibleCellAndIndex = null;
    // visibleCellAndIndex.$cell might be a child element/control perhaps of $visibleCell (found in the managed array).
    for (let i = 0; i < this.CellsArray.length && !visibleCellAndIndex; i++) {
      let $closestManagedCell = $visibleCellElement.closest(this.CellsArray[i]);
      if ($closestManagedCell.length > 0) {

        let $closestGridstrap = this.$GetClosestGridstrap($visibleCellElement);

        if ($closestGridstrap.is(context.$el)) {
          visibleCellAndIndex = {
            index: i,
            $cell: this.CellsArray[i]
          };
        }
      }
    }

    return visibleCellAndIndex; 
  }

  $GetClosestGridstrap(element) { // looks up the tree to find the closest instantiated gridstap instance. May not be this one in the case of nested grids.
    let $ = this.setup.jQuery;

    let dataExistsInSelector = function(selector) {
      return $(selector).filter(function(){
        return !!$(this).data(Constants.DATA_GRIDSTRAP);
      });
    };
    // a little strange that we can;t select parents() and include element itself in the order desired, so we have to do it like this.
    let $currentElement = dataExistsInSelector(element);
    if ($currentElement.length){
      return $currentElement.first();
    }
    return dataExistsInSelector($(element).parents()).first(); 
  }

  $GetDraggingCell(){
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;

    let $draggedCell = $(this.setup.DragCellSelector);
    if (!$draggedCell.length) {
      return $(); //empty set
    }
    // closest gridstrap must be this one - could be nested, we don't want to pick that up.
    let $closestGridstrap = this.$GetClosestGridstrap($draggedCell);
    if (!$closestGridstrap.is(context.$el)){
      return $(); //empty set
    }

    return $draggedCell;          
  }

  MoveCell ($movingVisibleCell, $targetVisibleCell, gridstrapContext) { 
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let options = this.setup.Options;

    let $hiddenDragged = $movingVisibleCell.data(Constants.DATA_HIDDEN_CELL);
    let $hiddenTarget = $targetVisibleCell.data(Constants.DATA_HIDDEN_CELL);

    if ($hiddenDragged.is($hiddenTarget)) {
      return;
    }

    if (gridstrapContext !== context) {
      // moving between different gridstraps.
      if (this.AdditionalGridstrapDragTargetSelector) {
        // moving cells from this gridstrap to another (targetGridstrap).
        // target must be within specified options at init.
        let $targetGridstrap = $(this.AdditionalGridstrapDragTargetSelector).filter(function () {
          return $(this).data(Constants.DATA_GRIDSTRAP) === gridstrapContext;
        }).first();

        if ($targetGridstrap.length) {
          if (options.swapMode) {

            let preDetachPositionTarget = Utils.GetPositionAndSizeOfCell($targetVisibleCell);
            let preDetachPositionMoving = Utils.GetPositionAndSizeOfCell($movingVisibleCell);

            let $detachedTargetOriginalCell = gridstrapContext.detachCell($targetVisibleCell);
            let $detachedMovingOriginalCell = context.detachCell($movingVisibleCell);
            let wasDragging = $detachedMovingOriginalCell.hasClass(options.dragCellClass);
            if (wasDragging) {
              $detachedMovingOriginalCell.removeClass(options.dragCellClass);
            }

            Utils.SwapJQueryElements($detachedMovingOriginalCell, $detachedTargetOriginalCell);

            //re attach in opposing grids.
            let $reattachedMovingCell = gridstrapContext.attachCell($detachedMovingOriginalCell);
            let $reattachedTargetCell = context.attachCell($detachedTargetOriginalCell);

            // have to remove visibleCellClass that these two would now have
            // as that should have the css transition animation in it, 
            // and we want to bypass that, set position, then apply it, set position again. 
            Utils.ClearAbsoluteCSS($reattachedMovingCell);
            Utils.ClearAbsoluteCSS($reattachedTargetCell); 

            gridstrapContext.setCellAbsolutePositionAndSize($reattachedMovingCell, preDetachPositionMoving);
            context.setCellAbsolutePositionAndSize($reattachedTargetCell, preDetachPositionTarget);

            // $reattachedMovingCell.addClass(options.visibleCellClass);
            // $reattachedTargetCell.addClass(options.visibleCellClass);

            gridstrapContext.setCellAbsolutePositionAndSize($reattachedMovingCell, preDetachPositionTarget);
            context.setCellAbsolutePositionAndSize($reattachedTargetCell, preDetachPositionMoving);

            if (wasDragging) {
              $reattachedMovingCell.addClass(options.dragCellClass);
            } 

          } else {

            // insert mode.
            let preDetachPositionMoving = Utils.GetPositionAndSizeOfCell( $movingVisibleCell);

            let $detachedMovingOriginalCell = context.detachCell($movingVisibleCell);
            let wasDragging = $detachedMovingOriginalCell.hasClass(options.dragCellClass);
            if (wasDragging) {
              $detachedMovingOriginalCell.removeClass(options.dragCellClass);
            }

            Utils.DetachAndInsertInPlaceJQueryElement($detachedMovingOriginalCell, $hiddenTarget);

            let $reattachedMovingCell = gridstrapContext.attachCell($detachedMovingOriginalCell);

            // have to remove visibleCellClass that these two would now have
            // as that should have the css transition animation in it, 
            // and we want to bypass that, set position, then apply it, set position again. 
            $reattachedMovingCell.removeClass(options.visibleCellClass);
 
            gridstrapContext.setCellAbsolutePositionAndSize($reattachedMovingCell, preDetachPositionMoving); 

            $reattachedMovingCell.addClass(options.visibleCellClass);

            if (wasDragging) {
              $reattachedMovingCell.addClass(options.dragCellClass);
            }
          } 

          gridstrapContext.updateVisibleCellCoordinates();
          context.updateVisibleCellCoordinates();
        }
      }
    } else {
      // regular internal movement 
      if (options.swapMode) {
        Utils.SwapJQueryElements($hiddenDragged, $hiddenTarget);
      } else {
        Utils.DetachAndInsertInPlaceJQueryElement($hiddenDragged, $hiddenTarget);
      }

      context.updateVisibleCellCoordinates();
    }
  } //~moveCell

  ResizeCell ($cell, width, height) {
    let $ = this.setup.jQuery;
    let context = this.setup.Context;
    let $element = this.setup.$Element;

    let event = $.Event(Constants.EVENT_CELL_RESIZE, {
      width: width,
      height: height,
      target: $cell[0]
    });
    $element.trigger(event);

    if (event.isDefaultPrevented()){
      return;
    }

    let $hiddenCell = $cell.data(Constants.DATA_HIDDEN_CELL);
    $hiddenCell.css('width', width);
    $hiddenCell.css('height', height);

    context.updateVisibleCellCoordinates();
  } 

  $GetHiddenCellsInElementOrder () {
    let $ = this.setup.jQuery;
    let options = this.setup.Options;
    let $element = this.setup.$Element;
    let self = this; 

    let $attachedHiddenCells = $element.find(this.setup.HiddenCellSelector).filter(function () {
      let $linkedVisibleCell = $(this).data(Constants.DATA_VISIBLE_CELL);
      if (!$linkedVisibleCell || !$linkedVisibleCell.length) {
        return false;
      }
      for (var i = 0; i < self.CellsArray.length; i++) {
        if (self.CellsArray[i].is($linkedVisibleCell)) {
          return true;
        }
      }
      return false;
    }); 

    return $attachedHiddenCells;
  } 

  ModifyCellsArray(callback){
    callback(this.cellsArray);
  } 

  UpdateNonContiguousCellsForDrag($draggedCell, mouseEvent){
    let $ = this.setup.jQuery; 
    let options = this.setup.Options;   

    let furthestVisibleCellPositionAndSize = Utils.GetPositionAndSizeOfCell($draggedCell);

    let compare = (positionAndSize) => {
      return positionAndSize.left + positionAndSize.width +  
        (positionAndSize.top + positionAndSize.height) * 100000
    };
    let $hiddenCells = this.$GetHiddenCellsInElementOrder(); 
    $hiddenCells.each((i, e) => {
      if (!$(e).data(Constants.DATA_VISIBLE_CELL).hasClass(options.nonContiguousPlaceholderCellClass)){
        let positionAndSize = Utils.GetPositionAndSizeOfCell($(e));

        if (compare(positionAndSize) > compare(furthestVisibleCellPositionAndSize)){
          furthestVisibleCellPositionAndSize = positionAndSize;
        }
      }
    });

    let changed = this.AppendOrRemoveNonContiguousCellsWhile(($hiddenCells, appending) => {
      let lastHiddenCellPositionAndSize = Utils.GetPositionAndSizeOfCell( $hiddenCells.last());
 
      // A whole row of extra cells should exist.
      if (appending){
        // need at least 2* cell height worht of space at bottom of grid.
        return lastHiddenCellPositionAndSize.top - furthestVisibleCellPositionAndSize.top < furthestVisibleCellPositionAndSize.height * 2;     
      } else {
        return lastHiddenCellPositionAndSize.top - furthestVisibleCellPositionAndSize.top > furthestVisibleCellPositionAndSize.height * 2;
      }     
    });  

    if (changed){
      this.MoveDraggedCell(mouseEvent, $draggedCell); 
    }
  }

  AppendOrRemoveNonContiguousCellsWhile(appendWhilePredicate){     
    let $ = this.setup.jQuery;    
    let options = this.setup.Options;
    let context = this.setup.Context;

    let changed = false;

    let $hiddenCells = this.$GetHiddenCellsInElementOrder();  

    while (appendWhilePredicate($hiddenCells, true)) {
      // if mouse beyond or getting near end of static hidden element, then make some placeholder ones.
      // insert dummy cells if cursor is beyond where the cells finish.
      let $insertedCell = context.insertCell(
        options.nonContiguousCellHtml,
        $hiddenCells.length
      );
      $insertedCell.addClass(options.nonContiguousPlaceholderCellClass);
      let $insertedHiddenCell = $insertedCell.data(Constants.DATA_HIDDEN_CELL);

      $hiddenCells = $hiddenCells.add($insertedHiddenCell); 

      changed = true;
    } 

    // remove cells at end when we have too much.          
    let $lastHiddenCell = $hiddenCells.last();
    let $bottomRowHiddenCells = null;
    let $getBottomRowHiddenCells = () => {
      $bottomRowHiddenCells = $bottomRowHiddenCells || $hiddenCells.filter((i,e) => {
        return Utils.GetPositionAndSizeOfCell($(e)).top === Utils.GetPositionAndSizeOfCell($lastHiddenCell).top;
      });
      return $bottomRowHiddenCells;
    };   
    
    // remove all non-contiguous bottom row cells.
    while (appendWhilePredicate($hiddenCells, false) &&
      $getBottomRowHiddenCells().filter((i,e) => {
        return $(e).data(Constants.DATA_VISIBLE_CELL).hasClass(options.nonContiguousPlaceholderCellClass);
      }).length === $getBottomRowHiddenCells().length && 
      $getBottomRowHiddenCells().length > 0) {
      // while all bottom row cells are placeholders.

      context.removeCell($lastHiddenCell.data(Constants.DATA_VISIBLE_CELL));
      $hiddenCells = $hiddenCells.not($lastHiddenCell);

      // update new last hidden cell.
      $lastHiddenCell = $hiddenCells.last(); 

      $bottomRowHiddenCells = null; // force refilter. 

      changed = true;
    }  

    return changed;
  }


  get AdditionalGridstrapDragTargetSelector(){
    return this.additionalGridstrapDragTargetSelector;
  }
  set AdditionalGridstrapDragTargetSelector(value){
    this.additionalGridstrapDragTargetSelector = value;
  }

  get LastMouseOverCellTarget(){
    return this.lastMouseOverCellTarget;
  }
  set LastMouseOverCellTarget(value){
    this.lastMouseOverCellTarget = value;
  }
  
  get CellsArray(){
    return this.cellsArray;
  }  
}