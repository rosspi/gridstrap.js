
var webpack = require('webpack');
module.exports = {
    entry: "./js.js",
    output: {
        path: __dirname + '/dist/',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: /**/ [  
        new webpack.optimize.UglifyJsPlugin({ mangle: true, sourcemap: true, minimize: true }),
    ],
};