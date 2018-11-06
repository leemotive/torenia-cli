const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src'), /node_modules\/torenia/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react'],
            ],
            plugins: [
              [require('babel-plugin-import'), {
                libraryName: 'antd', libraryDirectory: 'es', style: true
              }, 'ant'],
              [require('babel-plugin-import'), {
                libraryName: 'torenia', libraryDirectory: 'es', style: true
              }],
              require('@babel/plugin-proposal-export-default-from'),
              require('@babel/plugin-proposal-class-properties'),
              require('@babel/plugin-proposal-nullish-coalescing-operator'),
              require('@babel/plugin-proposal-optional-chaining'),
            ]
          }
        }
      },
      {
        test: /\.(le|c)ss$/,
        include: path.resolve(__dirname, 'src'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1, modules: true, minimize: process.env.NODE_ENV === 'production' } },
            {
              loader: 'postcss-loader', options: {
                plugins: (loader) => [
                  require('postcss-import')({ root: loader.resourcePath }),
                  //require('postcss-url')(),
                  require('postcss-mixins')(),
                  require('postcss-nested')(),
                  require('postcss-cssnext')({
                    browsers: [
                      'Chrome >= 35',
                      'Firefox >= 31',
                      'Explorer >= 9',
                      'Opera >= 12',
                      'Safari >= 7.1'
                    ]
                  })
                ]
              }
            },
            { loader: 'less-loader', options: { javascriptEnabled: true } }
          ]
        })
      },
      {
        test: /\.(le|c)ss$/,
        exclude: path.resolve(__dirname, 'src'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1, minimize: process.env.NODE_ENV === 'production' } },
            {
              loader: 'postcss-loader', options: {
                plugins: (loader) => [
                  require('postcss-import')({ root: loader.resourcePath }),
                  //require('postcss-url')(),
                  require('postcss-mixins')(),
                  require('postcss-nested')(),
                  require('postcss-cssnext')({
                    browsers: [
                      'Chrome >= 35',
                      'Firefox >= 31',
                      'Explorer >= 9',
                      'Opera >= 12',
                      'Safari >= 7.1'
                    ]
                  })
                ]
              }
            },
            { loader: 'less-loader', options: { javascriptEnabled: true } }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif|jpeg|eot|svg|ttf|woff)/,
        use: [
          { loader: 'file-loader', options: { name: '[path][name].[ext]', context: `./src` } }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./src/components"),
      utils: path.resolve(__dirname, "./src/utils"),
    },
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.DllReferencePlugin({
      manifest: require('./dist/vendor-manifest.json')
    }),
    new CopyWebpackPlugin([
      './src/index.html'
    ]),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port: 8090,
    contentBase: [path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'public')],
    proxy: {
      '/': {
        target: 'http://localhost:8091',
        bypass: (req) => {
          if (!req.url.startsWith('/api')) {
            if (/\.[a-z]+$/.test(req.url)) {
              return req.url;
            } else {
              return '/index.html'
            }
          }
        }
      }
    },
    headers: {
      'access-control-allow-origin': '*'
    }
  }
}
