(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  generateRandomId: function () {
    return Math.random().toString(36).substr(2, 5) + Math.round(Math.random() * 1000).toString();
  }
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Setup {
  constructor(plugin) {
    this.plugin = plugin;

    this.something = 'ok';
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Setup;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  DATA_GRIDSTRAP: 'gridstrap',
  DATA_HIDDEN_CELL: 'gridstrap-hidden-cell',
  DATA_VISIBLE_CELL: 'gridstrap-visible-cell',
  DATA_MOUSEDOWN_CELL_POSITION: 'gridstrap-mousedown-cell-position',
  DATA_MOUSEDOWN_PAGE_POSITION: 'gridstrap-mousedown-screen-position',
  DATA_CELL_POSITION_AND_SIZE: 'gridstrap-position-size',
  EVENT_DRAGSTART: 'dragstart',
  EVENT_MOUSEDOWN: 'mousedown',
  EVENT_MOUSEOVER: 'mouseover',
  EVENT_MOUSEMOVE: 'mousemove',
  EVENT_MOUSEUP: 'mouseup',
  EVENT_RESIZE: 'resize',
  EVENT_CELL_RESIZE: 'cellresize'
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup__ = __webpack_require__(1);


class Handlers {

  constructor(setup) {
    this.setup = setup;
  }

  onDragstart(mouseEvent, $cell, gridstrapData) {
    if (gridstrapData === this.base) {
      mouseEvent.preventDefault();
    }
  }

  onMousedown(mouseEvent, $cell, gridstrapData) {

    if (gridstrapData !== this.base) {
      return;
    }

    if (this.base.options.resizeHandleSelector && $(mouseEvent.target).closest(this.base.options.resizeHandleSelector).length) {
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

    if (this.base.options.enableDragging && !$cell.hasClass(this.base.options.dragCellClass)) {

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

  onMousemove(mouseEvent) {

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
      if ($draggedCell.length) {
        // should just be one.

        _internal.moveDraggedCell(mouseEvent, $draggedCell);

        // ATTEMPT TO GET NONCONTIG WOKING...
        ////////not overlapping any existing managed cell while dragging.
        var nonContiguousOptions = this.base.options.nonContiguousOptions;
        var nonContiguousSelector = nonContiguousOptions.selector;
        if (nonContiguousSelector && nonContiguousSelector.length) {

          var $hiddenCells = this.base.getHiddenCells();

          var lastHiddenCellPositionAndSize = this.base.options.getAbsolutePositionAndSizeOfCell.call(this.base, $hiddenCells.last());
          var draggedCellPositionAndSize = this.base.options.getAbsolutePositionAndSizeOfCell.call(this.base, $draggedCell);

          while (draggedCellPositionAndSize.y + draggedCellPositionAndSize.h > lastHiddenCellPositionAndSize.y) {
            // if mouse beyond or getting near end of static hidden element, then make some placeholder ones.
            // insert dummy cells if cursor is beyond where the cells finish.
            var $insertedCell = this.base.insertCell(nonContiguousOptions.getHtml(), $hiddenCells.length);
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
          while (draggedCellPositionAndSize.y + draggedCellPositionAndSize.h < lastHiddenCellPositionAndSize.y && $lastHiddenCell.data(this.base.constants.DATA_VISIBLE_CELL).hasClass(this.base.options.nonContiguousPlaceholderCellClass)) {

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

  onMouseup(mouseEvent) {
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

      if (_internal.lastMouseOverCellTarget && !this.base.options.rearrangeWhileDragging) {
        // else just rearrange on mouseup
        _internal.moveCell($draggedCell, _internal.lastMouseOverCellTarget, this.base);
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Handlers;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__handlers__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__setup__ = __webpack_require__(1);





(function ($, window, document) {
  $.Gridstrap = function (el, options) {

    if ("undefined" == typeof jQuery) throw new Error("yeah nah's JavaScript requires jQuery");
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;

    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;

    base.constants = Object.freeze(__WEBPACK_IMPORTED_MODULE_0__constants__["a" /* default */]);

    base.setup = new __WEBPACK_IMPORTED_MODULE_3__setup__["a" /* Setup */](base);

    var _internal = {
      idPrefix: null, // set in init.
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
        $cell.data(base.constants.DATA_HIDDEN_CELL, $hiddenClone);
        $hiddenClone.data(base.constants.DATA_VISIBLE_CELL, $cell);

        // put absolute $cell in container.
        $(_internal.visibleCellContainerSelector).append($cell.detach());

        base.setCellAbsolutePositionAndSize($cell, positionNSize);
      },
      visibleCellContainerSelector: null, //initialised in init()
      dragCellSelector: null, // initialised in init() 
      resizeCellSelector: null, // initialised in init() 
      recentDragMouseOvers: [], // tuple of element and timestamp 
      lastMouseOverCellTarget: null, // for rearranging on mouseup
      lastMoveMovePageCoordinates: { // cause certain mouseevents dont have this data.
        pageX: 0,
        pageY: 0
      },
      additionalGridstrapDragTargetSelector: null, //can drop onto other grids.
      $getClosestGridstrap: function (element) {
        // looks up the tree to find the closest instantiated gridstap instance. May not be this one in the case of nested grids.
        var dataExistsInSelector = function (selector) {
          return $(selector).filter(function () {
            return !!$(this).data(base.constants.DATA_GRIDSTRAP);
          });
        };
        // a little strange that we can;t select parents() and include element itself in the order desired, so we have to do it like this.
        var $currentElement = dataExistsInSelector(element);
        if ($currentElement.length) {
          return $currentElement.first();
        }
        return dataExistsInSelector($(element).parents()).first();
      },
      getCellAndInternalIndex: function (element) {
        // element or jquery selector, child of cell or it itself.
        if (!element) {
          return null;
        }

        var $visibleCellElement = $(element);

        var visibleCellAndIndex = null;
        // visibleCellAndIndex.$cell might be a child element/control perhaps of $visibleCell (found in the managed array).
        for (var i = 0; i < _internal.cellsArray.length && !visibleCellAndIndex; i++) {
          var $closestManagedCell = $visibleCellElement.closest(_internal.cellsArray[i]);
          if ($closestManagedCell.length > 0) {

            var $closestGridstrap = _internal.$getClosestGridstrap($visibleCellElement);

            if ($closestGridstrap.is(base.$el)) {
              visibleCellAndIndex = {
                index: i,
                $cell: _internal.cellsArray[i]
              };
            }
          }
        }

        return visibleCellAndIndex;

        // I DONT THINK THIS IS NECESSARY?
        // check if linked hidden element is NOT in parent element.
        // var $linkedHiddenCell = visibleCellAndIndex.$cell.data(base.constants.DATA_HIDDEN_CELL);
        // if (!$linkedHiddenCell.closest(base.$el).is(base.$el)) {
        //   return noCell;
        // }
      },

      moveCell: function ($movingVisibleCell, $targetVisibleCell, gridstrapData) {
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
              };
            } else if ($prev.length > 0 && !$prev.is($other)) {
              return function ($newElement) {
                $prev.after($newElement);
              };
            } else {
              // no siblings, so can just use append
              return function ($newElement) {
                $parent.append($newElement);
              };
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

        var $hiddenDragged = $movingVisibleCell.data(base.constants.DATA_HIDDEN_CELL);
        var $hiddenTarget = $targetVisibleCell.data(base.constants.DATA_HIDDEN_CELL);

        if ($hiddenDragged.is($hiddenTarget)) {
          return;
        }

        if (gridstrapData !== base) {
          // moving between different gridstraps.
          if (_internal.additionalGridstrapDragTargetSelector) {
            // moving cells from this gridstrap to another (targetGridstrap).
            // target must be within specified options at init.
            var $targetGridstrap = $(_internal.additionalGridstrapDragTargetSelector).filter(function () {
              return $(this).data(base.constants.DATA_GRIDSTRAP) === gridstrapData;
            });

            if ($targetGridstrap.length > 0) {
              if (base.options.swapMode) {

                var preDetachPositionTarget = gridstrapData.options.getAbsolutePositionAndSizeOfCell.call(gridstrapData, $targetVisibleCell);
                var preDetachPositionMoving = base.options.getAbsolutePositionAndSizeOfCell.call(base, $movingVisibleCell);

                var $detachedTargetOriginalCell = gridstrapData.detachCell($targetVisibleCell);
                var $detachedMovingOriginalCell = base.detachCell($movingVisibleCell);
                var wasDragging = $detachedMovingOriginalCell.hasClass(base.options.dragCellClass);
                if (wasDragging) {
                  $detachedMovingOriginalCell.removeClass(base.options.dragCellClass);
                }

                swapJQueryElements($detachedMovingOriginalCell, $detachedTargetOriginalCell);

                //re attach in opposing grids.
                var $reattachedMovingCell = gridstrapData.attachCell($detachedMovingOriginalCell);
                var $reattachedTargetCell = base.attachCell($detachedTargetOriginalCell);

                // have to remove visibleCellClass that these two would now have
                // as that should have the css transition animation in it, 
                // and we want to bypass that, set position, then apply it, set position again. 
                $reattachedMovingCell.removeClass(base.options.visibleCellClass);
                $reattachedTargetCell.removeClass(base.options.visibleCellClass);

                gridstrapData.setCellAbsolutePositionAndSize($reattachedMovingCell, preDetachPositionTarget);
                base.setCellAbsolutePositionAndSize($reattachedTargetCell, preDetachPositionMoving);

                $reattachedMovingCell.addClass(base.options.visibleCellClass);
                $reattachedTargetCell.addClass(base.options.visibleCellClass);

                if (wasDragging) {
                  $reattachedMovingCell.addClass(base.options.dragCellClass);
                }

                gridstrapData.updateVisibleCellCoordinates();
                base.updateVisibleCellCoordinates();
              } else {

                // insert mode.
                var preDetachPositionMoving = base.options.getAbsolutePositionAndSizeOfCell.call(base, $movingVisibleCell);

                var $detachedMovingOriginalCell = base.detachCell($movingVisibleCell);
                var wasDragging = $detachedMovingOriginalCell.hasClass(base.options.dragCellClass);
                if (wasDragging) {
                  $detachedMovingOriginalCell.removeClass(base.options.dragCellClass);
                }

                detachAndInsertInPlaceJQueryElement($detachedMovingOriginalCell, $hiddenTarget);

                var $reattachedMovingCell = gridstrapData.attachCell($detachedMovingOriginalCell);

                // have to remove visibleCellClass that these two would now have
                // as that should have the css transition animation in it, 
                // and we want to bypass that, set position, then apply it, set position again. 
                $reattachedMovingCell.removeClass(base.options.visibleCellClass);

                gridstrapData.setCellAbsolutePositionAndSize($reattachedMovingCell, preDetachPositionMoving);

                $reattachedMovingCell.addClass(base.options.visibleCellClass);

                if (wasDragging) {
                  $reattachedMovingCell.addClass(base.options.dragCellClass);
                }

                gridstrapData.updateVisibleCellCoordinates();
                base.updateVisibleCellCoordinates();
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
      }, //~moveCell
      resizeCell: function ($cell, width, height) {
        base.options.onResizeCell.call(base, $cell, width, height);
      },
      getHiddenCellsInElementOrder: function () {
        // Get all hidden cloned cells, then see if their linked visible cells are managed. Base their returned order off hidden cell html order. 

        // just find all children and work from there, can't rely on selcting via base.hiddenCellClass because later elements may have been added.
        var $attachedHiddenCells = $(base.$el).find('*').filter(function () {
          var $linkedVisibleCell = $(this).data(base.constants.DATA_VISIBLE_CELL);
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
      setAndGetElementRecentlyDraggedMouseOver: function (element) {
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
      },
      moveDraggedCell: function (mouseEvent, $cell) {
        // user can do something custom for dragging if they want.
        var callbackResult = base.options.mouseMoveDragCallback.call(base, $cell, mouseEvent);
        if (!callbackResult && typeof callbackResult === 'boolean') {
          return;
        }

        var originalMouseDownCellPosition = $cell.data(base.constants.DATA_MOUSEDOWN_CELL_POSITION);
        var originalMouseDownScreenPosition = $cell.data(base.constants.DATA_MOUSEDOWN_PAGE_POSITION);

        base.options.setPositionOfDraggedCell.call(base, originalMouseDownCellPosition, originalMouseDownScreenPosition, $cell, mouseEvent);

        //now remove mouse events from dragged cell, because we need to test for overlap of underneath things.
        var oldPointerEvents = $cell.css('pointer-events');
        $cell.css('pointer-events', 'none');

        var triggerMouseOverEvent = function ($element) {
          $element.trigger($.Event(base.constants.EVENT_MOUSEOVER, {
            pageX: mouseEvent.pageX,
            pageY: mouseEvent.pageY,
            target: $element[0]
          }));
        };
        var element = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);
        var cellAndIndex = _internal.getCellAndInternalIndex(element);
        if (cellAndIndex) {
          // have to create event here like this other mouse coords are missing.
          triggerMouseOverEvent(cellAndIndex.$cell);
        } else {
          // have dragged over non-managed cell.
          // might be from a linked 'additional' gridstrap.
          if (_internal.additionalGridstrapDragTargetSelector) {
            $(_internal.additionalGridstrapDragTargetSelector).each(function () {

              var additionalData = $(this).data(base.constants.DATA_GRIDSTRAP);
              if (additionalData) {
                var $additionalDataCell = additionalData.getCellOfElement(element);
                if ($additionalDataCell) {
                  // have to create event here like this other mouse coords are missing.
                  triggerMouseOverEvent($additionalDataCell);
                }
              }
            });
          }
        }

        // restore pointer-events css.
        $cell.css('pointer-events', oldPointerEvents);
      },
      $getDraggingCell: function () {
        var $draggedCell = $(_internal.dragCellSelector);
        if (!$draggedCell.length) {
          return $(); //empty set
        }
        // closest gridstrap must be this one - could be nested, we don't want to pick that up.
        var $closestGridstrap = _internal.$getClosestGridstrap($draggedCell);
        if (!$closestGridstrap.is(base.$el)) {
          return $(); //empty set
        }

        return $draggedCell;
      },
      mouseEventHandlers: new __WEBPACK_IMPORTED_MODULE_2__handlers__["a" /* Handlers */](base.setup),

      handleCellMouseEvent: function (gridstrap, eventName, onlyCallWhenTargetsCell, callback) {
        // only call event if occured on one of managed cells that has been initialised.

        var draggableSelector = gridstrap.options.gridCellSelector + ' ' + gridstrap.options.dragCellHandleSelector;
        if (gridstrap.options.dragCellHandleSelector === $.Gridstrap.defaultOptions.dragCellHandleSelector || eventName === base.constants.EVENT_MOUSEOVER) {
          // If the default settings apply for drag handle mouse events,
          // or if mouseover, then we want the event to be lenient as to what triggers it.
          // Prepend selector with grid cell itself as an OR/, selector.
          // To become the cell itself OR any dragCellHandleSelector within the cell. 
          draggableSelector = gridstrap.options.gridCellSelector + ',' + draggableSelector;
        }

        $(gridstrap.options.visibleCellContainerParentSelector).on(eventName, draggableSelector, function (mouseEvent) {
          // user clicked on perhaps child element of draggable element.
          var $managedCell = gridstrap.getCellOfElement(mouseEvent.target);

          if (onlyCallWhenTargetsCell && !$managedCell) {
            // do nothing if mouse is not interacting with a cell
            // and we're not meant to do anything unless it is.
            return;
          }
          // $managedCell may be null, callback needs to take care of that.
          callback(mouseEvent, $managedCell, gridstrap);
        });
      },
      debounce: function (callback, milliseconds, leading) {
        var timeout;
        return function () {
          var context = this;
          var args = arguments;
          var later = function () {
            timeout = null;
            if (!leading) {
              callback.apply(context, args);
            }
          };
          var callNow = leading && !milliseconds;
          clearTimeout(timeout);
          timeout = setTimeout(later, milliseconds);
          if (callNow) {
            callback.apply(context, args);
          }
        };
      },

      init: function () {
        base.options = $.extend({}, $.Gridstrap.defaultOptions, options);

        // Do nothing if it's already been done before.
        var existingInitialisation = base.$el.data(base.constants.DATA_GRIDSTRAP);
        if (existingInitialisation) {
          if (base.options.debug) {
            console.log('Gridstrap already initialised for element: ' + base.el.nodeName);
          }
          return;
        } else {
          // Add a reverse reference to the DOM object
          base.$el.data(base.constants.DATA_GRIDSTRAP, base);

          if (base.options.debug) {
            console.log('Gridstrap initialised for element: ' + base.el.nodeName);
          }
        }

        var initHiddenCopiesAndSetAbsolutePositions = function () {

          // must pick cells before potentially adding child wrapper to selection.
          var $originalCells = base.$el.find(base.options.gridCellSelector);

          _internal.idPrefix = __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].generateRandomId();
          var wrapperGeneratedId = 'gridstrap-' + _internal.idPrefix;
          _internal.visibleCellContainerSelector = '#' + wrapperGeneratedId;
          // drag selector must be within wrapper div. Turn class name/list into selector.
          _internal.dragCellSelector = _internal.visibleCellContainerSelector + ' ' + base.options.dragCellClass.replace(/(^ *| +)/g, '.') + ':first';
          _internal.resizeCellSelector = _internal.visibleCellContainerSelector + ' ' + base.options.resizeCellClass.replace(/(^ *| +)/g, '.') + ':first';
          // visibleCellContainerClassSelector just contains a .class selector, dont prfix with id. Important. Refactor this.
          _internal.visibleCellContainerClassSelector = base.options.visibleCellContainerClass.replace(/(^ *| +)/g, '.') + ':first';

          // if option not specified, use JQuery element as parent for wrapper.
          base.options.visibleCellContainerParentSelector = base.options.visibleCellContainerParentSelector || base.$el;
          $(base.options.visibleCellContainerParentSelector).append('<div id="' + wrapperGeneratedId + '" class="' + base.options.visibleCellContainerClass + '"></div>');

          $originalCells.each(function (e) {
            _internal.initCellsHiddenCopyAndSetAbsolutePosition($(this));
          });
        };

        initHiddenCopiesAndSetAbsolutePositions();

        _internal.handleCellMouseEvent(base, base.constants.EVENT_DRAGSTART + '.gridstrap', true, _internal.mouseEventHandlers.onDragstart);
        _internal.handleCellMouseEvent(base, base.constants.EVENT_MOUSEDOWN + '.gridstrap', true, _internal.mouseEventHandlers.onMousedown);
        // pass false as param because we need to do non-contiguous stuff in there.
        _internal.handleCellMouseEvent(base, base.constants.EVENT_MOUSEOVER + '.gridstrap', false, _internal.mouseEventHandlers.onMouseover);

        // it is not appropriate to confine the events to the visible cell wrapper.
        $(base.options.mouseMoveSelector).on(base.constants.EVENT_MOUSEMOVE + '.gridstrap', _internal.mouseEventHandlers.onMousemove).on(base.constants.EVENT_MOUSEUP + '.gridstrap', _internal.mouseEventHandlers.onMouseup);

        if (base.options.updateCoordinatesOnWindowResize) {
          $(window).on(base.constants.EVENT_RESIZE + '.gridstrap', _internal.debounce(base.updateVisibleCellCoordinates, base.options.mouseMoveDebounce));
        }
      } //~init()

    }; //~internal oject

    // Public methods below.
    // base.isCurrentlyDragging = function() {
    //   var override = !!base.$el.data(base.constants.DATA_DRAGGING_TARGETER);
    //   if (override){
    //     return true;
    //   }
    //   var $draggedCell = $(_internal.dragCellSelector);
    //   return $draggedCell.length > 0; // should just be one.
    // };

    base.updateVisibleCellCoordinates = function () {
      for (var i = 0; i < _internal.cellsArray.length; i++) {
        var $this = _internal.cellsArray[i];

        var $hiddenClone = $this.data(base.constants.DATA_HIDDEN_CELL);

        var positionNSizeOfHiddenClone = base.options.getAbsolutePositionAndSizeOfCell.call(base, $hiddenClone);

        base.setCellAbsolutePositionAndSize($this, positionNSizeOfHiddenClone);
      }
      // need to also update the first child gristrap - one that might exist within this one - it is then obviously recursive.
      for (var i = 0; i < _internal.cellsArray.length; i++) {
        var $nestedGridstrap = _internal.cellsArray[i].find('*').filter(function () {
          return !!$(this).data(base.constants.DATA_GRIDSTRAP);
        });

        if ($nestedGridstrap.length > 0) {
          $nestedGridstrap.first().data(base.constants.DATA_GRIDSTRAP).updateVisibleCellCoordinates();
        }
      }
    };

    // returns jquery object of new cell.
    // index is optional.
    base.insertCell = function (cellHtml, index) {
      var $existingHiddenCells = _internal.getHiddenCellsInElementOrder();
      if (typeof index === 'undefined') {
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

      var cellNIndex = _internal.getCellAndInternalIndex(selector);

      var $hiddenClone = cellNIndex.$cell.data(base.constants.DATA_HIDDEN_CELL);

      var $detachedVisibleCell = cellNIndex.$cell.detach();

      // remove 'visible' things, and put the cell back where it came from.
      $detachedVisibleCell.css('top', '');
      $detachedVisibleCell.css('left', '');
      $detachedVisibleCell.css('width', '');
      $detachedVisibleCell.css('height', '');
      $detachedVisibleCell.removeData(base.constants.DATA_HIDDEN_CELL);
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
      var cellNIndex = _internal.getCellAndInternalIndex(selector);

      var $existingVisibleCells = base.getCells();

      _internal.moveCell(cellNIndex.$cell, $existingVisibleCells.eq(toIndex));
    };

    base.moveCellToCoordinates = function (selector, x, y, targetGridstrap) {
      // TODO, use document.getlement at blah
    };

    base.getCells = function () {
      var $attachedHiddenCells = _internal.getHiddenCellsInElementOrder();

      var attachedVisibleCellElements = $attachedHiddenCells.map(function () {
        return $(this).data(base.constants.DATA_VISIBLE_CELL)[0];
      });

      return $(attachedVisibleCellElements);
    };

    base.getHiddenCells = function () {

      return _internal.getHiddenCellsInElementOrder();;
    };

    base.getCellContainer = function () {
      return $(_internal.visibleCellContainerSelector);
    };

    base.updateOptions = function (newOptions) {
      base.options = $.extend({}, base.options, newOptions);
    };

    base.getCellOfElement = function (element) {
      // could be selector
      var found = _internal.getCellAndInternalIndex(element);
      return found && found.$cell;
    };

    base.getCellIndexOfElement = function (element) {
      // could be selector
      var $cell = base.getCellOfElement(element);

      var $cells = base.getCells();

      return $cells.index($cell);
    };

    base.setCellAbsolutePositionAndSize = function ($cell, positionAndSize) {

      // relied upon when drag-stop. 
      $cell.data(base.constants.DATA_CELL_POSITION_AND_SIZE, positionAndSize);

      $cell.css('left', positionAndSize.x);
      $cell.css('top', positionAndSize.y);
      $cell.css('width', positionAndSize.w);
      $cell.css('height', positionAndSize.h);
    };

    base.setAdditionalGridstrapDragTarget = function (selector) {
      if (_internal.additionalGridstrapDragTargetSelector) {
        $(_internal.additionalGridstrapDragTargetSelector).each(function () {
          var $visibleCellContainer = $($(this).data(base.constants.DATA_GRIDSTRAP).options.visibleCellContainerParentSelector);

          // remove any old handlers.
          // have to prefix it to prevent clashes with other gridstraphs,
          $visibleCellContainer.off(base.constants.EVENT_MOUSEOVER + '.gridstrap-additional-' + _internal.idPrefix);
        });
      }

      _internal.additionalGridstrapDragTargetSelector = selector;

      // handle certain mouse event for potential other gridstraps.
      if (_internal.additionalGridstrapDragTargetSelector) {
        $(_internal.additionalGridstrapDragTargetSelector).each(function () {

          _internal.handleCellMouseEvent($(this).data(base.constants.DATA_GRIDSTRAP), base.constants.EVENT_MOUSEOVER + '.gridstrap-additional-' + _internal.idPrefix, false, _internal.mouseEventHandlers.onMouseover);
        });
      }
    };

    base.modifyCell = function (cellIndex, callback) {

      var $visibleCell = base.getCells().eq(cellIndex);
      var $hiddenCell = $visibleCell.data(base.constants.DATA_HIDDEN_CELL);

      var getVisibleCellCalled = false,
          getHiddenCellCalled = false;

      callback.call(base, function () {
        getVisibleCellCalled = true;
        return $visibleCell;
      }, function () {
        getHiddenCellCalled = true;
        return $hiddenCell;
      });

      if (getVisibleCellCalled) {
        // copy contents to hidden cell.
        $hiddenCell.html($visibleCell.html());
      }

      base.updateVisibleCellCoordinates();
    };

    // Initialiser
    _internal.init();

    //base._internal = _internal;
    // initialised :).
  };

  $.Gridstrap.defaultOptions = {
    gridCellSelector: '>*', // relative to parent element
    hiddenCellClass: 'gridstrap-cell-hidden',
    visibleCellClass: 'gridstrap-cell-visible',
    dragCellHandleSelector: '*', // relative to and including cell element.
    dragCellClass: 'gridstrap-cell-drag',
    resizeCellClass: 'gridstrap-cell-resize',
    mouseMoveSelector: 'body', // detect mousemouse and mouseup events within this element.
    visibleCellContainerParentSelector: null, // null by default, use Jquery parent element.
    visibleCellContainerClass: 'gridstrap-container',
    nonContiguousPlaceholderCellClass: 'gridstack-noncontiguous',
    getAbsolutePositionAndSizeOfCell: function ($cell) {
      if (this.options.debug && !$cell.is(':visible')) {
        console.log('Grid cell is invisible. Gridstrap should not initialise an invisible grid. (' + this.el.nodeName + ': ' + $cell[0].nodeName + ')');
      }
      var position = $cell.position();
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
    dragMouseoverThrottle: 500, //used for detecting which unique element is mouse-over.
    windowResizeDebounce: 50,
    resizeHandleSelector: null, // does not resize by default. Relative to cell. 
    resizeOnDrag: true,
    onResizeCell: function ($cell, width, height) {
      // maybe rename

      var event = $.Event(this.constants.EVENT_CELL_RESIZE, {
        width: width,
        height: height,
        target: $cell[0]
      });
      this.$el.trigger(event);

      if (event.isDefaultPrevented()) {
        return;
      }

      var $hiddenCell = $cell.data(this.constants.DATA_HIDDEN_CELL);
      $hiddenCell.css('width', width);
      $hiddenCell.css('height', height);

      this.updateVisibleCellCoordinates();
    }
  };

  $.fn.gridstrap = function (options) {
    return this.each(function () {
      new $.Gridstrap(this, options);
    });
  };
})(jQuery, window, document);

/***/ })
/******/ ])));