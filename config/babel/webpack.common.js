const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { srcPath } = require("./paths");

module.exports = {
  entry: {
    index: path.join(srcPath, "index"),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: srcPath,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
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
