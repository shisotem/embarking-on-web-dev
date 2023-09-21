// const arr = [1, 2, 3];
// arr.push(4); 
// console.dir(arr); => __proto__: Array(0)

// arr自体はpushメソッドを持っていないが__proto__プロパティを持っている
// このdunderprotoプロパティはArray.prototypeを指す＝参照である
// -> Array特有のメソッド・プロパティ群をprototypeから継承している
// (arrもarr2も"同じprototypeオブジェクト"への参照を持っている)

// Array.prototype: Arrayオブジェクトの雛形＝テンプレートのオブジェクト

// const body = document.body;
// console.dir(body); => __proto__: HTMLBodyElement


// [Demo]
// 注: 実際にはプリミティブ型を包むオブジェクトがあり、そのオブジェクトが
// String.prototypeを参照しているため、メソッド・プロパティ群が使える
String.prototype.foo = function () { console.log('Foo!'); };
const bar = 'bar';
bar.foo(); // => Foo! 

String.prototype.shout = function () {
    console.log(this.toUpperCase());
};
const hello = 'hello';
hello.shout();

Array.prototype.pop = function () {
    console.log('上書き！');
};

console.log([1, 2].pop());

// __proto__ ---> Array.prototype