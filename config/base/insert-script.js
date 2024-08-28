const HtmlWebpackPlugin = require("html-webpack-plugin");

class InsertScriptPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("InsertScriptPlugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        "InsertScriptPlugin",
        (data, callback) => {
          const scriptTag = `<script>${this.options.script}</script>`;
          data.html = data.html.replace("</body>", `${scriptTag}</body>`);
          callback(null, data);
        }
      );
    });
  }
}

module.exports = InsertScriptPlugin;
