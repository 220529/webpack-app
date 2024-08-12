import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
console.log("moment", moment.locale());
console.log("date", moment().format("ll"));

console.log("index page");
