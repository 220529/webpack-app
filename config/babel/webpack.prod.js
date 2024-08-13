const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpackCommonConf = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { srcPath, distPath } = require("./paths.js");

module.exports = merge(webpackCommonConf, {
  mode: "production",
  output: {
    filename: "[name].[contenthash:8].js", // 打包代码时，加上 hash 戳
    path: distPath,
  },
  optimization: {
    minimizer: [
      new TerserPlugin(), // 压缩 JavaScript。
    ],
    // 分割代码块
    splitChunks: {
      // initial 入口chunk，对于异步导入的文件不处理
      // async 异步chunk，只对异步导入的文件处理
      // all 全部chunk
      chunks: "all",
      // 缓存分组
      cacheGroups: {
        // 第三方模块
        vendor: {
          name: "vendor", // chunk 名称
          priority: 1, // 权限更高，优先抽离，重要！！！
          test: /node_modules/,
          minSize: 0, // 大小限制
          minChunks: 1, // 最少复用过几次
        },

        // 公共的模块
        common: {
          name: "common", // chunk 名称
          priority: 0, // 优先级
          minSize: 0, // 公共模块的大小限制
          minChunks: 2, // 公共模块最少复用过几次
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹
  ],
});
