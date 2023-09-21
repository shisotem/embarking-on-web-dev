// module.exports = {}
// 空のオブジェクトにプロパティを追加していく

const add = (x, y) => x + y;
const PI = 3.1415926535;
const square = x => x * x;

// exportsにはmodule.exportsが代入されているためショトカとして使えるが、
// exportsを別のもの（e.g. 文字列）で上書きしてはいけないので注意

// exports = module.exports;
// exports = 'asdfasdf';
// 'asdfasdf'.add = add;
// 'asdfasdf'.PI = PI;
// 'asdfasdf'.square = square;

exports.add = add;
exports.PI = PI;
exports.square = square;

// -----

// module.exports.add = (x, y) => x + y;
// module.exports.PI = 3.1415926535;
// module.exports.square = x => x * x;

// const math = {
//     add: add,
//     PI: PI,
//     square: square
// };
// module.exports = math;

// module.exports.add = add;
// module.exports.PI = PI;
// module.exports.square = square;