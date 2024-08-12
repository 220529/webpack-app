const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { srcPath, distPath } = require("./paths");

module.exports = {
  entry: path.join(srcPath, "index"),
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset", // 资源模块
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 小于 8 KB 的图片将内联为 Base64
          },
        },
        generator: {
          filename: "images/[name][ext][query]", // 输出图片文件的路径
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, "templates", "index.html"),
      filename: "index.html",
    }),
  ],
};
