module.exports = function( config ) {

	config.set( {
		files: [
			{ 
				pattern: "node_modules/jquery/dist/jquery.js",
				served: true, 
				included: true, 
				watched: true 
			},
			{ 
				pattern: "dist/jquery.gridstrap.min.js",
				served: true, 
				included: true, 
				watched: true 
			},
			{ 
				pattern: "test/setup.js",
				served: true, 
				included: true, 
				watched: true 
			},
			{ 
				pattern: "test/compiled/*",
				served: true, 
				included: true, 
				watched: true 
			},
			{ 
				pattern: "src/*.js",
				served: false, 
				included: false, 
				watched: true 
			},
			{ 
				pattern: "test/spec/*",
				served: false, 
				included: false, 
				watched: true 
			}
		],
		frameworks: [ "qunit" ],
		autoWatch: true
	} );
};
