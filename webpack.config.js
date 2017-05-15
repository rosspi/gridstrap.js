
var webpack = require('webpack');
module.exports = {
  src: {
    entry: {
        gridstrap: "./src/gridstrap.js",
        page2: "./test/src/jquery.boilerplate.spec.js"
    },
    output: {
      path: __dirname + '/dist',
      filename: "[id]/[name].js",
      libraryTarget: 'commonjs'
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: "style!css" },
        { test: /\.js$/, loader: "babel-loader" }
      ]
    },
    plugins: /**/[
      // new webpack.optimize.UglifyJsPlugin({ 
      //   mangle: true, 
      //   sourcemap: true,
      //   minimize: true 
      // }),
    ],
  },
  test: {
    entry: "./test/src/*",
    output: {
      path: __dirname + '/spec/',
      //filename: "gridstrap.js"
    },
    module: {
      loaders: [
        //{ test: /\.css$/, loader: "style!css" },
        { test: /\.js$/, loader: "babel-loader" }
      ]
    },
    plugins: /**/[
      // new webpack.optimize.UglifyJsPlugin({ 
      //   mangle: true, 
      //   sourcemap: true,
      //   minimize: true 
      // }),
    ],
  }
}