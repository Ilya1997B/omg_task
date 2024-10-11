const path = require('path');

module.exports = {
    mode: 'development', // Устанавливаем режим разработки
    entry: './src/index.ts',
    stats: { warnings: false },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        hot: true, // Включаем HMR
        open: true, // Автоматически открываем браузер
    },
    performance: {
        hints: false, // Отключаем предупреждения о производительности
    },
};
