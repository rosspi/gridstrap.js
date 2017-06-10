
import Utils from '../../src/utils';

( function( $, QUnit ) {

	"use strict";
 
	let $fixture;
	let pluginName = 'gridstrap';
	let pluginDataName = 'gridstrap';
	let pluginOptionsName = 'Gridstrap';

	QUnit.module( "jQuery Gridstrap", {
		beforeEach: function() {

			// fixture is the element where your jQuery plugin will act
			$fixture = $( "#testGrid" ); 
		},
		afterEach: function() {

			// we remove the element to reset our plugin job :)
		},
		after: function(){
			$fixture.remove();
		}
	} );

	QUnit.test( "is inside jQuery library", function( assert ) {
		assert.equal( typeof $.fn[pluginName], "function", "has function inside jquery.fn" );
		assert.equal( typeof $fixture[pluginName], "function", "another way to test it" );
	} );

	QUnit.test( "returns jQuery functions after called (chaining)", function( assert ) {
		assert.equal(
			typeof $fixture[pluginName]().on,
			"function",
			"'on' function must exist after plugin call" );
	} );

	QUnit.test( "caches plugin instance", function( assert ) {
		$fixture[pluginName]();
		
		assert.ok(
			$fixture.data( pluginDataName ),
			"has cached it into a jQuery data"
		);
	});

	QUnit.test('expected defaultOptions', function( assert ) {
		var defaultOptions = $[pluginOptionsName].defaultOptions;
		
		assert.equal(
			JSON.stringify(defaultOptions),
			'{"gridCellSelector":">*","hiddenCellClass":"gridstrap-cell-hidden","visibleCellClass":"gridstrap-cell-visible","nonContiguousPlaceholderCellClass":"gridstack-noncontiguous","dragCellClass":"gridstrap-cell-drag","resizeCellClass":"gridstrap-cell-resize","mouseMoveSelector":"body","visibleCellContainerParentSelector":null,"visibleCellContainerClass":"gridstrap-container","dragCellHandleSelector":"*","draggable":true,"rearrangeOnDrag":true,"resizeHandleSelector":null,"resizeOnDrag":true,"swapMode":false,"nonContiguousCellHtml":null,"autoPadNonContiguousCells":true,"updateCoordinatesOnWindowResize":true,"debug":false,"dragMouseoverThrottle":150,"windowResizeDebounce":50,"mousemoveDebounce":0}',
			
			"default options has changed, breaking change"
		);
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

}( jQuery, QUnit ) );
