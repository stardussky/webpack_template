const Webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const transpileDependencies = []

module.exports = {
    entry: {
        app: './src/index.js',
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        pathinfo: false,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new Webpack.ProvidePlugin({}),
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new CopyPlugin({
            patterns: [{ from: path.resolve(__dirname, 'public') }],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: (e) => {
                        const fileName = e.filename.replace('src/assets/img/', '')
                        return `img/${fileName}`
                    },
                },
            },
            {
                test: /\.m?js$/,
                exclude: new RegExp(`node_modules/(?!(${transpileDependencies.join('|')})/).*`),
                use: {
                    loader: 'babel-loader?cacheDirectory',
                },
            },
        ],
    },
}
