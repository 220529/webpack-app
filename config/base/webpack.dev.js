const path = require("path");
const webpack = require("webpack");
const webpackCommonConf = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { srcPath, distPath } = require("./paths");

module.exports = merge(webpackCommonConf, {
  mode: "development",
  devServer: {
    historyApiFallback: true,
    static: {
      directory: distPath,
    },
    port: 8080,
    // progress: true,  // 显示打包的进度条
    // open: true,  // 自动打开浏览器
    compress: true, // 启动 gzip 压缩

    // 设置代理 —— 如果有需要的话！
    setupMiddlewares: (middlewares, devServer) => {
      // 添加代理中间件
      devServer.app.use(
        "/api",
        createProxyMiddleware({
          // 目标服务器地址
          target: "http://nest.lytt.fun",
          // 修改请求头中的 Origin 字段以匹配目标服务器
          changeOrigin: true,
          // 如果目标服务器是 HTTPS 但没有有效证书，则设置为 false
          secure: false,
          // 可选：对请求路径进行重写
          // pathRewrite: {
          //   "^/api": "", // 将请求路径中的 /api 替换为空
          // },
        })
      );

      // 返回中间件列表
      return middlewares;
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      // window.ENV = 'production'
      ENV: JSON.stringify("development"),
    }),
  ],
});
