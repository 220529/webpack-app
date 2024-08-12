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
    // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.m?js$/,
        include: srcPath,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "thread-loader", // 将构建任务分配到多个子进程中
            options: {
              // 配置线程池
              workers: 2, // 可选，指定线程数，默认为 CPU 核心数
            },
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              cacheDirectory: true, // 启用缓存
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true, // 启用代码压缩
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(), // 优化和压缩 CSS。
      new TerserPlugin({
        // 压缩 JavaScript
        terserOptions: {
          compress: {
            drop_console: true, // 移除所有console相关代码
            drop_debugger: true, // 移除自动断点功能
            pure_funcs: ["console.log", "console.error"], // 配置移除指定的指令
          },
          format: {
            comments: false, // 删除注释
          },
        },
        extractComments: false, // 是否将注释剥离到单独的文件中
        parallel: true, // 使用多进程并发运行以提高构建速度
      }),
    ],
    // 分割代码块
    // splitChunks: {
    //   chunks: "all",
    //   /**
    //            * initial 入口chunk，对于异步导入的文件不处理
    //               async 异步chunk，只对异步导入的文件处理
    //               all 全部chunk
    //            */

    //   // 缓存分组
    //   cacheGroups: {
    //     // 第三方模块
    //     vendor: {
    //       name: "vendor", // chunk 名称
    //       priority: 1, // 权限更高，优先抽离，重要！！！
    //       test: /node_modules/,
    //       minSize: 0, // 大小限制
    //       minChunks: 1, // 最少复用过几次
    //     },

    //     // 公共的模块
    //     common: {
    //       name: "common", // chunk 名称
    //       priority: 0, // 优先级
    //       minSize: 0, // 公共模块的大小限制
    //       minChunks: 2, // 公共模块最少复用过几次
    //     },
    //   },
    // },
  },
  plugins: [
    new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹
    new webpack.DefinePlugin({
      // window.ENV = 'production'
      ENV: JSON.stringify("production"),
    }),
    // 抽离 css 文件
    new MiniCssExtractPlugin({
      filename: "css/main.[contentHash:8].css",
    }),
    // 忽略 moment 下的 /locale 目录
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
});
