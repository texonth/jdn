const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devtool: "module-source-map",
  mode: "development",
  entry: [
    "./src/js/main.jsx",
    "./src/manifest.json"
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "./",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'JDN extension',
      template: './src/index.html',
      filename: 'index.html',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'JDN extension - panel',
      template: './src/panel.html',
      filename: 'panel.html'
    }),
    new MiniCssExtractPlugin({
      filename: "./css/[name].css"
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /manifest\.json$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "./[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.js?x$/,
        use: ["babel-loader"],
        include: path.join(__dirname, "src"),
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: { // important extra layer for less-loader^6.0.0
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: '[name].[ext]',
              outputPath: './images/'
            },
          },
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
          'url-loader'
        ]
      }
    ]
  },
};
