var webpack = require('webpack');
var baseConfig = require('./webpack.base.config');
var config = Object.create(baseConfig);

config.devtool = 'cheap-module-source-map';

config.entry = [
    './src/index'
];

config.plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compressor: {
            screw_ie8: true,
            warnings: false
        }
    }),
    new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
    })
];

module.exports = config;
