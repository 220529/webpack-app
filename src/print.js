const str = "aaa";
console.log(
  "The print.js module has loaded! See the network tab in dev tools...",
  str
);

export default () => {
  console.log('Button Clicked: Here\'s "some text"!');
};
