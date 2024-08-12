const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { srcPath, distPath } = require("./paths");

module.exports = {
  entry: {
    index: path.join(srcPath, "index"),
    // other: path.join(srcPath, "other"),
  },
  externals: {
    jquery: 'jQuery', // 将 jquery 标记为外部依赖
  },
  module: {
    noParse: /jquery/,
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
      {
        test: /\.m?js$/,
        include: srcPath,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            cacheDirectory: true // 启用缓存
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, "templates", "index.html"),
      filename: "index.html",
      chunks: ["index", "vendor", "common"], // 要考虑代码分割
    }),
    // new HtmlWebpackPlugin({
    //   template: path.join(srcPath, "templates", "other.html"),
    //   filename: "other.html",
    //   chunks: ["index", "vendor", "common"], // 要考虑代码分割
    // }),
  ],
};
