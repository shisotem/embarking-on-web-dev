// All file system operations have synchronous, callback, and promise-based forms.

// // 1. synchronous (同期)
// try {
//     fs.unlinkSync('/tmp/hello'); // 実行が終了するまで次の行に行かない ≒ await
//     console.log('successfully deleted /tmp/hello');
// } catch (err) {
//     // handle the error
// }

// // 2. callback (非同期)
// fs.unlink('/tmp/hello', (err) => {
//     if (err) throw err;
//     console.log('successfully deleted /tmp/hello');
// });

// // 3. Promise (非同期)
// (async function (path) {
//     try {
//         await fs.unlink(path);
//         console.log('success');
//     } catch (err) {
//         // err
//     }
// })('/tmp/hello');


const fs = require('fs');
const dirName = process.argv[2] || 'project'; // 引数なし -> undefined -> デフォルト値を用意

// // 非同期
// console.log('1');
// fs.mkdir(dirName, { recursive: true }, (err) => {
//     console.log('3');
//     if (err) throw err;
// });
// console.log('2');

// 同期
// console.log('1');
// fs.mkdirSync(dirName);
// console.log('2');

try {
    fs.mkdirSync(dirName);
    fs.writeFileSync(`${dirName}/index.html`);
    fs.writeFileSync(`${dirName}/app.js`);
    fs.writeFileSync(`${dirName}/styles.css`);
} catch (err) {
    console.log(err);
}