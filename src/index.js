// 引入 css
import "./style/style1.css";
import "./style/style2.less";

// 引入第三方
import _ from "lodash";
console.log(_.each);

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
import imgFile1 from "./assets/1.png";
import imgFile2 from "./assets/2.png";
insertImgElem(imgFile1);
insertImgElem(imgFile2);

// 开发代理
fetch("/api/cats")
  .then((e) => e.json())
  .then((e) => {
    console.log("fetch", e);
  });
