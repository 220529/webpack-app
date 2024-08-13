const webpackCommonConf = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const { distPath } = require("./paths.js");

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
  }
});
