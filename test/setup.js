( function( $ ) {

	"use strict";

	var cellCount = 5*12; 

	// create an element to run tests inside
	var $testGrid = $('<div id="testGrid"></div>');
	
	for (var i = 0 ; i < cellCount; i++){
		$testGrid.append('<div style="width: 27px; height: 35px;" class="cell"></div>');
	} 
	$( "body" ).prepend( $testGrid );


}( jQuery ) );
