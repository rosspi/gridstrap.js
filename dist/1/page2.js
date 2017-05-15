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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  generateRandomId: function () {
    return Math.random().toString(36).substr(2, 5) + Math.round(Math.random() * 1000).toString();
  }
});

/***/ }),

/***/ 5:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_utils__ = __webpack_require__(0);



(function ($, QUnit) {

	"use strict";

	var $testCanvas = $("#testCanvas");
	var $fixture = null;

	QUnit.module("jQuery Boilerplate", {
		beforeEach: function () {

			// fixture is the element where your jQuery plugin will act
			$fixture = $("<div/>");

			$testCanvas.append($fixture);
		},
		afterEach: function () {

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

/***/ })

/******/ })));