import React from "react";
import ReactDOM from "react-dom";

// const element = <span title="foo">own</span>;

const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
};

const node = document.createElement(element.type);
node["title"] = element.props.title;

const text = document.createTextNode("");
text["nodeValue"] = element.props.children;

console.log("text", text);

node.appendChild(text);

const container = document.getElementById("root");
container.appendChild(node);
