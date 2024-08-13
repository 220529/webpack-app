const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const webpackCommonConf = require("./webpack.common.js");
const { distPath } = require("./paths");

// 第一，引入 DllReferencePlugin
const DllReferencePlugin = require("webpack/lib/DllReferencePlugin");

module.exports = merge(webpackCommonConf, {
  mode: "development",
  plugins: [
    new webpack.DefinePlugin({
      // window.ENV = 'production'
      ENV: JSON.stringify("development"),
    }),
    // 第三，告诉 Webpack 使用了哪些动态链接库
    new DllReferencePlugin({
      // 描述 react 动态链接库的文件内容
      manifest: require(path.join(distPath, "react.manifest.json")),
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
