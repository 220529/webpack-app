const { exec } = require("child_process");
const path = require("path");

class RunShellScriptPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync(
      "RunShellScriptPlugin",
      (compilation, callback) => {
        const scriptPath = path.resolve(this.options.scriptPath);

        // 执行指定的 shell 脚本
        exec(`sh ${scriptPath}`, (err, stdout, stderr) => {
          if (err) {
            console.error(`执行脚本 ${scriptPath} 失败:`, err);
            callback(err);
          } else {
            console.log(`成功执行脚本 ${scriptPath}:\n`, stdout);
            callback();
          }
        });
      }
    );
  }
}

module.exports = RunShellScriptPlugin;
