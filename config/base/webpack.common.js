const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { srcPath, distPath } = require("./paths");
const InsertScriptPlugin = require("./insert-script");
const RunShellScriptPlugin = require("./run-shell");

module.exports = {
  entry: path.join(srcPath, "index"),
  module: {
    rules: [
      // {
      //   test: /\.(png|jpe?g|gif)$/i,
      //   type: "asset/resource",
      // //   type: "asset/inline",
      // },
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
      ,
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, "templates", "index.html"),
      filename: "index.html",
    }),
    // new HelloWorldPlugin({ options: true }),
    new InsertScriptPlugin({
      script: 'console.log("Hello from inserted script!");',
    }),
    new RunShellScriptPlugin({
      scriptPath: "./log.sh", // 指定你的 shell 脚本路径
    }),
  ],
};
