 module.exports = function( grunt ) {

	grunt.initConfig( {

		// Import package manifest
		pkg: grunt.file.readJSON( "package.json" ),

		// Banner definitions
		// https://www.npmjs.com/package/jquery.gridstrap contains the version numbers built in only due it this being semantically-released.
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v{{ include-version }}\n" + 
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: { // just concat banner onto some. Uglify handles minified js.
			options: {
				banner: "<%= meta.banner %>"
			},
			dist: {
				files: {
					"dist/jquery.gridstrap.js": ["dist/jquery.gridstrap.js"],
					"docs/jquery.gridstrap.js": ["dist/jquery.gridstrap.js"],
					"dist/jquery.gridstrap.css": ["src/style.css"],
					"docs/jquery.gridstrap.css": ["src/style.css"],
					"dist/jquery.gridstrap.min.css": ["dist/jquery.gridstrap.min.css"],
				} 
			}
		}, 

		// Minify definitions
		uglify: {
			dist: {
				files:{
					"dist/jquery.gridstrap.min.js": [ "dist/jquery.gridstrap.js" ]
				} 
			},
			options: {
				banner: "<%= meta.banner %>",
				sourceMap: true
			}
		}, 

		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					"dist/jquery.gridstrap.min.css" : ["dist/jquery.gridstrap.css"]
				}
			}
		},

		// karma test runner
		karma: {
			unit: {
				configFile: "karma.conf.js",
				background: true,
				singleRun: false,
				browsers: [ "PhantomJS", "Firefox" ]
			},

			//continuous integration mode: run tests once in PhantomJS browser.
			travis: {
				configFile: "karma.conf.js",
				singleRun: true,
				browsers: [ "PhantomJS" ]
			}
		},

    browserify: {
      dist: {
        options: {
            transform: [
              ["babelify", {
                  loose: "all"
              }]
            ]
        },
        files: { 
            "./dist/jquery.gridstrap.js": ["./src/gridstrap.js"],
            "./test/compiled/jquery.gridstrap.spec.js": ["./test/spec/*.js"]
        }
      }
    },
  
		watch: {
			files: [ "src/*", "test/spec/*" ],
			tasks: [ "default" ]
		}

	} );

	grunt.loadNpmTasks( "grunt-contrib-concat" );
	grunt.loadNpmTasks( "grunt-contrib-uglify" ); 
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	grunt.loadNpmTasks( "grunt-karma" );
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask( "build", [ "browserify", "uglify", "cssmin", "concat" ] );
	grunt.registerTask( "travis", [ "build", "karma:travis" ] ); 
	grunt.registerTask( "default", [ "build", "karma:unit" ] );
};
