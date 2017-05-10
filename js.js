(function ($, window, document) {
  $.Gridstrap = function (el, options) {

    if ("undefined" == typeof jQuery) throw new Error("yeah nah's JavaScript requires jQuery");
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;

    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;

    var _internal = {
      constants: Object.freeze({
        DATA_GRIDSTRAP: 'gridstrap', 
        DATA_HIDDEN_CELL: 'gridstrap-hidden-cell', //two way link
        DATA_VISIBLE_CELL: 'gridstrap-visible-cell', //two way link
        DATA_MOUSEDOWN_CELL_POSITION: 'gridstrap-mousedown-cell-position',
        DATA_MOUSEDOWN_PAGE_POSITION: 'gridstrap-mousedown-screen-position',
        DATA_CELL_POSITION_AND_SIZE: 'gridstrap-position-size',
        DATA_DRAGGING_TARGETER: 'gridstrap-overridedrag'
      }),
      cellsArray: [],
      initCellsHiddenCopyAndSetAbsolutePosition: function ($cell) {
        _internal.cellsArray.push($cell);

        // Create html clone to take place of original $cell.
        // Treat it as the 'hidden' cell, and turn the original $cell
        // into the visible/absolute cell.

        var htmlOfOriginal = base.options.getHtmlOfSourceCell.call(base, $cell);
        var positionNSize = base.options.getAbsolutePositionAndSizeOfCell.call(base, $cell);

        $cell.before(htmlOfOriginal);
        var $hiddenClone = $cell.prev();

        $hiddenClone.addClass(base.options.hiddenCellClass);
        $cell.addClass(base.options.visibleCellClass);

        // make it ref hidden cloned cell, both ways.
        $cell.data(_internal.constants.DATA_HIDDEN_CELL, $hiddenClone);
        $hiddenClone.data(_internal.constants.DATA_VISIBLE_CELL, $cell);

        // put absolute $cell in container.
        $(_internal.visibleCellWrapperSelector).append($cell.detach());

        base.setVisibleCellPositionAndSize($cell, positionNSize);
      }, 
      visibleCellWrapperSelector: null, //initialised in init()
      draggedCellSelector: null, // initialised in init() 
      recentDragMouseOvers: [], // tuple of element and timestamp 
      lastMouseOverCellTarget: null, // for rearranging on mouseup
      lastMoveMovePageCoordinates: { // cause certain mouseevents dont have this data.
        pageX: 0,
        pageY: 0
      },
      moveCell: function ($movingVisibleCell, $targetVisibleCell, targetGridstrap) {
        // targetGridstrap is optional.
        var swapJQueryElements = function ($a, $b) {
          var getInPlaceFunction = function ($element) {
            var $other = $a.is($element) ? $b : $a;
            var $next = $element.next();
            var $prev = $element.prev();
            var $parent = $element.parent();
            // cannot swap a with b exactly if there are no other siblings.
            if ($next.length > 0 && !$next.is($other)) {
              return function ($newElement) {
                $next.before($newElement);
              }
            } else if ($prev.length > 0 && !$prev.is($other)) {
              return function ($newElement) {
                $prev.after($newElement);
              }
            } else {
              // no siblings, so can just use append
              return function ($newElement) {
                $parent.append($newElement);
              }
            }
          };

          var aInPlaceFunc = getInPlaceFunction($a);
          var bInPlaceFunc = getInPlaceFunction($b);
          var $aDetached = $a.detach();
          var $bDetached = $b.detach();
          // swap finally.
          bInPlaceFunc($aDetached);
          aInPlaceFunc($bDetached);
        };

        var detachAndInsertInPlaceJQueryElement = function ($detachElement, $inPlaceElement) {
          var inPlaceElementIndex = $inPlaceElement.index();
          var detachElementIndex = $detachElement.index();

          var $detachedElement = $detachElement.detach();

          if (inPlaceElementIndex < detachElementIndex) {
            $inPlaceElement.before($detachedElement);
          } else {
            $inPlaceElement.after($detachedElement);
          }
        };

        var $hiddenDragged = $movingVisibleCell.data(_internal.constants.DATA_HIDDEN_CELL);
        var $hiddenTarget = $targetVisibleCell.data(_internal.constants.DATA_HIDDEN_CELL);

        if ($hiddenDragged.is($hiddenTarget)) {
          return;
        }

        if (targetGridstrap){ 
          if (base.options.additionalDragGridstrapTargetSelector && !$(targetGridstrap).is(base.$el)){
            // moving cells from this gridstrap to another (targetGridstrap).
            // target must be within specified options at init.
            var $targetGridstrap = $(base.options.additionalDragGridstrapTargetSelector).filter(function(){
              return $(this).is(targetGridstrap);
            });

            if ($targetGridstrap.length > 0){
              var targetGridstrap = $targetGridstrap.data(_internal.DATA_GRIDSTRAP);
              if (base.options.swapMode) { 

                var preDetachPositionTarget = targetGridstrap.getAbsolutePositionAndSizeOfCell($targetVisibleCell);
                var preDetachPositionMoving = base.getAbsolutePositionAndSizeOfCell($movingVisibleCell);

                var $detachedTargetOriginalCell = targetGridstrap.detachCell($targetVisibleCell);
                var $detachedMovingOriginalCell = base.detachCell($movingVisibleCell);

                swapJQueryElements($detachedMovingOriginalCell, $detachedTargetOriginalCell);

                //re attach in opposing grids.
                var $reattachedMovingCell = targetGridstrap.attachCell($detachedMovingOriginalCell);
                var $reattachedTargetCell = base.attachCell($detachedTargetOriginalCell);
                
                // have to remove visibleCellClass that these two would now have
                // as that should have the css transition animation in it, 
                // and we want to bypass that, set position, then apply it, set position again. 
                $reattachedMovingCell.removeClass(base.options.visibleCellClass);
                $reattachedTargetCell.removeClass(base.options.visibleCellClass);
                
                targetGridstrap.setVisibleCellPositionAndSize($reattachedMovingCell, preDetachPositionTarget);
                base.setVisibleCellPositionAndSize($reattachedTargetCell, preDetachPositionMoving);

                $reattachedMovingCell.addClass(base.options.visibleCellClass);
                $reattachedTargetCell.addClass(base.options.visibleCellClass);

                targetGridstrap.updateVisibleCellCoordinates();
                base.updateVisibleCellCoordinates();

              } else { 

                // insert mode.
                var preDetachPositionMoving = base.getAbsolutePositionAndSizeOfCell($movingVisibleCell);

                var $detachedMovingOriginalCell = base.detachCell($movingVisibleCell);

                detachAndInsertInPlaceJQueryElement($detachedMovingOriginalCell, $hiddenTarget);

                var $reattachedMovingCell = targetGridstrap.attachCell($detachedMovingOriginalCell);

                // have to remove visibleCellClass that these two would now have
                // as that should have the css transition animation in it, 
                // and we want to bypass that, set position, then apply it, set position again. 
                $reattachedMovingCell.removeClass(base.options.visibleCellClass); 
                
                targetGridstrap.setVisibleCellPositionAndSize($reattachedMovingCell, preDetachPositionMoving); 

                $reattachedMovingCell.addClass(base.options.visibleCellClass); 

                targetGridstrap.updateVisibleCellCoordinates();
              }
            }
          }
        } else {
          // regular internal movement 
          if (base.options.swapMode) {
            swapJQueryElements($hiddenDragged, $hiddenTarget);
          } else { 
            detachAndInsertInPlaceJQueryElement($hiddenDragged, $hiddenTarget);
          }

          base.updateVisibleCellCoordinates();
        }
      },
      getHiddenCells: function () {
        // Get all hidden cloned cells, then see if their linked visible cells are managed. Base their returned order off hidden cell html order. 

        // just find all children and work from there, can't rely on selcting via base.hiddenCellClass because later elements may have been added.
        var $attachedHiddenCells = $(base.$el).find('*').filter(function () {
          var $linkedVisibleCell = $(this).data(_internal.constants.DATA_VISIBLE_CELL);
          if (!$linkedVisibleCell || $linkedVisibleCell.length === 0) {
            return false;
          }
          for (var i = 0; i < _internal.cellsArray.length; i++) {
            if (_internal.cellsArray[i].is($linkedVisibleCell)) {
              return true;
            }
          }
          return false;
        });

        return $attachedHiddenCells;
      },

      init: function () {
        base.options = $.extend({}, $.Gridstrap.defaultOptions, options);

        // Do nothing if it's already been done before.
        var existingInitialisation = base.$el.data(_internal.constants.DATA_GRIDSTRAP);
        if (existingInitialisation) {
          if (base.options.debug) {
            console.log('Gridstrap already initialised for element: ' + base.el.nodeName);
          }
          return;
        } else {
          // Add a reverse reference to the DOM object
          base.$el.data(_internal.constants.DATA_GRIDSTRAP, base);

          if (base.options.debug) {
            console.log('Gridstrap initialised for element: ' + base.el.nodeName);
          }
        }

        var genId = function () {
          return 'gridstrap-' + Math.random().toString(36).substr(2, 5) + Math.round(Math.random() * 1000).toString();
        };

        var initHiddenCopiesAndSetAbsolutePositions = function () {

          // must pick cells before potentially adding child wrapper to selection.
          var $originalCells = base.$el.find(base.options.gridCellSelector);

          var wrapperGeneratedId = genId();
          _internal.visibleCellWrapperSelector = '#' + wrapperGeneratedId;
          // drag selector must be within wrapper div. Turn class name/list into selector.
          _internal.draggedCellSelector = _internal.visibleCellWrapperSelector + ' ' + base.options.draggedCellClass.replace(/(^ *| +)/g, '.') + ':first';

          // if option not specified, use JQuery element as parent for wrapper.
          base.options.visibleCellContainerParentSelector = base.options.visibleCellContainerParentSelector || base.$el;
          $(base.options.visibleCellContainerParentSelector).append('<div id="' + wrapperGeneratedId + '" class="' + base.options.visibleCellContainerClass + '"></div>');

          $originalCells.each(function (e) {
            _internal.initCellsHiddenCopyAndSetAbsolutePosition($(this));
          });
        };

        var setAndGetElementRecentlyDraggedMouseOver = function (element) {
          var d = new Date();
          var n = d.getTime();
          for (var i = 0; i < _internal.recentDragMouseOvers.length; i++) {
            if (_internal.recentDragMouseOvers[i].n + base.options.dragMouseoverThrottle < n) {
              // expired.
              _internal.recentDragMouseOvers.splice(i, 1);
            }
            if (i < _internal.recentDragMouseOvers.length && $(_internal.recentDragMouseOvers[i].e).is(element)) {
              return true;
            }
          }
          _internal.recentDragMouseOvers.push({
            n: n,
            e: element
          });
          return false;
        };

        var onDragstart = function (mouseEvent, $cell) {
          mouseEvent.preventDefault();
        };

        var onMousedown = function (mouseEvent, $toBeDragged) { 
          if (base.options.enableDragging && !$toBeDragged.hasClass(base.options.draggedCellClass)) {

            $toBeDragged.data(_internal.constants.DATA_MOUSEDOWN_PAGE_POSITION, {
              x: mouseEvent.pageX,
              y: mouseEvent.pageY
            });
            $toBeDragged.data(_internal.constants.DATA_MOUSEDOWN_CELL_POSITION, base.options.getAbsolutePositionAndSizeOfCell.call(base, $toBeDragged));

            $toBeDragged.addClass(base.options.draggedCellClass);

            moveDraggedCell(mouseEvent, $toBeDragged);
          }
        };

        var onMouseover = function (mouseEvent, $cell) {
          // clear initially.
          _internal.lastMouseOverCellTarget = null;

          if (!base.options.enableDragging){
            return;
          }
 
          var $draggedCell = $(_internal.draggedCellSelector);  
          if ($draggedCell && $draggedCell.length){
            // Is currently dragging. 
            if ($cell && $draggedCell.closest($cell).length === 0) {
              // make sure you're not mouseover-ing the dragged cell itself.
              // css' 'pointer-events', 'none' should do this job, but this double checks.

              _internal.lastMouseOverCellTarget = $cell;

              if (!setAndGetElementRecentlyDraggedMouseOver($cell)) {
                // do not move two cells that have recently already moved.

                if (base.options.rearrangeWhileDragging) {

                  _internal.moveCell($draggedCell, $cell); 

                  // reset dragged object to mouse pos, not pos of hidden cells. 
                  moveDraggedCell(mouseEvent, $draggedCell);
                }
              }
            }  
          } 
        };

        var onMousemove = function (mouseEvent) {
          if (base.isCurrentlyDragging()){
            // we can be dragging but it may not be from this grid.
            var $draggedCell = $(_internal.draggedCellSelector);
            if ($draggedCell.length > 0) { // should just be one.
              moveDraggedCell(mouseEvent, $draggedCell);
            } 

            ////////not overlapping any existing managed cell while dragging.
            var nonContiguousOptions = base.options.nonContiguousOptions;
            var nonContiguousSelector = nonContiguousOptions.selector;
            if (nonContiguousSelector &&
              nonContiguousSelector.length) {

              var $hiddenCells = base.getHiddenCells();

              var lastHiddenCellPositionAndSize = base.options.getAbsolutePositionAndSizeOfCell.call(base, $hiddenCells.last());
              var draggedCellPositionAndSize = base.options.getAbsolutePositionAndSizeOfCell.call(base, $draggedCell);

              while (draggedCellPositionAndSize.y + draggedCellPositionAndSize.h > lastHiddenCellPositionAndSize.y) {
                // if mouse beyond or getting near end of static hidden element, then make some placeholder ones.
                // insert dummy cells if cursor is beyond where the cells finish.
                var $insertedCell = base.insertCell(
                  nonContiguousOptions.getHtml(),
                  $hiddenCells.length
                );
                $insertedCell.addClass(base.options.nonContiguousPlaceholderCellClass);
                var $insertedHiddenCell = $insertedCell.data(_internal.constants.DATA_HIDDEN_CELL);

                // might have to keep adding them.
                lastHiddenCellPositionAndSize = base.options.getAbsolutePositionAndSizeOfCell.call(base, $insertedHiddenCell);
                draggedCellPositionAndSize = base.options.getAbsolutePositionAndSizeOfCell.call(base, $draggedCell);

                $hiddenCells = $hiddenCells.add($insertedHiddenCell);
              }
              // remove ones at end when we have too much.
              // THIS PART FIXINFG BELOW BPLEASE.l
              var $lastHiddenCell = $hiddenCells.last();
              while (draggedCellPositionAndSize.y + draggedCellPositionAndSize.h < lastHiddenCellPositionAndSize.y &&
                $lastHiddenCell.data(_internal.constants.DATA_VISIBLE_CELL).hasClass(base.options.nonContiguousPlaceholderCellClass)) {

                $hiddenCells = $hiddenCells.not($lastHiddenCell);

                base.removeCell($lastHiddenCell.data(_internal.constants.DATA_VISIBLE_CELL));

                $lastHiddenCell = $hiddenCells.last();

                lastHiddenCellPositionAndSize = base.options.getAbsolutePositionAndSizeOfCell.call(base, $lastHiddenCell);
              var draggedCellPositionAndSize = base.options.getAbsolutePositionAndSizeOfCell.call(base, $draggedCell);
              }
            }
          }
        };

        var onMouseup = function (mouseEvent) {
          if (base.isCurrentlyDragging()){
            // we may be dragging but it might not be from this grid.
          }
          var $draggedCell = $(_internal.draggedCellSelector);
          if ($draggedCell.length > 0) {

            // no more dragging.
            $draggedCell.removeClass(base.options.draggedCellClass);
            $draggedCell.removeData(_internal.constants.DATA_MOUSEDOWN_PAGE_POSITION);
            // set dragging mode off for other linked grids
            if (base.options.additionalDragGridstrapTargetSelector){
              $(base.options.additionalDragGridstrapTargetSelector).each(function(){
                $(this).data(_internal.constants.DATA_DRAGGING_TARGETER, false);
            });

            var cellOriginalPosition = $draggedCell.data(_internal.constants.DATA_CELL_POSITION_AND_SIZE);
            base.setVisibleCellPositionAndSize($draggedCell, cellOriginalPosition);

            if (_internal.lastMouseOverCellTarget && base.enableDragging) {
              if (!base.options.rearrangeWhileDragging) {
                // just rearrange on mouseup

                _internal.moveCell($draggedCell, _internal.lastMouseOverCellTarget);
              }
            }
          }
        };

        var moveDraggedCell = function (mouseEvent, $cell) {
          // user can do something custom for dragging if they want.
          var callbackResult = base.options.mouseMoveDragCallback.call(base, $cell, mouseEvent);
          if (!callbackResult && typeof (callbackResult) === 'boolean') {
            return;
          }

          var originalMouseDownCellPosition = $cell.data(_internal.constants.DATA_MOUSEDOWN_CELL_POSITION);
          var originalMouseDownScreenPosition = $cell.data(_internal.constants.DATA_MOUSEDOWN_PAGE_POSITION);

          base.options.setPositionOfDraggedCell.call(base, originalMouseDownCellPosition, originalMouseDownScreenPosition, $cell, mouseEvent);

          //now remove mouse events from dragged cell, because we need to test for overlap of underneath things.
          var oldPointerEvents = $cell.css('pointer-events');
          $cell.css('pointer-events', 'none');

          var element = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);
          var cellAndIndex = base.getCellAndIndex(element);
          if (cellAndIndex) {
            // have to create event here like this other mouse coords are missing.
            cellAndIndex.$cell.trigger(
              $.Event('mouseover.gridstrap', {
                pageX : mouseEvent.pageX,
                pageY: mouseEvent.pageY,
                target: cellAndIndex.$cell[0]
              }));
          } else {
            // have dragged over non-managed cell.
            if (base.options.additionalDragGridstrapTargetSelector){
              $(base.options.additionalDragGridstrapTargetSelector).each(function(){
 
                var additionalData = $(this).data(_internal.constants.DATA_GRIDSTRAP);
                if (additionalData){
                  var additionalDataCell = additionalData.getCellAndIndex(element);
                  if (additionalDataCell) {
                    // have to create event here like this other mouse coords are missing.
                    additionalDataCell.$cell.trigger(
                      $.Event('mouseover.gridstrap', {
                        pageX : mouseEvent.pageX,
                        pageY: mouseEvent.pageY,
                        target: additionalDataCell.$cell[0]
                      }));
                  }
                }
              });
            }
          }

          // restore pointer-events css.
          $cell.css('pointer-events', oldPointerEvents);
        };

        // only call event if occured on one of managed cells that has been initialised.
        var handleCellMouseEvent = function (eventName, onlyCallWhenTargetsCell, callback) {
          var draggableSelector = base.options.gridCellSelector + ' ' + base.options.dragCellHandleSelector;
          if (base.options.dragCellHandleSelector === $.Gridstrap.defaultOptions.dragCellHandleSelector ||
            eventName === 'mouseover') {
            // If the default settings apply for drag handle mouse events,
            // or if mouseover, then we want the event to be lenient as to what triggers it.
            // Prepend selector with grid cell itself as an OR/, selector.
            // To become the cell itself OR any dragCellHandleSelector within the cell. 
            draggableSelector = base.options.gridCellSelector + ',' + draggableSelector;
          }

          $(base.options.visibleCellContainerParentSelector).on(eventName, function (mouseEvent) {
            var $cellDragElement = $(mouseEvent.target);
            var managedCell = base.getCellAndIndex($cellDragElement);
            // user clicked on perhaps child element of draggable element.
            
            if (onlyCallWhenTargetsCell && managedCell === null){
              // do nothing if mouse is not interacting with a cell
              // and we're not meant to do anything unless it is.
              return;
            }
            // $managedCell may be null, callback needs to take care of that.
            callback(mouseEvent, managedCell && managedCell.$cell);
          });
        };

        initHiddenCopiesAndSetAbsolutePositions();

        handleCellMouseEvent('dragstart.gridstrap', true, onDragstart);
        handleCellMouseEvent('mousedown.gridstrap', true, onMousedown);
        // pass false as param because we need to do non-contiguous stuff in there.
        handleCellMouseEvent('mouseover.gridstrap', false, onMouseover);

        // it is not appropriate to confine the events to the visible cell wrapper.
        $(base.options.mouseMoveSelector)
          .on('mousemove.gridstrap', onMousemove)
          .on('mouseup.gridstrap', onMouseup);

        if (base.options.updateCoordinatesOnWindowResize) {
          $(window).on('resize.gridstrap', base.updateVisibleCellCoordinates);
        }

      } //~init()

    }; //~internal oject

    // Public methods below.
    // base.isCurrentlyDragging = function() {
    //   var override = !!base.$el.data(_internal.constants.DATA_DRAGGING_TARGETER);
    //   if (override){
    //     return true;
    //   }
    //   var $draggedCell = $(_internal.draggedCellSelector);
    //   return $draggedCell.length > 0; // should just be one.
    // };

    base.updateVisibleCellCoordinates = function () {
      for (var i = 0; i < _internal.cellsArray.length; i++) {
        var $this = _internal.cellsArray[i];

        var $hiddenClone = $this.data(_internal.constants.DATA_HIDDEN_CELL);

        var positionNSizeOfHiddenClone = base.options.getAbsolutePositionAndSizeOfCell.call(base, $hiddenClone);

        base.setVisibleCellPositionAndSize($this, positionNSizeOfHiddenClone);
      }
    };

    // returns jquery object of new cell.
    // index is optional.
    base.insertCell = function (cellHtml, index) {
      var $existingHiddenCells = _internal.getHiddenCells();
      if (typeof (index) === 'undefined') {
        index = $existingHiddenCells.length;
      }

      var $insertedCell;
      if (index === $existingHiddenCells.length) {
        if ($existingHiddenCells.length === 0) {
          // the grid is empty.
          $insertedCell = $(cellHtml).appendTo(base.$el);
        } else {
          $insertedCell = $(cellHtml).insertAfter($existingHiddenCells.last());
        }
      } else {
        $insertedCell = $(cellHtml).insertBefore($existingHiddenCells.eq(index));
      }

      base.attachCell($insertedCell);

      return $insertedCell;
    };

    base.attachCell = function (selector) {

      if (!$(selector).closest(base.$el).is(base.$el)) {
        throw 'Cannot attach element that is not a child of gridstrap parent';
      }

      _internal.initCellsHiddenCopyAndSetAbsolutePosition(selector);

      base.updateVisibleCellCoordinates();

      return $(selector);
    };

    base.detachCell = function (selector) {

      var cellNIndex = base.getCellAndIndex(selector);

      var $hiddenClone = cellNIndex.$cell.data(_internal.constants.DATA_HIDDEN_CELL);

      var $detachedVisibleCell = cellNIndex.$cell.detach();

      // remove 'visible' things, and put the cell back where it came from.
      $detachedVisibleCell.css('top', '');
      $detachedVisibleCell.css('left', '');
      $detachedVisibleCell.css('width', '');
      $detachedVisibleCell.css('height', '');
      $detachedVisibleCell.removeData(_internal.constants.DATA_HIDDEN_CELL);
      $detachedVisibleCell.removeClass(base.options.visibleCellClass);

      var $reattachedOriginalCell = $detachedVisibleCell.insertAfter($hiddenClone);

      // remove hidden clone.
      $hiddenClone.remove();

      // finally remove from managed array
      _internal.cellsArray.splice(cellNIndex.index, 1);

      return $reattachedOriginalCell;
    };

    base.removeCell = function (selector) {

      var $detachedCell = base.detachCell(selector);

      $detachedCell.remove();

      base.updateVisibleCellCoordinates();
    };

    base.moveCell = function (selector, toIndex, targetGridstrap) {
      var cellNIndex = base.getCellAndIndex(selector);

      var $existingVisibleCells = base.getCells();

      _internal.moveCell(cellNIndex.$cell, $existingVisibleCells.eq(toIndex));
    };

    base.moveCellToCoordinates = function(selector, x, y, targetGridstrap){
      // TODO, use document.getlement at blah
    };

    base.getCells = function () {
      var $attachedHiddenCells = _internal.getHiddenCells();

      var attachedVisibleCellElements = $attachedHiddenCells.map(function () {
        return $(this).data(_internal.constants.DATA_VISIBLE_CELL)[0];
      });

      return $(attachedVisibleCellElements);
    };

    base.getHiddenCells = function () {

      return _internal.getHiddenCells();;
    };

    base.getCellContainer = function () {
      return $(_internal.visibleCellWrapperSelector);
    };

    base.updateOptions = function (newOptions) {
      base.options = $.extend({}, base.options, newOptions);
    };

    base.getCellAndIndex = function(element){ // element or jquery selector, child of cell or it itself.
      if (!element) {
        return null;
      }

      var $visibleCellElement = $(element);

      var visibleCellAndIndex = null;
      // visibleCellAndIndex.$cell might be a child element/control perhaps of $visibleCell (found in the managed array).
      for (var i = 0; i < _internal.cellsArray.length && !visibleCellAndIndex; i++) {
        if ($visibleCellElement.closest(_internal.cellsArray[i]).length > 0) {
          visibleCellAndIndex = {
            index: i,
            $cell: _internal.cellsArray[i]
          };
        }
      }

      return visibleCellAndIndex;

      // I DONT THINK THIS IS NECESSARY?
      // check if linked hidden element is NOT in parent element.
      // var $linkedHiddenCell = visibleCellAndIndex.$cell.data(_internal.constants.DATA_HIDDEN_CELL);
      // if (!$linkedHiddenCell.closest(base.$el).is(base.$el)) {
      //   return noCell;
      // }
    };

  // TODO Rename.
    base.setCellAbsolutePositionAndSize = function ($cell, positionAndSize) {

      // relied upon when drag-stop. 
      $cell.data(_internal.constants.DATA_CELL_POSITION_AND_SIZE, positionAndSize);

      $cell.css('top', positionNSize.y);
      $cell.css('left', positionNSize.x);
      $cell.css('width', positionNSize.w);
      $cell.css('height', positionNSize.h);
    },

    // Initialiser
    _internal.init();

    base._internal = _internal;
  };

  $.Gridstrap.defaultOptions = {
    gridCellSelector: '>*', // relative to parent element
    hiddenCellClass: 'gridstrap-cell-hidden',
    visibleCellClass: 'gridstrap-cell-visible',
    dragCellHandleSelector: '*', // relative to and including cell element.
    draggedCellClass: 'gridstrap-cell-drag',
    mouseMoveSelector: 'body', // detect mousemouse and mouseup events within this element.
    visibleCellContainerParentSelector: null, // null by default, use Jquery parent element.
    visibleCellContainerClass: 'gridstrap-container',
    nonContiguousPlaceholderCellClass: 'gridstack-noncontiguous',
    getAbsolutePositionAndSizeOfCell: function ($cell) {
      if (this.options.debug && !$cell.is(':visible')) {
        console.log('Grid cell is invisible. Gridstrap should not initialise an invisible grid. (' + this.el.nodeName + ': ' + $cell[0].nodeName + ')');
      }
      var position = $cell.offset();
      var w = $cell.outerWidth();
      var h = $cell.outerHeight();
      return {
        x: position.left,
        y: position.top,
        w: w,
        h: h
      };
    },
    getHtmlOfSourceCell: function ($cell) {
      return $cell[0].outerHTML;
    },
    setPositionOfDraggedCell: function (originalMouseDownCellPosition, originalMouseDownScreenPosition, $cell, mouseEvent) { 
      var left = mouseEvent.pageX + originalMouseDownCellPosition.x - originalMouseDownScreenPosition.x;
      var top = mouseEvent.pageY + originalMouseDownCellPosition.y - originalMouseDownScreenPosition.y;
      $cell.css('left', left);
      $cell.css('top', top);
    },
    mouseMoveDragCallback: function ($cell, mouseEvent) {
      // do whatever you want.
      // return false to prevent normal operation.
    },
    enableDragging: true,
    rearrangeWhileDragging: true,
    swapMode: false,
    nonContiguousOptions: {
      selector: null,
      getHtml: function () {
        return null;
      }
    },
    updateCoordinatesOnWindowResize: true,
    debug: false,
    dragMouseoverThrottle: 500,
    additionalDragGridstrapTargetSelector: null //can drop onto other grids.
  };

  $.fn.gridstrap = function (options) {
    return this.each(function () {
      (new $.Gridstrap(this, options));
    });
  };

})(jQuery, window, document);
