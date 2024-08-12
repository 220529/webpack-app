// 引入 css
import "./style/style1.css";
import "./style/style2.less";

console.log("window.ENV", ENV);

const print = (info) => {
  console.log(info);
};
print("hello webpack 5");

// 引入公用js文件
import { sum } from "./sum";
const sumRes = sum(10, 20);
console.log("sumRes", sumRes);

// 引入图片
function insertImgElem(imgFile) {
  const img = new Image();
  img.src = imgFile;
  document.body.appendChild(img);
}

// 开发代理
function createFetch(params) {
  fetch("/api/cats")
    .then((e) => e.json())
    .then((e) => {
      console.log("fetch", e);
    });
}
// createFetch()

// 引入第三方
import _ from "lodash";
console.log(_.each);

async function createComponenets() {
  const element = document.createElement("div");
  const button = document.createElement("button");
  button.innerHTML = "Click me and look at the console!";
  button.onclick = async () => {
    import(/* webpackChunkName: "print" */ "./print").then((module) => {
      const print = module.default;
      print();
    });
  };

//   const _ = await import("lodash");
//   element.innerHTML = _.default.join(["Hello", "webpack"], " ");

  element.appendChild(button);

  document.body.appendChild(element);
}
createComponenets();

import imgFile1 from "./assets/1.png";
import imgFile2 from "./assets/2.png";
insertImgElem(imgFile1);
insertImgElem(imgFile2);
