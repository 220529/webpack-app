import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
console.log("moment", moment.locale());
console.log("date", moment().format("ll"));

console.log("index page...111211");

import $ from "jquery";
$(document).ready(function () {
  // 创建一个新的按钮元素
  const $button = $("<button>Click me!</button>");

  // 将按钮添加到文档中
  $("body").append($button);

  // 给按钮绑定点击事件
  $button.on("click", function () {
    alert("Button clicked!");
  });

  // 修改文档标题
  $("title").text("Webpack jQuery Example");
});

import { sum } from "./math";

const sumRes = sum(10, 20);
console.log("sumRes", sumRes);

console.log("module", module.hot);

// 增加，开启热更新之后的代码逻辑
if (module.hot) {
  module.hot.accept(["./math"], () => {
    const sumRes = sum(10, 30);
    console.log("sumRes in hot", sumRes);
  });
}
