const { PI, square } = require('./math'); // ./ がないと他人の作ったモジュールを探してしまう（相対パス）
// console.log(square(9));

// require('./math') の返り値はオブジェクト（== module.exports）
// => 分割代入も可能



// ディレクトリのrequire => デフォルトではindex.jsをサーチ
const dogs = require('./shelter'); // dirName
// console.log(dogs);
// [ { name: 'pochi', color: 'white' },
//   { name: 'innu', color: 'brown' },
//   { name: 'lucia', color: 'gray' } ]