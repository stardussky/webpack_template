const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const chokidar = require('chokidar')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        onBeforeSetupMiddleware(devServer) {
            chokidar.watch([path.resolve(__dirname, 'index.html')]).on('all', function () {
                devServer.sendMessage(devServer.webSocketServer.clients, 'content-changed')
            })
        },
        compress: true,
        hot: 'only',
        static: {
            directory: './dist',
        },
        // host: 'local-ip',
        allowedHosts: 'all',
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        // open: false,
        // https: true,
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                        },
                    },
                ],
            },
        ],
    },
})
