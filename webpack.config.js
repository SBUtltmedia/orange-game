var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
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
    loaders: [{
        test: /\.(js|jsx)?$/,
        loaders: ['react-hot', 'babel-loader?stage=0'],
        include: path.join(__dirname, 'src')
    },
    {
        test: /\.css?$/,
        loaders: ['react-hot', 'css-loader']
    },
    {
        test: /\.png?$/,
        loaders: ["url-loader?limit=10000"]
    },
    {
        test: /\.gif?$/,
        loaders: ["url-loader?mimetype=image/png"]
    },
    {
        test: /\.jpg?$/,
        loaders: ["url-loader?limit=10000"]
    },
    {
        test: /\.eot?$/,
        loaders: ["file-loader"]
    },
    {
        test: /\.woff?$/,
        loaders: ["url-loader?mimetype=application/font-woff"]
    },
    {
        test: /.(ttf|eot|svg)?$/,
        loader: "file-loader?name=[name].[ext]"
    }]
  }
};
