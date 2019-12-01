(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
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
  ERROR_MISSING_JQUERY: 'Requires jQuery v3.4.1',
  ERROR_INVALID_ATTACH_ELEMENT: 'Cannot attach element that is not a child of gridstrap parent.',
  ERROR_NONCONTIGUOUS_HTML_UNDEFINED: 'nonContiguousCellHtml option cannot be null.'
};
exports["default"] = _default;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Utils = void 0;

var _constants = _interopRequireDefault(require("./constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Utils =
/*#__PURE__*/
function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: "GenerateRandomId",
    value: function GenerateRandomId() {
      return Math.random().toString(36).substr(2, 5) + Math.round(Math.random() * 1000).toString();
    }
  }, {
    key: "ConvertCssClassToJQuerySelector",
    value: function ConvertCssClassToJQuerySelector(cssClass) {
      return cssClass.replace(/(^ *| +)/g, '.');
    }
  }, {
    key: "Debounce",
    value: function Debounce(callback, milliseconds, leading, timeout) {
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

        var callNow = !milliseconds || leading && !timeout;
        clearTimeout(timeout);

        if (callNow) {
          callback.apply(context, args);
        } else {
          timeout = setTimeout(later, milliseconds);
        }

        return timeout;
      };
    }
  }, {
    key: "Limit",
    value: function Limit(callback, milliseconds) {
      var d = new Date();
      var n = d.getTime();

      if (n - (Utils.limit || 0) > milliseconds) {
        callback();
        Utils.limit = n;
      }
    }
  }, {
    key: "SwapJQueryElements",
    value: function SwapJQueryElements($a, $b) {
      var getInPlaceFunction = function getInPlaceFunction($element) {
        var $other = $a.is($element) ? $b : $a;
        var $next = $element.next();
        var $prev = $element.prev();
        var $parent = $element.parent(); // cannot swap a with b exactly if there are no other siblings.

        if ($next.length > 0 && !$next.is($other)) {
          return function ($newElement) {
            $next.before($newElement);
          };
        } else if ($prev.length > 0 && !$prev.is($other)) {
          return function ($newElement) {
            $prev.after($newElement);
          };
        } // if neither $next nor $prev is appropriate, 
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
      var $bDetached = $b.detach(); // swap finally.

      bInPlaceFunc($aDetached);
      aInPlaceFunc($bDetached);
    }
  }, {
    key: "DetachAndInsertInPlaceJQueryElement",
    value: function DetachAndInsertInPlaceJQueryElement($detachElement, $inPlaceElement) {
      var inPlaceElementIndex = $inPlaceElement.index();
      var detachElementIndex = $detachElement.index();
      var $detachedElement = $detachElement.detach();

      if (inPlaceElementIndex < detachElementIndex) {
        $inPlaceElement.before($detachedElement);
      } else {
        $inPlaceElement.after($detachedElement);
      }
    }
  }, {
    key: "ClearAbsoluteCSS",
    value: function ClearAbsoluteCSS($element) {
      $element.css('top', '');
      $element.css('left', '');
      $element.css('width', '');
      $element.css('height', '');
    }
  }, {
    key: "ClearMouseDownData",
    value: function ClearMouseDownData($cell) {
      $cell.removeData(_constants["default"].DATA_MOUSEDOWN_POSITION_DIFF);
      $cell.removeData(_constants["default"].DATA_MOUSEDOWN_SIZE);
    }
  }, {
    key: "GetAbsoluteOffsetForElementFromMouseEvent",
    value: function GetAbsoluteOffsetForElementFromMouseEvent($element, mouseEvent, adjustment) {
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
    }
  }, {
    key: "GetPositionAndSizeOfCell",
    value: function GetPositionAndSizeOfCell($cell) {
      var position = $cell.position();
      var w = $cell.outerWidth();
      var h = $cell.outerHeight();
      return {
        left: position.left,
        top: position.top,
        width: w,
        height: h
      };
    }
  }, {
    key: "ConvertTouchToMouseEvent",
    value: function ConvertTouchToMouseEvent(touchEvent) {
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
    }
  }]);

  return Utils;
}();

exports.Utils = Utils;

},{"./constants":1}],3:[function(require,module,exports){
"use strict";

var _utils = _interopRequireDefault(require("../../src/utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function ($, QUnit) {
  "use strict";

  var $fixture;
  var pluginName = 'gridstrap';
  var pluginDataName = 'gridstrap';
  var pluginOptionsName = 'Gridstrap';
  QUnit.module("jQuery Gridstrap", {
    beforeEach: function beforeEach() {
      // fixture is the element where your jQuery plugin will act
      $fixture = $("#testGrid");
    },
    afterEach: function afterEach() {// we remove the element to reset our plugin job :)
    },
    after: function after() {
      $fixture.remove();
    }
  });
  QUnit.test("is inside jQuery library", function (assert) {
    assert.equal(_typeof($.fn[pluginName]), "function", "has function inside jquery.fn");
    assert.equal(_typeof($fixture[pluginName]), "function", "another way to test it");
  });
  QUnit.test("returns jQuery functions after called (chaining)", function (assert) {
    assert.equal(_typeof($fixture[pluginName]().on), "function", "'on' function must exist after plugin call");
  });
  QUnit.test("caches plugin instance", function (assert) {
    $fixture[pluginName]();
    assert.ok($fixture.data(pluginDataName), "has cached it into a jQuery data");
  });
  QUnit.test('expected defaultOptions', function (assert) {
    var defaultOptions = $[pluginOptionsName].defaultOptions;
    throw new Error('what');
    assert.equal(JSON.stringify(defaultOptions), '{"gridCellSelector":">*","hiddenCellClass":"gridstrap-cell-hidden","visibleCellClass":"gridstrap-cell-visible","nonContiguousPlaceholderCellClass":"gridstack-noncontiguous","dragCellClass":"gridstrap-cell-drag","resizeCellClass":"gridstrap-cell-resize","mouseMoveSelector":"body","visibleCellContainerParentSelector":null,"visibleCellContainerClass":"gridstrap-container","dragCellHandleSelector":"*","draggable":true,"rearrangeOnDrag":true,"resizeHandleSelector":null,"resizeOnDrag":true,"swapMode":false,"nonContiguousCellHtml":null,"autoPadNonContiguousCells":true,"updateCoordinatesOnWindowResize":true,"debug":false,"dragMouseoverThrottle":150,"windowResizeDebounce":50,"mousemoveDebounce":0}', "default options has changed, breaking change");
  }); // QUnit.test( "enable custom config", function( assert ) {
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
