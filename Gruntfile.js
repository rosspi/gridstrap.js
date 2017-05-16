//const webpackConfig = require('./webpack.config.js');
 
module.exports = function( grunt ) {

	grunt.initConfig( {

		// Import package manifest
		pkg: grunt.file.readJSON( "package.json" ),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			dist: {
				src: [ "src/jquery.boilerplate.js" ],
				dest: "dist/jquery.boilerplate.js"
			}
		},

		// Lint definitions
		jshint: {
			files: [ "src/jquery.boilerplate.js", "test/**/*" ],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		jscs: {
			src: "src/**/*.js",
			options: {
				config: ".jscsrc"
			}
		},

		// Minify definitions
		uglify: {
			dist: {
				src: [ "dist/gridstrap.js" ],
				dest: "dist/gridstrap.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
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
            "./dist/gridstrap.js": ["./src/gridstrap.js"],
            "./test/compiled/gridstrap.spec.js": ["./test/spec/*.js"]
        }
      }
    },
    // webpacktest: {
    //   options: {
    //     stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    //   },
    //   prod: webpackConfig.test,
    //   dev: webpackConfig.test, //Object.assign({ watch: true }, webpackConfig)
    // },

		// watch for changes to source
		// Better than calling grunt a million times
		// (call 'grunt watch')
		watch: {
			files: [ "src/*", "test/spec/*" ],
			tasks: [ "default" ]
		}

	} );

	grunt.loadNpmTasks( "grunt-contrib-concat" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-jscs" );
	grunt.loadNpmTasks( "grunt-contrib-uglify" ); 
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	grunt.loadNpmTasks( "grunt-karma" );
   grunt.loadNpmTasks("grunt-browserify");

	grunt.registerTask( "travis", [ "jshint", "karma:travis" ] );
	grunt.registerTask( "lint", [ "jshint", "jscs" ] );
	grunt.registerTask( "build", [ "concat", "browserify", "uglify" ] );
	grunt.registerTask( "default", [ "jshint",  "build", "karma:unit" ] );
};
