var path = require('path');
var webpack = require('webpack');

module.exports = {

  // devtool: 'eval-source-map',
  devtool: '#cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './react/index'
  ],
  output: {


    /*development environment*/
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist'


    /*product environment*/
    //path:"./dist",
    //filename: "bundle.min.js"


  },
  plugins: [
    //new webpack.optimize.UglifyJsPlugin({minimize: true}),
    //new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.less?$/,
        loaders : [
          'style-loader',
          'css-loader',
          'less-loader?{"sourceMap":true}'
        ],
        include: __dirname
      },
      { test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url',
        query: {limit: 10240} // 内联小于10k的base64图片，其他的直接使用URL
      }
    ]
  }
};
