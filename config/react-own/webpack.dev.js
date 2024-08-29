const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const webpackCommonConf = require("./webpack.common.js");
const { distPath } = require("./paths");

module.exports = merge(webpackCommonConf, {
  mode: "development",
  plugins: [
    new webpack.DefinePlugin({
      // window.ENV = 'production'
      ENV: JSON.stringify("development"),
    }),
  ],
  devServer: {
    port: 8080,
    // open: true, // 自动打开浏览器
    compress: true, // 启动 gzip 压缩
    static: {
      directory: distPath,
    },
  },
});
