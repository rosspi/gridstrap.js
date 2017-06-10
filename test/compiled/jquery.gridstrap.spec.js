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

},{"./constants":1}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcUtils = require('../../src/utils');

var _srcUtils2 = _interopRequireDefault(_srcUtils);

(function ($, QUnit) {

	"use strict";

	var $fixture = undefined;
	var pluginName = 'gridstrap';
	var pluginDataName = 'gridstrap';
	var pluginOptionsName = 'Gridstrap';

	QUnit.module("jQuery Gridstrap", {
		beforeEach: function beforeEach() {

			// fixture is the element where your jQuery plugin will act
			$fixture = $("#testGrid");
		},
		afterEach: function afterEach() {

			// we remove the element to reset our plugin job :)
		},
		after: function after() {
			$fixture.remove();
		}
	});

	QUnit.test("is inside jQuery library", function (assert) {
		assert.equal(typeof $.fn[pluginName], "function", "has function inside jquery.fn");
		assert.equal(typeof $fixture[pluginName], "function", "another way to test it");
	});

	QUnit.test("returns jQuery functions after called (chaining)", function (assert) {
		assert.equal(typeof $fixture[pluginName]().on, "function", "'on' function must exist after plugin call");
	});

	QUnit.test("caches plugin instance", function (assert) {
		$fixture[pluginName]();

		assert.ok($fixture.data(pluginDataName), "has cached it into a jQuery data");
	});

	QUnit.test('expected defaultOptions', function (assert) {
		var defaultOptions = $[pluginOptionsName].defaultOptions;

		assert.equal(JSON.stringify(defaultOptions), '{"gridCellSelector":">*","hiddenCellClass":"gridstrap-cell-hidden","visibleCellClass":"gridstrap-cell-visible","nonContiguousPlaceholderCellClass":"gridstack-noncontiguous","dragCellClass":"gridstrap-cell-drag","resizeCellClass":"gridstrap-cell-resize","mouseMoveSelector":"body","visibleCellContainerParentSelector":null,"visibleCellContainerClass":"gridstrap-container","dragCellHandleSelector":"*","draggable":true,"rearrangeOnDrag":true,"resizeHandleSelector":null,"resizeOnDrag":true,"swapMode":false,"nonContiguousCellHtml":null,"autoPadNonContiguousCells":true,"updateCoordinatesOnWindowResize":true,"debug":false,"dragMouseoverThrottle":150,"windowResizeDebounce":50,"mousemoveDebounce":0}', "default options has changed, breaking change");
	});

	// QUnit.test( "enable custom config", function( assert ) {
	// 	$fixture[pluginName]( {
	// 		foo: "bar"
	// 	} );

	// 	var pluginData = $fixture.data( pluginDataName );

	// 	assert.deepEqual(
	// 		pluginData.settings,
	// 		{
	// 			propertyName: "value",
	// 			foo: "bar"
	// 		},
	// 		"extend plugin settings"
	// 	);

	// } );

	// QUnit.test( "changes the element text", function( assert ) {
	// 	$fixture[pluginName]();

	// 	assert.equal( $fixture.text(), "jQuery Boilerplate" );
	// } );

	// QUnit.test(
	// 	"has #yourOtherFunction working as expected",
	// 	function( assert ) {
	// 		$fixture[pluginName]();

	// 		var instance = $fixture.data( pluginDataName ),
	// 			expectedText = "foobar";

	// 		instance.yourOtherFunction( expectedText );
	// 		assert.equal( $fixture.text(), expectedText );
	// 	}
	// );
})(jQuery, QUnit);

},{"../../src/utils":2}]},{},[3]);
