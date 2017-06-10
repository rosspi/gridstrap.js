/*
 *  jquery.gridstrap - v{{ include-version }}
 *  gridstrap.js
 *  Use https://www.npmjs.com/package/jquery.gridstrap for version information, semantically-released.
 *  https://rosspi.github.io/gridstrap.js/
 *
 *  Made by Ross P
 *  Under MIT License
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = {
  DATA_GRIDSTRAP: 'gridstrap',
  DATA_HIDDEN_CELL: 'gridstrap-hidden-cell',
  DATA_VISIBLE_CELL: 'gridstrap-visible-cell',
  DATA_MOUSEDOWN_POSITION_DIFF: 'gridstrap-mousedown-position-diff',
  DATA_MOUSEDOWN_SIZE: 'gridstrap-mousedown-size',
  DATA_CELL_POSITION_AND_SIZE: 'gridstrap-position-size',
  EVENT_DRAGSTART: 'dragstart',
  EVENT_MOUSEDOWN: 'mousedown',
  EVENT_MOUSEOVER: 'mouseover',
  EVENT_MOUSEMOVE: 'mousemove',
  EVENT_MOUSEUP: 'mouseup',
  EVENT_TOUCHSTART: 'touchstart',
  EVENT_TOUCHMOVE: 'touchmove',
  EVENT_TOUCHEND: 'touchend',
  EVENT_RESIZE: 'resize',
  EVENT_CELL_RESIZE: 'cellresize',
  EVENT_CELL_DRAG: 'celldrag',
  EVENT_CELL_REDRAW: 'cellredraw',
  ERROR_MISSING_JQUERY: 'Requires jQuery v3.2.1',
  ERROR_INVALID_ATTACH_ELEMENT: 'Cannot attach element that is not a child of gridstrap parent.',
  ERROR_NONCONTIGUOUS_HTML_UNDEFINED: 'nonContiguousCellHtml option cannot be null.'
};
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('./utils');

var _handlers = require('./handlers');

var _setup = require('./setup');

var _internal = require('./internal');

var _methods = require('./methods');

(function ($, window, document) {
  $.Gridstrap = function (el, options) {

    if (typeof jQuery == 'undefined' || !jQuery.Event || !jQuery.Event.prototype.hasOwnProperty('changedTouches')) {
      throw new Error(_constants2['default'].ERROR_MISSING_JQUERY);
    }

    // To avoid scope issues, use 'context' instead of 'this'
    // to reference this class from internal events and functions.
    var context = this;

    // Access to jQuery and DOM versions of element
    context.$el = $(el);
    context.el = el;
    context.constants = _constants2['default'];
    context.options = $.extend({}, $.Gridstrap.defaultOptions, options);

    // Do nothing if it's already been done before.
    var existingInitialisation = context.$el.data(_constants2['default'].DATA_GRIDSTRAP);
    if (existingInitialisation) {
      if (context.options.debug) {
        console.log('Gridstrap already initialised for element: ' + context.el.nodeName);
      }
      return;
    }

    // Add a reverse reference to the DOM object
    context.$el.data(_constants2['default'].DATA_GRIDSTRAP, context);

    var setup = new _setup.Setup($, window, document, context.$el, context);
    var internal = new _internal.Internal(setup);
    var eventHandlers = new _handlers.Handlers(setup, internal);
    var methods = new _methods.Methods(setup, internal, eventHandlers);

    // copy methods from Methods to context.
    for (var _iterator = Object.getOwnPropertyNames(Object.getPrototypeOf(methods)), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _name = _ref;

      var method = methods[_name];
      // skip constructor
      if (!(method instanceof Function) || method === _methods.Methods) continue;

      context[_name] = method.bind(methods);
    }

    internal.InitOriginalCells();
    internal.InitEventHandlers(eventHandlers);

    if (context.options.debug) {
      console.log('Gridstrap initialised for element: ' + context.el.nodeName);
    }
    // initialised :).
  };

  $.Gridstrap.defaultOptions = {
    gridCellSelector: '>*', // jQuery selector for grid's cells relative to parent element.
    hiddenCellClass: 'gridstrap-cell-hidden', // class applied to 'hidden' cells.
    visibleCellClass: 'gridstrap-cell-visible', // class applied to 'visible' cells.
    nonContiguousPlaceholderCellClass: 'gridstack-noncontiguous', // class applied to non-contiguous placeholder cells.
    dragCellClass: 'gridstrap-cell-drag', // class applied to dragging cell.
    resizeCellClass: 'gridstrap-cell-resize', // class applied to resizing cell.
    mouseMoveSelector: 'body', // jQuery selector to bind mousemouse and mouseup events.
    visibleCellContainerParentSelector: null, // jQuery selector to append 'visible' cell container to. Null will use the element the plugin is initialised on.
    visibleCellContainerClass: 'gridstrap-container', // class applied to the cell container element.
    getHtmlOfSourceCell: function getHtmlOfSourceCell($cell) {
      // function to return the html of a 'source' cell.
      return $cell[0].outerHTML;
    },
    dragCellHandleSelector: '*', // jQuery selector relative to and including cell for drag handling.
    draggable: true, // toggle mouse dragging.
    rearrangeOnDrag: true, // toggle the triggering of rearranging cells before mouseup.
    resizeHandleSelector: null, // jQuery selector relative to cell for resize handling. Null disables.
    resizeOnDrag: true, // toggle mouse resizing.	
    swapMode: false, // toggle swap or insert mode when rearranging cells.
    nonContiguousCellHtml: null, // html to use for non-contiguous placeholder cells.
    autoPadNonContiguousCells: true, // toggle adding non-contiguous cells automatically on drag or as needed.
    updateCoordinatesOnWindowResize: true, // enable window resize event handler.
    debug: false, // toggle console output.
    dragMouseoverThrottle: 150, // throttle cell mouseover events for rearranging.
    windowResizeDebounce: 50, // debounce redraw on window resize.
    mousemoveDebounce: 0 // debounce mousemove for dragging cells.
  };

  $.fn.gridstrap = function (options) {
    return this.each(function () {
      new $.Gridstrap(this, options);
    });
  };
})(jQuery, window, document);

},{"./constants":1,"./handlers":3,"./internal":4,"./methods":5,"./setup":6,"./utils":7}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('./utils');

var Handlers = (function () {
  function Handlers(setup, internal) {
    _classCallCheck(this, Handlers);

    this.setup = setup;
    this.internal = internal;
  }

  Handlers.prototype.onDragstart = function onDragstart(mouseEvent, $cell, gridstrapContext) {
    var context = this.setup.Context;

    if (gridstrapContext === context) {
      mouseEvent.preventDefault();
    }
  };

  Handlers.prototype.onTouchStart = function onTouchStart(touchEvent, $cell, gridstrapContext) {
    var $ = this.setup.jQuery;
    var options = this.setup.Options;

    touchEvent.preventDefault();

    if (touchEvent.touches.length) {
      this.onMousedown(_utils.Utils.ConvertTouchToMouseEvent(touchEvent), $cell, gridstrapContext);
    }
  };

  Handlers.prototype.onMousedown = function onMousedown(mouseEvent, $cell, gridstrapContext) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    if (gridstrapContext !== context) {
      return;
    }

    if ($cell.hasClass(options.nonContiguousPlaceholderCellClass)) {
      return;
    }

    if (options.resizeHandleSelector && $(mouseEvent.target).closest(options.resizeHandleSelector).length) {
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
  };

  Handlers.prototype.onMouseover = function onMouseover(mouseEvent, $cell, gridstrapContext) {
    var _this = this;

    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    // clear initially.
    this.internal.LastMouseOverCellTarget = null;

    if (!gridstrapContext.options.draggable) {
      return;
    }

    var $draggedCell = this.internal.$GetDraggingCell();
    if ($draggedCell.length) {
      // Is currently dragging.
      if ($cell.length && !$draggedCell.closest($cell).length) {
        // make sure you're not mouseover-ing the dragged cell itself.
        // css' 'pointer-events', 'none' should do this job, but this double checks.

        this.internal.LastMouseOverCellTarget = $cell;

        _utils.Utils.Limit(function () {
          if (gridstrapContext.options.rearrangeOnDrag) {

            _this.internal.MoveCell($draggedCell, $cell, gridstrapContext);

            // reset dragged object to mouse pos, not pos of hidden cells.
            // do not trigger overlapping now.
            _this.internal.MoveDraggedCell(mouseEvent, $draggedCell, true);
          }
        }, options.dragMouseoverThrottle);
      }
    }
  };

  Handlers.prototype.onTouchmove = function onTouchmove(touchEvent) {

    this.onMousemove(_utils.Utils.ConvertTouchToMouseEvent(touchEvent));
  };

  Handlers.prototype.onMousemove = function onMousemove(mouseEvent) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    var $resizedCell = $(this.setup.ResizeCellSelector);
    if ($resizedCell.length) {
      // is resizing

      var originalMouseDownDiff = $resizedCell.data(_constants2['default'].DATA_MOUSEDOWN_POSITION_DIFF);
      var originalMouseDownSize = $resizedCell.data(_constants2['default'].DATA_MOUSEDOWN_SIZE);

      // will change as resizing.
      var cellPositionAndSize = $resizedCell.data(_constants2['default'].DATA_CELL_POSITION_AND_SIZE);

      var absoluteOffset = _utils.Utils.GetAbsoluteOffsetForElementFromMouseEvent($resizedCell, mouseEvent, originalMouseDownDiff);

      var newW = originalMouseDownSize.width + absoluteOffset.left - cellPositionAndSize.left;
      var newH = originalMouseDownSize.height + absoluteOffset.top - cellPositionAndSize.top;

      $resizedCell.css('width', newW);
      $resizedCell.css('height', newH);

      if (options.resizeOnDrag) {
        this.internal.ResizeCell($resizedCell, newW, newH);
      }
    } else {

      var $draggedCell = this.internal.$GetDraggingCell();
      if ($draggedCell.length) {
        // should just be one.

        this.internal.MoveDraggedCell(mouseEvent, $draggedCell);

        if (options.nonContiguousCellHtml && options.rearrangeOnDrag && options.autoPadNonContiguousCells) {
          this.internal.UpdateNonContiguousCellsForDrag($draggedCell, mouseEvent);
        }
      }
    }
  };

  Handlers.prototype.onTouchend = function onTouchend(touchEvent) {
    // don't convert to mouseEVent becuase there are no touches.
    this.onMouseup(touchEvent);
  };

  Handlers.prototype.onMouseup = function onMouseup(mouseEvent) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;
    var $element = this.setup.$Element;
    var document = this.setup.Document;

    if (!options.draggable) {
      return;
    }

    var $resizedCell = $(this.setup.ResizeCellSelector);
    if (options.resizeHandleSelector && $resizedCell.length) {
      if (!options.resizeOnDrag) {
        var originalMouseDownDifference = $resizedCell.data(_constants2['default'].DATA_MOUSEDOWN_POSITION_DIFF);

        var newW = originalMouseDownCellPosition.w + mouseEvent.pageX - originalMouseDownPagePosition.x;
        var newH = originalMouseDownCellPosition.h + mouseEvent.pageY - originalMouseDownPagePosition.y;

        this.internal.ResizeCell($resizedCell, newW, newH);
      }

      $resizedCell.removeClass(options.resizeCellClass);
      _utils.Utils.ClearMouseDownData($resizedCell);

      return;
    }

    var $draggedCell = this.internal.$GetDraggingCell();
    if ($draggedCell.length > 0) {

      if (options.nonContiguousCellHtml && !options.rearrangeOnDrag && options.autoPadNonContiguousCells) {

        this.internal.UpdateNonContiguousCellsForDrag($draggedCell, mouseEvent);

        // mouse event may be over a new placeholder cell now.
        var $overlappedCell = this.internal.$GetNonDraggedCellFromPoint($draggedCell, mouseEvent);

        if ($overlappedCell.length) {
          this.internal.LastMouseOverCellTarget = $overlappedCell;
        } else {
          this.internal.LastMouseOverCellTarget = null;
        }
      }

      // no more dragging.
      $draggedCell.removeClass(options.dragCellClass);
      _utils.Utils.ClearMouseDownData($resizedCell);

      var cellOriginalPosition = $draggedCell.data(_constants2['default'].DATA_CELL_POSITION_AND_SIZE);
      context.setCellAbsolutePositionAndSize($draggedCell, cellOriginalPosition);

      if (this.internal.LastMouseOverCellTarget && !options.rearrangeOnDrag) {

        // rearrange on mouseup
        this.internal.MoveCell($draggedCell, this.internal.LastMouseOverCellTarget, context);
      }
    }
  };

  return Handlers;
})();

exports.Handlers = Handlers;

},{"./constants":1,"./utils":7}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('./utils');

var Internal = (function () {
  function Internal(setup) {
    _classCallCheck(this, Internal);

    this.setup = setup;
    this.document = document;

    this.cellsArray = [];
  }

  Internal.prototype.InitOriginalCells = function InitOriginalCells() {
    var self = this;
    var $ = self.setup.jQuery;

    self.cellsArray = [];

    self.setup.$OriginalCells.each(function (e) {
      self.InitCellsHiddenCopyAndSetAbsolutePosition($(this));
    });
  };

  Internal.prototype.InitEventHandlers = function InitEventHandlers(eventHandlers) {
    var window = this.setup.Window;
    var context = this.setup.Context;
    var options = this.setup.Options;

    var appendNamespace = function appendNamespace(eventName) {
      return eventName + '.gridstrap';
    };

    this.HandleCellMouseEvent(context, '' + appendNamespace(_constants2['default'].EVENT_DRAGSTART), true, eventHandlers.onDragstart.bind(eventHandlers));

    this.HandleCellMouseEvent(context, '' + appendNamespace(_constants2['default'].EVENT_MOUSEDOWN), true, eventHandlers.onMousedown.bind(eventHandlers));

    this.HandleCellMouseEvent(context, '' + appendNamespace(_constants2['default'].EVENT_TOUCHSTART), true, eventHandlers.onTouchStart.bind(eventHandlers));

    // pass false as param because we need to do non-contiguous stuff in there.
    this.HandleCellMouseEvent(context, '' + appendNamespace(_constants2['default'].EVENT_MOUSEOVER), false, eventHandlers.onMouseover.bind(eventHandlers));

    // it is not appropriate to confine the events to the visible cell wrapper.
    $(options.mouseMoveSelector).on('' + appendNamespace(_constants2['default'].EVENT_MOUSEMOVE), _utils.Utils.Debounce(eventHandlers.onMousemove.bind(eventHandlers), options.mousemoveDebounce)).on('' + appendNamespace(_constants2['default'].EVENT_TOUCHMOVE), _utils.Utils.Debounce(eventHandlers.onTouchmove.bind(eventHandlers), options.mousemoveDebounce)).on('' + appendNamespace(_constants2['default'].EVENT_MOUSEUP), eventHandlers.onMouseup.bind(eventHandlers)).on('' + appendNamespace(_constants2['default'].EVENT_TOUCHEND), eventHandlers.onTouchend.bind(eventHandlers));

    if (options.updateCoordinatesOnWindowResize) {
      $(window).on('' + appendNamespace(_constants2['default'].EVENT_RESIZE), _utils.Utils.Debounce(context.updateVisibleCellCoordinates, options.windowResizeDebounce));
    }
  };

  Internal.prototype.InitCellsHiddenCopyAndSetAbsolutePosition = function InitCellsHiddenCopyAndSetAbsolutePosition($cell) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    this.ModifyCellsArray(function (array) {
      return array.push($cell);
    });

    // Create html clone to take place of original $cell.
    // Treat it as the 'hidden' cell, and turn the original $cell
    // into the visible/absolute cell.

    if (options.debug && !$cell.is(':visible')) {
      console.log('Grid cell is invisible. Gridstrap should not initialise an invisible grid. (' + this.el.nodeName + '): ' + $cell[0].nodeName + ')');
    }

    var htmlOfOriginal = options.getHtmlOfSourceCell.call(context, $cell);
    var positionNSize = _utils.Utils.GetPositionAndSizeOfCell($cell);

    $cell.before(htmlOfOriginal);
    var $hiddenClone = $cell.prev();

    $hiddenClone.addClass(options.hiddenCellClass);
    $cell.addClass(options.visibleCellClass);

    // make it ref hidden cloned cell, both ways.
    $cell.data(_constants2['default'].DATA_HIDDEN_CELL, $hiddenClone);
    $hiddenClone.data(_constants2['default'].DATA_VISIBLE_CELL, $cell);

    // put absolute $cell in container.
    $(this.setup.VisibleCellContainerSelector).append($cell.detach());

    context.setCellAbsolutePositionAndSize($cell, positionNSize);
  };

  Internal.prototype.HandleCellMouseEvent = function HandleCellMouseEvent(context, eventName, onlyCallWhenTargetsCell, callback) {
    // only call event if occured on one of managed cells that has been initialised.
    var draggableSelector = context.options.gridCellSelector + ' ' + context.options.dragCellHandleSelector;
    if (context.options.dragCellHandleSelector === $.Gridstrap.defaultOptions.dragCellHandleSelector || eventName === _constants2['default'].EVENT_MOUSEOVER) {
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
  };

  Internal.prototype.SetMouseDownData = function SetMouseDownData(mouseEvent, $cell) {
    var context = this.setup.Context;
    var options = this.setup.Options;

    // compare page with element' offset.
    var cellOffset = $cell.offset();
    var w = $cell.outerWidth();
    var h = $cell.outerHeight();

    $cell.data(_constants2['default'].DATA_MOUSEDOWN_POSITION_DIFF, {
      x: mouseEvent.pageX - cellOffset.left,
      y: mouseEvent.pageY - cellOffset.top
    });
    $cell.data(_constants2['default'].DATA_MOUSEDOWN_SIZE, {
      width: w,
      height: h
    });
  };

  Internal.prototype.GetNonDraggedElementFromPoint = function GetNonDraggedElementFromPoint($draggedCell, mouseEvent) {
    var document = this.setup.Document;
    var $ = this.setup.jQuery;

    //remove mouse events from dragged cell, because we need to test for overlap of underneath things.
    var oldPointerEvents = $draggedCell.css('pointer-events');
    var oldTouchAction = $draggedCell.css('touch-action');
    $draggedCell.css('pointer-events', 'none');
    $draggedCell.css('touch-action', 'none');

    var element = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);

    // restore pointer-events css.
    $draggedCell.css('pointer-events', oldPointerEvents);
    $draggedCell.css('touch-action', oldTouchAction);

    return element;
  };

  Internal.prototype.MoveDraggedCell = function MoveDraggedCell(mouseEvent, $cell, dontLookForOverlappedCell /*optional*/) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;
    var document = this.setup.Document;
    var $element = this.setup.$Element;

    var mouseDownPositionDifference = $cell.data(_constants2['default'].DATA_MOUSEDOWN_POSITION_DIFF);

    var absoluteOffset = _utils.Utils.GetAbsoluteOffsetForElementFromMouseEvent($cell, mouseEvent, mouseDownPositionDifference);

    var event = $.Event(_constants2['default'].EVENT_CELL_DRAG, {
      left: absoluteOffset.left,
      top: absoluteOffset.top,
      target: $cell[0]
    });
    $element.trigger(event);

    if (event.isDefaultPrevented()) {
      return;
    }

    $cell.css('left', absoluteOffset.left);
    $cell.css('top', absoluteOffset.top);

    if (dontLookForOverlappedCell) {
      return;
    }

    var triggerMouseOverEvent = function triggerMouseOverEvent($element) {
      $element.trigger($.Event(_constants2['default'].EVENT_MOUSEOVER, {
        pageX: mouseEvent.pageX,
        pageY: mouseEvent.pageY,
        target: $element[0]
      }));
    };

    var overlappedElement = this.GetNonDraggedElementFromPoint($cell, mouseEvent);
    var $overlappedCell = context.$getCellOfElement(overlappedElement);

    if ($overlappedCell.length) {
      // have to create event here like this other mouse coords are missing.
      triggerMouseOverEvent($overlappedCell);
    } else {

      // have possibly dragged over non-managed cell.
      // it might be from a linked 'additional' gridstrap.
      if (this.AdditionalGridstrapDragTargetSelector) {
        $(this.AdditionalGridstrapDragTargetSelector).each(function () {

          var additionalContext = $(this).data(_constants2['default'].DATA_GRIDSTRAP);
          if (additionalContext) {
            // $getCellOfElement is a 'public' method.
            var $additionalContextCell = additionalContext.$getCellOfElement(overlappedElement);
            if ($additionalContextCell.length) {
              // have to create event here like this other mouse coords are missing.
              triggerMouseOverEvent($additionalContextCell);
            }
          }
        });
      }
    }
  };

  Internal.prototype.GetCellAndInternalIndex = function GetCellAndInternalIndex(element) {
    // element or jquery selector, child of cell or cell itself.

    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    if (!element) {
      return null;
    }

    var $visibleCellElement = $(element);

    var visibleCellAndIndex = null;
    // visibleCellAndIndex.$cell might be a child element/control perhaps of $visibleCell (found in the managed array).
    for (var i = 0; i < this.CellsArray.length && !visibleCellAndIndex; i++) {
      var $closestManagedCell = $visibleCellElement.closest(this.CellsArray[i]);
      if ($closestManagedCell.length > 0) {

        var $closestGridstrap = this.$GetClosestGridstrap($visibleCellElement);

        if ($closestGridstrap.is(context.$el)) {
          visibleCellAndIndex = {
            index: i,
            $cell: this.CellsArray[i]
          };
        }
      }
    }

    return visibleCellAndIndex;
  };

  Internal.prototype.$GetClosestGridstrap = function $GetClosestGridstrap(element) {
    // looks up the tree to find the closest instantiated gridstap instance. May not be this one in the case of nested grids.
    var $ = this.setup.jQuery;

    var dataExistsInSelector = function dataExistsInSelector(selector) {
      return $(selector).filter(function () {
        return !!$(this).data(_constants2['default'].DATA_GRIDSTRAP);
      });
    };
    // a little strange that we can;t select parents() and include element itself in the order desired, so we have to do it like this.
    var $currentElement = dataExistsInSelector(element);
    if ($currentElement.length) {
      return $currentElement.first();
    }
    return dataExistsInSelector($(element).parents()).first();
  };

  Internal.prototype.$GetDraggingCell = function $GetDraggingCell() {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    var $draggedCell = $(this.setup.DragCellSelector);
    if (!$draggedCell.length) {
      return $(); //empty set
    }
    // closest gridstrap must be this one - could be nested, we don't want to pick that up.
    var $closestGridstrap = this.$GetClosestGridstrap($draggedCell);
    if (!$closestGridstrap.is(context.$el)) {
      return $(); //empty set
    }

    return $draggedCell;
  };

  Internal.prototype.MoveCell = function MoveCell($movingVisibleCell, $targetVisibleCell, gridstrapContext) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    var $hiddenDragged = $movingVisibleCell.data(_constants2['default'].DATA_HIDDEN_CELL);
    var $hiddenTarget = $targetVisibleCell.data(_constants2['default'].DATA_HIDDEN_CELL);

    if ($hiddenDragged.is($hiddenTarget)) {
      return;
    }

    if (gridstrapContext !== context) {
      // moving between different gridstraps.
      if (this.AdditionalGridstrapDragTargetSelector) {
        // moving cells from this gridstrap to another (targetGridstrap).
        // target must be within specified options at init.
        var $targetGridstrap = $(this.AdditionalGridstrapDragTargetSelector).filter(function () {
          return $(this).data(_constants2['default'].DATA_GRIDSTRAP) === gridstrapContext;
        }).first();

        if ($targetGridstrap.length) {
          if (options.swapMode) {

            var preDetachPositionTarget = _utils.Utils.GetPositionAndSizeOfCell($targetVisibleCell);
            var preDetachPositionMoving = _utils.Utils.GetPositionAndSizeOfCell($movingVisibleCell);

            var $detachedTargetOriginalCell = gridstrapContext.detachCell($targetVisibleCell);
            var $detachedMovingOriginalCell = context.detachCell($movingVisibleCell);
            var wasDragging = $detachedMovingOriginalCell.hasClass(options.dragCellClass);
            if (wasDragging) {
              $detachedMovingOriginalCell.removeClass(options.dragCellClass);
            }

            _utils.Utils.SwapJQueryElements($detachedMovingOriginalCell, $detachedTargetOriginalCell);

            //re attach in opposing grids.
            var $reattachedMovingCell = gridstrapContext.attachCell($detachedMovingOriginalCell);
            var $reattachedTargetCell = context.attachCell($detachedTargetOriginalCell);

            // have to remove visibleCellClass that these two would now have
            // as that should have the css transition animation in it,
            // and we want to bypass that, set position, then apply it, set position again.
            _utils.Utils.ClearAbsoluteCSS($reattachedMovingCell);
            _utils.Utils.ClearAbsoluteCSS($reattachedTargetCell);

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
            var preDetachPositionMoving = _utils.Utils.GetPositionAndSizeOfCell($movingVisibleCell);

            var $detachedMovingOriginalCell = context.detachCell($movingVisibleCell);
            var wasDragging = $detachedMovingOriginalCell.hasClass(options.dragCellClass);
            if (wasDragging) {
              $detachedMovingOriginalCell.removeClass(options.dragCellClass);
            }

            _utils.Utils.DetachAndInsertInPlaceJQueryElement($detachedMovingOriginalCell, $hiddenTarget);

            var $reattachedMovingCell = gridstrapContext.attachCell($detachedMovingOriginalCell);

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
        _utils.Utils.SwapJQueryElements($hiddenDragged, $hiddenTarget);
      } else {
        _utils.Utils.DetachAndInsertInPlaceJQueryElement($hiddenDragged, $hiddenTarget);
      }

      context.updateVisibleCellCoordinates();
    }
  };

  //~moveCell

  Internal.prototype.ResizeCell = function ResizeCell($cell, width, height) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var $element = this.setup.$Element;

    var event = $.Event(_constants2['default'].EVENT_CELL_RESIZE, {
      width: width,
      height: height,
      target: $cell[0]
    });
    $element.trigger(event);

    if (event.isDefaultPrevented()) {
      return;
    }

    var $hiddenCell = $cell.data(_constants2['default'].DATA_HIDDEN_CELL);
    $hiddenCell.css('width', width);
    $hiddenCell.css('height', height);

    context.updateVisibleCellCoordinates();
  };

  Internal.prototype.$GetHiddenCellsInElementOrder = function $GetHiddenCellsInElementOrder() {
    var $ = this.setup.jQuery;
    var options = this.setup.Options;
    var $element = this.setup.$Element;
    var self = this;

    var $attachedHiddenCells = $element.find(this.setup.HiddenCellSelector).filter(function () {
      var $linkedVisibleCell = $(this).data(_constants2['default'].DATA_VISIBLE_CELL);
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
  };

  Internal.prototype.ModifyCellsArray = function ModifyCellsArray(callback) {
    callback(this.cellsArray);
  };

  Internal.prototype.UpdateNonContiguousCellsForDrag = function UpdateNonContiguousCellsForDrag($draggedCell, mouseEvent) {
    var $ = this.setup.jQuery;
    var options = this.setup.Options;

    var furthestVisibleCellPositionAndSize = _utils.Utils.GetPositionAndSizeOfCell($draggedCell);

    var compare = function compare(positionAndSize) {
      return positionAndSize.left + positionAndSize.width + (positionAndSize.top + positionAndSize.height) * 100000;
    };
    var $hiddenCells = this.$GetHiddenCellsInElementOrder();
    $hiddenCells.each(function (i, e) {
      if (!$(e).data(_constants2['default'].DATA_VISIBLE_CELL).hasClass(options.nonContiguousPlaceholderCellClass)) {
        var positionAndSize = _utils.Utils.GetPositionAndSizeOfCell($(e));

        if (compare(positionAndSize) > compare(furthestVisibleCellPositionAndSize)) {
          furthestVisibleCellPositionAndSize = positionAndSize;
        }
      }
    });

    var changed = this.AppendOrRemoveNonContiguousCellsWhile(function ($hiddenCells, appending) {
      var lastHiddenCellPositionAndSize = _utils.Utils.GetPositionAndSizeOfCell($hiddenCells.last());

      // A whole row of extra cells should exist.
      if (appending) {
        // need at least 2* cell height worht of space at bottom of grid.
        return lastHiddenCellPositionAndSize.top - furthestVisibleCellPositionAndSize.top < furthestVisibleCellPositionAndSize.height * 2;
      } else {
        return lastHiddenCellPositionAndSize.top - furthestVisibleCellPositionAndSize.top > furthestVisibleCellPositionAndSize.height * 2;
      }
    });

    if (changed) {
      this.MoveDraggedCell(mouseEvent, $draggedCell);
    }
  };

  Internal.prototype.AppendOrRemoveNonContiguousCellsWhile = function AppendOrRemoveNonContiguousCellsWhile(appendWhilePredicate) {
    var $ = this.setup.jQuery;
    var options = this.setup.Options;
    var context = this.setup.Context;

    var changed = false;

    var $hiddenCells = this.$GetHiddenCellsInElementOrder();

    while (appendWhilePredicate($hiddenCells, true)) {
      // if mouse beyond or getting near end of static hidden element, then make some placeholder ones.
      // insert dummy cells if cursor is beyond where the cells finish.
      var $insertedCell = context.insertCell(options.nonContiguousCellHtml, $hiddenCells.length);
      $insertedCell.addClass(options.nonContiguousPlaceholderCellClass);
      var $insertedHiddenCell = $insertedCell.data(_constants2['default'].DATA_HIDDEN_CELL);

      $hiddenCells = $hiddenCells.add($insertedHiddenCell);

      changed = true;
    }

    // remove cells at end when we have too much.         
    var $lastHiddenCell = $hiddenCells.last();
    var $bottomRowHiddenCells = null;
    var $getBottomRowHiddenCells = function $getBottomRowHiddenCells() {
      $bottomRowHiddenCells = $bottomRowHiddenCells || $hiddenCells.filter(function (i, e) {
        return _utils.Utils.GetPositionAndSizeOfCell($(e)).top === _utils.Utils.GetPositionAndSizeOfCell($lastHiddenCell).top;
      });
      return $bottomRowHiddenCells;
    };

    // remove all non-contiguous bottom row cells.
    while (appendWhilePredicate($hiddenCells, false) && $getBottomRowHiddenCells().filter(function (i, e) {
      return $(e).data(_constants2['default'].DATA_VISIBLE_CELL).hasClass(options.nonContiguousPlaceholderCellClass);
    }).length === $getBottomRowHiddenCells().length && $getBottomRowHiddenCells().length > 0) {
      // while all bottom row cells are placeholders.

      context.removeCell($lastHiddenCell.data(_constants2['default'].DATA_VISIBLE_CELL));
      $hiddenCells = $hiddenCells.not($lastHiddenCell);

      // update new last hidden cell.
      $lastHiddenCell = $hiddenCells.last();

      $bottomRowHiddenCells = null; // force refilter.

      changed = true;
    }

    return changed;
  };

  _createClass(Internal, [{
    key: 'AdditionalGridstrapDragTargetSelector',
    get: function get() {
      return this.additionalGridstrapDragTargetSelector;
    },
    set: function set(value) {
      this.additionalGridstrapDragTargetSelector = value;
    }
  }, {
    key: 'LastMouseOverCellTarget',
    get: function get() {
      return this.lastMouseOverCellTarget;
    },
    set: function set(value) {
      this.lastMouseOverCellTarget = value;
    }
  }, {
    key: 'CellsArray',
    get: function get() {
      return this.cellsArray;
    }
  }]);

  return Internal;
})();

exports.Internal = Internal;

},{"./constants":1,"./utils":7}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('./utils');

var Methods = (function () {
  function Methods(setup, internal, handlers) {
    _classCallCheck(this, Methods);

    this.setup = setup;
    this.internal = internal;
    this.handlers = handlers;
  }

  Methods.prototype.$getCellOfElement = function $getCellOfElement(element) {
    // could be selector
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    var found = this.internal.GetCellAndInternalIndex(element);
    if (!found) {
      return $();
    }
    return found.$cell;
  };

  Methods.prototype.setCellAbsolutePositionAndSize = function setCellAbsolutePositionAndSize($cell, positionAndSize) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;
    var $element = this.setup.$Element;

    var event = $.Event(_constants2['default'].EVENT_CELL_REDRAW, {
      left: positionAndSize.left,
      top: positionAndSize.top,
      width: positionAndSize.width,
      height: positionAndSize.height,
      target: $cell[0]
    });
    $element.trigger(event);

    if (event.isDefaultPrevented()) {
      return;
    }

    // data here is relied upon when drag-stop.
    $cell.data(_constants2['default'].DATA_CELL_POSITION_AND_SIZE, positionAndSize);

    $cell.css('left', positionAndSize.left);
    $cell.css('top', positionAndSize.top);
    $cell.css('width', positionAndSize.width);
    $cell.css('height', positionAndSize.height);
  };

  Methods.prototype.updateVisibleCellCoordinates = function updateVisibleCellCoordinates() {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    var $draggedCell = this.internal.$GetDraggingCell();

    for (var i = 0; i < this.internal.CellsArray.length; i++) {
      var $this = this.internal.CellsArray[i];

      var $hiddenClone = $this.data(_constants2['default'].DATA_HIDDEN_CELL);

      var positionNSizeOfHiddenClone = _utils.Utils.GetPositionAndSizeOfCell($hiddenClone);

      this.setCellAbsolutePositionAndSize($this, positionNSizeOfHiddenClone);
    }

    // need to also update the first child gristrap - one that might exist within this one - it is then obviously recursive.
    for (var i = 0; i < this.internal.CellsArray.length; i++) {
      var $nestedGridstrap = this.internal.CellsArray[i].find('*').filter(function () {
        return !!$(this).data(_constants2['default'].DATA_GRIDSTRAP);
      });

      $nestedGridstrap.each(function () {
        $(this).data(_constants2['default'].DATA_GRIDSTRAP).updateVisibleCellCoordinates();
      });
    }
  };

  // returns jquery object of new cell.
  // index is optional.

  Methods.prototype.insertCell = function insertCell(cellHtml, index) {
    var $ = this.setup.jQuery;
    var options = this.setup.Options;
    var $element = this.setup.$Element;

    var $existingHiddenCells = this.internal.$GetHiddenCellsInElementOrder();
    if (typeof index === 'undefined') {
      index = $existingHiddenCells.length; // insert at end.
    }

    if (index > $existingHiddenCells.length && options.nonContiguousCellHtml && options.autoPadNonContiguousCells) {

      this.internal.AppendOrRemoveNonContiguousCellsWhile(function ($hiddenCells, appending) {

        if (!appending) {
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
  };

  Methods.prototype.attachCell = function attachCell(element) {
    var $ = this.setup.jQuery;
    var options = this.setup.Options;
    var $element = this.setup.$Element;

    if (!$(element).closest($element).is($element)) {
      throw new Error(_constants2['default'].ERROR_INVALID_ATTACH_ELEMENT);
    }

    this.internal.InitCellsHiddenCopyAndSetAbsolutePosition(element);

    this.updateVisibleCellCoordinates();

    return $(element);
  };

  Methods.prototype.detachCell = function detachCell(element) {
    var options = this.setup.Options;

    var cellNIndex = this.internal.GetCellAndInternalIndex(element);

    var $hiddenClone = cellNIndex.$cell.data(_constants2['default'].DATA_HIDDEN_CELL);

    var $detachedVisibleCell = cellNIndex.$cell.detach();

    // remove 'visible' things, and put the cell back where it came from.
    _utils.Utils.ClearAbsoluteCSS($detachedVisibleCell);
    $detachedVisibleCell.removeData(_constants2['default'].DATA_HIDDEN_CELL);
    $detachedVisibleCell.removeClass(options.visibleCellClass);

    var $reattachedOriginalCell = $detachedVisibleCell.insertAfter($hiddenClone);

    // remove hidden clone.
    $hiddenClone.remove();

    // finally remove from managed array
    this.internal.ModifyCellsArray(function (array) {
      return array.splice(cellNIndex.index, 1);
    });

    this.updateVisibleCellCoordinates();

    return $reattachedOriginalCell;
  };

  Methods.prototype.removeCell = function removeCell(element) {
    var $detachedCell = this.detachCell(element);

    $detachedCell.remove();

    this.updateVisibleCellCoordinates();
  };

  Methods.prototype.moveCell = function moveCell(element, toIndex, targetGridstrap) {
    // targetGridstrap optional..
    var options = this.setup.Options;
    var context = this.setup.Context;

    var $existingVisibleCells = this.$getCells();

    if (toIndex > $existingVisibleCells.length && options.nonContiguousCellHtml && options.autoPadNonContiguousCells) {

      this.internal.AppendOrRemoveNonContiguousCellsWhile(function ($hiddenCells, appending) {

        if (!appending) {
          // do not remove when trying to remove.
          return false;
        }
        // insert placeholders until quantity of cells is index -1.
        return $hiddenCells.length <= toIndex;
      });

      // update these.
      $existingVisibleCells = this.$getCells();
    }

    var cellNIndex = this.internal.GetCellAndInternalIndex(element);

    this.internal.MoveCell(cellNIndex.$cell, $existingVisibleCells.eq(toIndex), targetGridstrap || context);
  };

  Methods.prototype.$getCellFromCoordinates = function $getCellFromCoordinates(clientX, clientY) {
    var document = this.setup.Document;
    var $ = this.setup.jQuery;

    var element = document.elementFromPoint(clientX, clientY);
    var cellAndIndex = this.internal.GetCellAndInternalIndex(element);
    if (!cellAndIndex) {
      return $();
    }
    return cellAndIndex.$cell;
  };

  Methods.prototype.getCellIndexFromCoordinates = function getCellIndexFromCoordinates(clientX, clientY) {
    var document = this.setup.Document;
    var $ = this.setup.jQuery;

    var element = document.elementFromPoint(clientX, clientY);
    var cellAndIndex = this.internal.GetCellAndInternalIndex(element);
    if (!cellAndIndex) {
      return -1;
    }
    return this.$getCells().index(cellAndIndex.$cell);
  };

  Methods.prototype.$getCells = function $getCells() {
    var $ = this.setup.jQuery;

    var $attachedHiddenCells = this.internal.$GetHiddenCellsInElementOrder();

    var attachedVisibleCellElements = $attachedHiddenCells.map(function () {
      return $(this).data(_constants2['default'].DATA_VISIBLE_CELL)[0]; // TODO is this correct [0] ?
    });

    return $(attachedVisibleCellElements);
  };

  Methods.prototype.$getHiddenCells = function $getHiddenCells() {

    return this.internal.$GetHiddenCellsInElementOrder();
  };

  Methods.prototype.$getCellContainer = function $getCellContainer() {
    var $ = this.setup.jQuery;

    return $(this.setup.VisibleCellContainerSelector);
  };

  Methods.prototype.updateOptions = function updateOptions(newOptions) {
    var $ = this.setup.jQuery;
    var options = this.setup.Options;

    this.setup.Options = $.extend({}, options, newOptions);
  };

  Methods.prototype.getCellIndexOfElement = function getCellIndexOfElement(element) {
    var $cell = this.$getCellOfElement(element);

    var $cells = this.$getCells();

    return $cells.index($cell);
  };

  Methods.prototype.setAdditionalGridstrapDragTarget = function setAdditionalGridstrapDragTarget(element) {
    var $ = this.setup.jQuery;
    var eventHandlers = this.handlers;

    var self = this;
    var mouseOverAdditionalEventName = _constants2['default'].EVENT_MOUSEOVER + '.gridstrap-additional-' + this.setup.IdPrefix;

    if (self.internal.AdditionalGridstrapDragTargetSelector) {
      $(self.internal.AdditionalGridstrapDragTargetSelector).each(function () {
        var $visibleCellContainer = $($(this).data(_constants2['default'].DATA_GRIDSTRAP).options.visibleCellContainerParentSelector);

        // remove any old handlers.
        // have to prefix it to prevent clashes with other gridstraphs,
        $visibleCellContainer.off(mouseOverAdditionalEventName);
      });
    }

    self.internal.AdditionalGridstrapDragTargetSelector = element;

    // handle certain mouse event for potential other gridstraps.
    if (self.internal.AdditionalGridstrapDragTargetSelector) {
      $(self.internal.AdditionalGridstrapDragTargetSelector).each(function () {

        self.internal.HandleCellMouseEvent($(this).data(_constants2['default'].DATA_GRIDSTRAP), mouseOverAdditionalEventName, false, eventHandlers.onMouseover.bind(eventHandlers));
      });
    }
  };

  Methods.prototype.modifyCell = function modifyCell(cellIndex, callback) {
    var context = this.setup.Context;

    var $visibleCell = this.$getCells().eq(cellIndex);
    var $hiddenCell = $visibleCell.data(_constants2['default'].DATA_HIDDEN_CELL);

    var getVisibleCellCalled = false,
        getHiddenCellCalled = false;

    callback.call(context, function () {
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

    this.updateVisibleCellCoordinates();
  };

  Methods.prototype.padWithNonContiguousCells = function padWithNonContiguousCells(callback) {
    var $ = this.setup.jQuery;
    var options = this.setup.Options;

    if (!options.nonContiguousCellHtml) {
      throw new Error(_constants2['default'].ERROR_NONCONTIGUOUS_HTML_UNDEFINED);
    }

    var $attachedHiddenCells = this.internal.$GetHiddenCellsInElementOrder();

    this.internal.AppendOrRemoveNonContiguousCellsWhile(function ($hiddenCells, appending) {

      if (!appending) {
        // do not remove, when trying to remove.
        // only append/pad.
        return false;
      }
      var cellCount = $hiddenCells.length;
      var placeHolderCount = $hiddenCells.filter(function (i, e) {
        return $(e).data(_constants2['default'].DATA_VISIBLE_CELL).hasClass(options.nonContiguousPlaceholderCellClass);
      }).length;

      return callback(cellCount, placeHolderCount);
    });
  };

  return Methods;
})();

exports.Methods = Methods;

},{"./constants":1,"./utils":7}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

var Setup = (function () {
  function Setup($, window, document, $el, context) {
    _classCallCheck(this, Setup);

    var options = context.options;

    // must pick cells before potentially adding child wrapper to selection.
    this.$originalCells = $el.find(options.gridCellSelector);

    this.idPrefix = _utils.Utils.GenerateRandomId();

    var wrapperGeneratedId = 'gridstrap-' + this.idPrefix;
    this.visibleCellContainerSelector = '#' + wrapperGeneratedId;

    // drag selector must be within wrapper div. Turn class name/list into selector.
    this.dragCellSelector = this.visibleCellContainerSelector + ' ' + _utils.Utils.ConvertCssClassToJQuerySelector(options.dragCellClass) + ':first';
    this.resizeCellSelector = this.visibleCellContainerSelector + ' ' + _utils.Utils.ConvertCssClassToJQuerySelector(options.resizeCellClass) + ':first';
    // visibleCellContainerClassSelector just contains a .class selector, dont prfix with id. Important. Refactor this.
    this.visibleCellContainerClassSelector = _utils.Utils.ConvertCssClassToJQuerySelector(options.visibleCellContainerClass) + ':first';
    this.hiddenCellSelector = _utils.Utils.ConvertCssClassToJQuerySelector(options.hiddenCellClass);

    // if option not specified, use JQuery element as parent for wrapper.
    options.visibleCellContainerParentSelector = options.visibleCellContainerParentSelector || $el;
    $(options.visibleCellContainerParentSelector).append('<div id="' + wrapperGeneratedId + '" class="' + options.visibleCellContainerClass + '"></div>');

    this.window = window;
    this.document = document;
    this.$ = $;
    this.$el = $el;
    this.context = context;
  }

  _createClass(Setup, [{
    key: 'Window',
    get: function get() {
      return this.window;
    }
  }, {
    key: 'Document',
    get: function get() {
      return this.document;
    }
  }, {
    key: 'jQuery',
    get: function get() {
      return this.$;
    }
  }, {
    key: 'Options',
    get: function get() {
      return this.context.options;
    },
    set: function set(value) {
      this.context.options = value;
    }
  }, {
    key: '$Element',
    get: function get() {
      return this.$el;
    }

    // Only used for assigning context when calling options' methods.
  }, {
    key: 'Context',
    get: function get() {
      return this.context;
    }
  }, {
    key: '$OriginalCells',
    get: function get() {
      return this.$originalCells;
    }
  }, {
    key: 'IdPrefix',
    get: function get() {
      return this.idPrefix;
    }
  }, {
    key: 'VisibleCellContainerSelector',
    get: function get() {
      return this.visibleCellContainerSelector;
    }
  }, {
    key: 'DragCellSelector',
    get: function get() {
      return this.dragCellSelector;
    }
  }, {
    key: 'ResizeCellSelector',
    get: function get() {
      return this.resizeCellSelector;
    }
  }, {
    key: 'VisibleCellContainerClassSelector',
    get: function get() {
      return this.visibleCellContainerClassSelector;
    }
  }, {
    key: 'HiddenCellSelector',
    get: function get() {
      return this.hiddenCellSelector;
    }
  }]);

  return Setup;
})();

exports.Setup = Setup;

},{"./utils":7}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var Utils = (function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  Utils.GenerateRandomId = function GenerateRandomId() {
    return Math.random().toString(36).substr(2, 5) + Math.round(Math.random() * 1000).toString();
  };

  Utils.ConvertCssClassToJQuerySelector = function ConvertCssClassToJQuerySelector(cssClass) {
    return cssClass.replace(/(^ *| +)/g, '.');
  };

  Utils.Debounce = function Debounce(callback, milliseconds, leading, timeout) {
    if (typeof timeout === 'undefined') {
      timeout = null;
    }
    return function () {
      var context = this;
      var args = arguments;
      var later = function later() {
        timeout = null;
        if (!leading) {
          callback.apply(context, args);
        }
      };
      var callNow = leading && !timeout;

      if (milliseconds == 500) console.log('callNow: ' + callNow);

      clearTimeout(timeout);
      timeout = setTimeout(later, milliseconds);
      if (callNow) {
        callback.apply(context, args);
      }

      return timeout;
    };
  };

  Utils.Limit = function Limit(callback, milliseconds) {
    var d = new Date();
    var n = d.getTime();
    if (n - (Utils.limit || 0) > milliseconds) {

      callback();

      Utils.limit = n;
    }
  };

  Utils.SwapJQueryElements = function SwapJQueryElements($a, $b) {
    var getInPlaceFunction = function getInPlaceFunction($element) {
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
      }
      // if neither $next nor $prev is appropriate,
      // and $next is $other, then can make assumption
      // that we're moving $a to $b and $a is first element.
      else if ($next.length > 0 && $next.is($other)) {
          return function ($newElement) {
            $parent.prepend($newElement);
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

  Utils.DetachAndInsertInPlaceJQueryElement = function DetachAndInsertInPlaceJQueryElement($detachElement, $inPlaceElement) {
    var inPlaceElementIndex = $inPlaceElement.index();
    var detachElementIndex = $detachElement.index();

    var $detachedElement = $detachElement.detach();

    if (inPlaceElementIndex < detachElementIndex) {
      $inPlaceElement.before($detachedElement);
    } else {
      $inPlaceElement.after($detachedElement);
    }
  };

  Utils.ClearAbsoluteCSS = function ClearAbsoluteCSS($element) {
    $element.css('top', '');
    $element.css('left', '');
    $element.css('width', '');
    $element.css('height', '');
  };

  Utils.ClearMouseDownData = function ClearMouseDownData($cell) {
    $cell.removeData(_constants2['default'].DATA_MOUSEDOWN_POSITION_DIFF);
    $cell.removeData(_constants2['default'].DATA_MOUSEDOWN_SIZE);
  };

  Utils.GetAbsoluteOffsetForElementFromMouseEvent = function GetAbsoluteOffsetForElementFromMouseEvent($element, mouseEvent, adjustment) {
    var $parent = $element.parent();
    var parentOffset = $parent.offset();
    var parentPosition = $parent.position();

    var absoluteX = parentOffset.left - parentPosition.left;
    var absoluteY = parentOffset.top - parentPosition.top;

    var left = mouseEvent.pageX - absoluteX - adjustment.x;
    var top = mouseEvent.pageY - absoluteY - adjustment.y;

    return {
      left: left,
      top: top
    };
  };

  Utils.GetPositionAndSizeOfCell = function GetPositionAndSizeOfCell($cell) {

    var position = $cell.position();
    var w = $cell.outerWidth();
    var h = $cell.outerHeight();

    return {
      left: position.left,
      top: position.top,
      width: w,
      height: h
    };
  };

  Utils.ConvertTouchToMouseEvent = function ConvertTouchToMouseEvent(touchEvent) {
    var touch = null;
    for (var i = 0; !touch && i < touchEvent.changedTouches.length; i++) {
      if (touchEvent.changedTouches[i].identifier === 0) {
        touch = touchEvent.changedTouches[i];
      }
    }

    touchEvent.pageX = touch.pageX;
    touchEvent.pageY = touch.pageY;
    touchEvent.clientX = touch.clientX;
    touchEvent.clientY = touch.clientY;

    return touchEvent;
  };

  return Utils;
})();

exports.Utils = Utils;

},{"./constants":1}]},{},[2]);
