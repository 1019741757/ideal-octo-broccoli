var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './public/js'),
    filename: 'build.js',
    // chunkFilename: 'js/[id].[chunkhash].js',
    publicPath: '/',
  },
  externals: {
    'BMap': 'BMap'
  },
  module: {
    loaders: [{
      test: /\.less/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      }) // 单独打包出CSS，这里配置注意下
    },
    {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'env']
      }
    },
  ],
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader!less-loader?!postcss-loader'
      }, {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!less-loader?!postcss-loader' //这里用了样式分离出来的插件，如果不想分离出来，可以直接这样写 loader:'style!css!sass'
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './public/style' //路径以及命名
    })
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue': 'vue/dist/vue.js',
      // '@': resolve('src'),
      'vendor': path.resolve(__dirname, 'src/api/vendor')
    }
  },
  watch: true
}
