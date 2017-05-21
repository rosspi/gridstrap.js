module.exports = function( config ) {

	config.set( {
		files: [
			"node_modules/jquery/dist/jquery.js",
			"dist/jquery.gridstrap.min.js",
			"test/setup.js",
			"test/compiled/*"
		],
		frameworks: [ "qunit" ],
		autoWatch: true
	} );
};
