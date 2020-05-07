var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool: "module-source-map",
  mode: "development",
  entry: ["./src/js/main"],
  output: {
    path: path.join(__dirname, "src", "build"),
    filename: "bundle.js",
    publicPath: "/static/",
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ["babel-loader"],
        include: path.join(__dirname, "src"),
      },
    ],
  },
};
