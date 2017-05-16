(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

  Utils.Debounce = function Debounce(callback, milliseconds, leading) {
    var timeout = undefined;
    return function () {
      var context = this;
      var args = arguments;
      var later = function later() {
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
  };

  Utils.IsElementThrottled = function IsElementThrottled($, element, milliseconds) {

    Utils.recentDragMouseOvers = Utils.recentDragMouseOvers || [];

    var d = new Date();
    var n = d.getTime();
    for (var i = 0; i < Utils.recentDragMouseOvers.length; i++) {
      if (Utils.recentDragMouseOvers[i].n + milliseconds < n) {
        // expired.
        Utils.recentDragMouseOvers.splice(i, 1);
      }
      if (i < Utils.recentDragMouseOvers.length && $(Utils.recentDragMouseOvers[i].e).is(element)) {
        return true;
      }
    }
    Utils.recentDragMouseOvers.push({
      n: n,
      e: element
    });
    return false;
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

  return Utils;
})();

exports.Utils = Utils;

},{}],2:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _srcUtils = require('../../src/utils');

var _srcUtils2 = _interopRequireDefault(_srcUtils);

(function ($, QUnit) {

	"use strict";

	var $testCanvas = $("#testCanvas");
	var $fixture = null;

	QUnit.module("jQuery Boilerplate", {
		beforeEach: function beforeEach() {

			// fixture is the element where your jQuery plugin will act
			$fixture = $("<div/>");

			$testCanvas.append($fixture);
		},
		afterEach: function afterEach() {

			// we remove the element to reset our plugin job :)
			$fixture.remove();
		}
	});

	QUnit.test("is inside jQuery library", function (assert) {
		assert.equal(typeof $.fn.defaultPluginName, "function", "has function inside jquery.fn");
		assert.equal(typeof $fixture.defaultPluginName, "function", "another way to test it");
	});

	QUnit.test("returns jQuery functions after called (chaining)", function (assert) {
		assert.equal(typeof $fixture.defaultPluginName().on, "function", "'on' function must exist after plugin call");
	});

	QUnit.test("caches plugin instance", function (assert) {
		$fixture.defaultPluginName();
		assert.ok($fixture.data("plugin_defaultPluginName"), "has cached it into a jQuery data");
	});

	QUnit.test("enable custom config", function (assert) {
		$fixture.defaultPluginName({
			foo: "bar"
		});

		var pluginData = $fixture.data("plugin_defaultPluginName");

		assert.deepEqual(pluginData.settings, {
			propertyName: "value",
			foo: "bar"
		}, "extend plugin settings");
	});

	QUnit.test("changes the element text", function (assert) {
		$fixture.defaultPluginName();

		assert.equal($fixture.text(), "jQuery Boilerplate");
	});

	QUnit.test("has #yourOtherFunction working as expected", function (assert) {
		$fixture.defaultPluginName();

		var instance = $fixture.data("plugin_defaultPluginName"),
		    expectedText = "foobar";

		instance.yourOtherFunction(expectedText);
		assert.equal($fixture.text(), expectedText);
	});
})(jQuery, QUnit);

},{"../../src/utils":1}]},{},[2]);
