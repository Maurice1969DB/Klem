/**
 * Created by maurice on 26-07-16.
 */

const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {

    entry: PATHS.app,

    resolve: {

        extensions: [ '.js', '.jsx']

    },

    output: {
        publicPath: PATHS.build,
        path: PATHS.build,
        filename: 'bundle.js'
    },

    module: {

        rules: [
            {
                test: /\.css$/,
                include: PATHS.style,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: [{loader:'style-loader'},{loader:'css-loader'}, {loader:'sass-loader'}],
                include: PATHS.style
            },

            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/react'],
                        plugins: ['@babel/transform-runtime']
                    }
                }
            }
        ]

    },

    externals: {
        'Config':
            JSON.stringify ({server: ''})
    }

};

if (TARGET === 'start' || !TARGET) {

    module.exports = merge(common, {

        //devTool: 'eval-source-map',

        devServer: {

            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,

            stats: 'errors-only',

            host: process.env.HOST,
            port: process.env.PORT

        }

    });

}

if (TARGET === 'build3') {

    module.exports = merge(common, {

        plugins: [

            new webpack.DefinePlugin({'process.env.NODE_ENV' : JSON.stringify("production")}),

            // new webpack.optimize.UglifyJsPlugin({
            //  compress: {
            //       warnings: false
            //   }

            //}),

            //new CleanWebpackPlugin(['build'], {
            // root: PATHS.app,
            //verbose: true,
            //dry: false
            //})
        ],

        mode: 'production'

    });

}