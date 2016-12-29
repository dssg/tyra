var path = require('path');

var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');

var rootAssetPath = './';

module.exports = {
    entry: './index.js',
    output: {
        path: '../webapp/static/',
        publicPath: 'http://localhost:2992/assets/',
        filename: 'output.js',
    },
    resolve: {
        root: path.resolve(__dirname, './'),
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.js$/i,
                loader: 'babel-loader',
                exclude: [/node_modules/, /\.swp$/],
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/i,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: require.resolve("react"),
                loader: 'expose?React'
            },
            {
                test: require.resolve("react-dom"),
                loader: 'expose?ReactDOM'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].[chunkhash].css'),
        new webpack.ProvidePlugin({
          $: 'jquery'
        })
    ]
}
