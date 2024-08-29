const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { srcPath } = require("./paths");

module.exports = {
  entry: path.join(srcPath, "index"),
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: srcPath,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            cacheDirectory: true, // 启用缓存
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, "index.html"),
      filename: "index.html",
    }),
  ],
};
