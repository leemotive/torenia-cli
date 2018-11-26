const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const isProductionMode = process.env.NODE_ENV === 'production';
const nameHash = isProductionMode ? '.[hash:8]' : '';

module.exports = {
  mode: isProductionMode ? 'production' : 'development',
  entry: {
    app: ['./src/index.js'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/torenia'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env'], ['@babel/preset-react']],
            plugins: [
              [
                require('babel-plugin-import'),
                {
                  libraryName: 'antd',
                  libraryDirectory: 'es',
                  style: true,
                },
                'ant',
              ],
              [
                require('babel-plugin-import'),
                {
                  libraryName: 'torenia',
                  libraryDirectory: 'es',
                  style: true,
                },
              ],
              require('babel-plugin-react-require'),
              require('@babel/plugin-proposal-export-default-from'),
              require('@babel/plugin-proposal-class-properties'),
              require('@babel/plugin-proposal-nullish-coalescing-operator'),
              require('@babel/plugin-proposal-optional-chaining'),
              [
                require('@babel/plugin-proposal-pipeline-operator'),
                { proposal: 'minimal' },
              ],
            ],
          },
        },
      },
      {
        test: /\.(le|c)ss$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          //{ loader: 'style-loader' },
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              camelCase: true,
              localIdentName: '[local]-[hash:10]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
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
                    'Safari >= 7.1',
                  ],
                }),
              ],
            },
          },
          { loader: 'less-loader', options: { javascriptEnabled: true } },
        ],
      },
      {
        test: /\.(le|c)ss$/,
        exclude: path.resolve(__dirname, 'src'),
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
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
                    'Safari >= 7.1',
                  ],
                }),
              ],
            },
          },
          { loader: 'less-loader', options: { javascriptEnabled: true } },
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|eot|svg|ttf|woff)/,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[path][name].[ext]', context: `./src` },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
      utils: path.resolve(__dirname, './src/utils'),
    },
  },
  output: {
    filename: `[name].bundle${nameHash}.js`,
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    //new ExtractTextPlugin(`[name].bundle${nameHash}.css`),
    new webpack.DllReferencePlugin({
      manifest: require('./dist/vendor-manifest.json'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name].bundle${nameHash}.css`,
      chunkFilename: `[id]${nameHash}.css`,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, 'dist/*.dll*.js'),
      publicPath: '/',
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    ...[
      process.env.ANALYZE === 1 ? new BundleAnalyzerPlugin() : undefined,
    ].filter(_ => _),
  ],
  devServer: {
    port: 9027,
    contentBase: [
      path.resolve(__dirname, 'dist'),
      path.resolve(__dirname, 'public'),
    ],
    proxy: {
      '/': {
        target: 'http://localhost:9028',
        bypass: req => {
          if (!req.url.startsWith('/api')) {
            if (/\.[a-z]+$/.test(req.url)) {
              return req.url;
            } else {
              return '/index.html';
            }
          }
        },
      },
    },
    headers: {
      'access-control-allow-origin': '*',
    },
  },
};
