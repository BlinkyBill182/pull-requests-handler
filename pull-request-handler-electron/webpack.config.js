const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main.js', // Your React entry point
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 8082,
    },
    resolve: {
        fallback: {
            "util": require.resolve("util/"),
            "buffer": require.resolve("buffer/"),
            "stream": require.resolve("stream-browserify"),
            "path": require.resolve("path-browserify"),
            "fs": require.resolve("browserify-fs")
        }
    }
};
