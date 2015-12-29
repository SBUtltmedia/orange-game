var path = require('path');
var webpack = require('webpack');

module.exports = {
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', '.css', '.js', '.jsx']
  },
  module: {
    loaders: [
        {
            test: /\.(js|jsx)?$/,
            loaders: ['babel-loader?stage=0'],
            include: [path.join(__dirname, 'src'), path.join(__dirname, 'node_modules/downloadbutton')]
        },
        {
            test: /\.css?$/,
            loader: 'style-loader!css-loader'
        },
        {
            test: /\.png?$/,
            loader: "url-loader?limit=10000"
        },
        {
            test: /\.gif?$/,
            loader: "url-loader?mimetype=image/png"
        },
        {
            test: /\.jpg?$/,
            loader: "url-loader?limit=10000"
        },
        {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        },
        {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader?name=[name].[ext]"
        }
    ]
  }
};
