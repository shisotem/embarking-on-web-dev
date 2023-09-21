// var: 関数のスコープはあるが、ブロックスコープの概念がない => ブロックスコープが終了しても内部の変数が生きている

// レキシカル（static）スコープ: 関数を定義した時点でスコープが決まる: ruby, java, python, js, ...で採用
// （<-> ダイナミック（動的）スコープ: perl, lisp, ...）
// let x = "aaa";
// function f() {
//     console.log(x); // aaa
// }
// function g() {
//     let x = "bbb";
//     f(); // aaa
// }
// f(); // aaa
// g(); // aaa

// // 関数はオブジェクト型の値である（ファーストクラスファンクション: 第一級関数）
// const pi = 3.14;
// const hello = function() {
//     console.log("hello");
// };
// // そのため高階関数に渡せる
// function doubleGreeting(func) {
//     func();
//     func();
// }
// doubleGreeting(hello);

// // 関数オブジェクトを返す関数も高階関数といえる
// function makeBetweenFunc(min, max) {
//     return function(num) {
//         return num >= min && num <= max;
//     };
// }
// const isChild = makeBetweenFunc(0, 18);
// console.log(isChild(5));
// console.log(isChild(21));

// // メソッド
// const myMath = {
//     PI: 3.14,
//     // square: function(num) {
//     //     return num * num;
//     // },
//     // cube: function(num) {
//     //     return num * num * num;
//     // },
//     // 省略記法
//     square(num) {
//         return num * num;
//     },
//     cube(num) {
//         return num * num * num;
//     },
// };
// console.log(myMath.PI);
// console.log(myMath.cube(3));

try {
    hello.toUpperCase();
} catch(err) {
    console.log(`以下のエラーがキャッチされました:\n${err}`);
}
console.log("エラーが生じても後続の処理を続けることが可能")


// this: thisの値は"thisを使っている関数がどのように呼ばれたか"に依存する
const dog = {
    name: "Lucia",
    cry() {
        console.log(this);
        console.log(`${this.name} said "woof!"`);
    }
}
dog.cry();
// => {name: 'Lucia', cry: ƒ}
// => Lucia said "woof!"
console.log(dog);
// => {name: 'Lucia', cry: ƒ}
// ---> thisはdog

const cry2 = dog.cry;
console.log(cry2());
// => Window {window: Window, self: Window, document: document, name: '', location: Location, …}
// => said "woof!"
// ---> thisはwindowになっている！

// windowはトップレベルの存在
// 組み込みのalertなどもwindow.alertとして呼び出せる（windowは省略可能）
// ユーザ定義の関数もwindow.をつけて呼び出せる
// function plus(a, b) {
//     return a + b;
// }
// window.plus(1, 2);
// => 3