const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const cesiumBuild = './node_modules/cesium/Build/Cesium'
const testWorker = /\.worker\.js$/
module.exports = {
  publicPath: './',
  devServer: {
    port: 8090,
    open: true
  },
  lintOnSave: false,
  productionSourceMap: false,
  chainWebpack: config => {
    config.performance.set('hints', false);
    config.module.rule('js').exclude.add(testWorker)
    config.module
      .rule('worker')
      .test(testWorker)
      .use('worker-loader')
      .loader('worker-loader')
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([{ from: path.join(__dirname, cesiumBuild), to: 'Cesium' }]),
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'tslint-loader'
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.json', '.css'],
      alias: {
        '@': path.resolve('src'),
        cesium: path.resolve(__dirname, cesiumBuild)
      }
    },
  },
}
