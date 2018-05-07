import is from 'is-explicit'
import { _builtinLibs } from 'repl'
import { DefinePlugin } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

/******************************************************************************/
// Helper
/******************************************************************************/

function smartFindInput (cwd) {

  const fs = require('fs')
  const path = require('path')

  const webpackIndex = path.join(cwd, 'src/webpack/index.js')
  const plainIndex = path.join(cwd, 'src/index.js')

  if (fs.existsSync(webpackIndex))
    return webpackIndex

  if (fs.existsSync(plainIndex))
    return plainIndex

  throw new Error('config.entry was not provided, and no src entry could be found.')
}

function smartFindOutput (cwd) {

  const fs = require('fs')
  const path = require('path')

  const libPublic = path.join(cwd, 'lib/public')
  const distPublic = path.join(cwd, 'dist/public')
  const distWebpackPublic = path.join(cwd, 'dist/webpack/public')

  if (fs.existsSync(distPublic))
    return distPublic

  if (fs.existsSync(libPublic))
    return libPublic

  throw new Error('config.output was not provided, and public folder could be found.')
}

function smartFindHtml (cwd, inputFile) {

  const fs = require('fs')
  const path = require('path')

  const inputFolder = path.dirname(inputFile)
  const htmlPublic = path.join(inputFolder, 'public/index.html')
  const htmlPublicLifted = path.resolve(inputFolder, '../public/index.html')

  if (fs.existsSync(htmlPublic))
    return htmlPublic

  if (fs.existsSync(htmlPublicLifted))
    return htmlPublicLifted

  throw new Error('config.html was not provided, and an html template could be found.')
}

function validateConfig (config = { }) {

  const path = require('path')

  if (!is.plainObject(config))
    throw new Error(`if defined, config must be a plain object`)

  const cwd = config.cwd || process.cwd()
  const name = config.name || path.basename(cwd)
  const inputFile = config.entry || smartFindInput(cwd)
  const outputDir = config.output || smartFindOutput(cwd)
  const htmlTemplate = config.html || smartFindHtml(cwd, inputFile)
  const port = config.port || 5000

  const mode = config.mode || (process.env.NODE_ENV === 'production'
    ? 'production'
    : 'development')

  if (mode !== 'development' && mode !== 'production')
    throw new Error(`config.mode must either be production or development`)

  return { name, inputFile, outputDir, htmlTemplate, mode, port }
}

/******************************************************************************/
//
/******************************************************************************/

const rules = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  },
  {
    test: /\.json$/,
    exclude: /node_modules/,
    loader: 'json-loader'
  },
  {
    test: /\.css/,
    use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
  },
  {
    test: /\.(woff2?|svg)(\?.+)?$/,
    use: [ 'url-loader?limit=10000' ]
  },
  {
    test: /\.(ttf|eot|ico|png|gif|mp4|jpg|svg)(\?.+)?$/,
    loader: 'file-loader',
    options: {
      name: '[name]_[hash].[ext]'
    }
  }
]

const resolve = {
  extensions: [ '.js', '.json' ],
  modules: [
    'node_modules',

    // same as add-module-path src
    path.resolve(__dirname, '../src')
  ]
}

/******************************************************************************/
// Main
/******************************************************************************/

// This is a class specifically for use in scaffolding @benzed projects

function WebpackConfig (config) {

  if (this instanceof WebpackConfig === false)
    throw new Error('WebpackConfig cannot be invoked without \'new\'.')

  const { name, inputFile, outputDir, htmlTemplate, mode, port } = validateConfig(config)

  const entry = {
    [name]: inputFile
  }

  const output = {
    filename: `[name].js`,
    publicPath: '/',
    path: outputDir
  }

  const plugins = [
    new HtmlWebpackPlugin({
      inject: 'head',
      hash: true,
      template: htmlTemplate
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name]_[hash].css'
    })
  ]

  if (mode === 'production')
    plugins.unshift(
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    )

  const optimization = {
    splitChunks: {
      name: mode !== 'production'
    }
  }

  const node = {}
  for (const lib of _builtinLibs)
    node[lib] = 'empty'

  const webpack = {

    mode,
    entry,
    output,

    module: {
      rules
    },

    resolve,
    optimization,

    plugins,

    node

  }

  if (mode !== 'production') {

    delete webpack.node.url
    delete webpack.node.punycode

    webpack.devServer = {
      contentBase: path.dirname(htmlTemplate),
      inline: true,
      hot: false,
      port,
      host: '0.0.0.0',
      historyApiFallback: true,
      stats: {
        warnings: false
      }
    }

    webpack.devtool = 'cheap-source-map'
  }

  return webpack
}

/******************************************************************************/
// Exports
/******************************************************************************/

export default WebpackConfig
