// index.jsのファイル名は"ディレクトリのrequire"において固定の名前
const pochi = require('./pochi');
const innu = require('./innu');
const lucia = require('./lucia');

const allDogs = [pochi, innu, lucia]; // オブジェクトの配列
// console.log(allDogs);

module.exports = allDogs;