const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Определяем базовый путь в зависимости от окружения
const isProduction = process.env.NODE_ENV === 'production';
const publicPath = isProduction ? '/trello-clone/' : '/';

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: publicPath, // Динамический путь для локальной разработки и GitHub Pages
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      // Добавляем базовый тег для корректной работы относительных путей
      base: isProduction ? '/trello-clone/' : '/',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true,
  },
};