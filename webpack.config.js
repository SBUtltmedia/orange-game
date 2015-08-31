var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.css', '.js', '.jsx']
  },
  module: {
    loaders: [
        {
            test: /\.(js|jsx)?$/,
            loaders: ['react-hot', 'babel-loader?stage=0'],
            include: path.join(__dirname, 'src')
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
