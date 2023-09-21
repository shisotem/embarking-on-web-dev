const btn = document.querySelector('#v2');
console.dir(btn); // onclick: null
// console.log(btn.onclick) // null
btn.onclick = function () {
    console.log('clicked!');
};

function scream() {
    console.log('ice cream!!!');
}
btn.onmouseenter = scream;

document.querySelector('h1').onclick = () => {
    alert('h1にもonclickを設定できる！');
};



const btn3 = document.querySelector('#v3');
btn3.addEventListener('mouseup', function () {
    alert('addEventListener!');
});

// なぜ、これがべスプラなのか？

function foo() {
    console.log('Foo');
}
function bar() {
    console.log('Bar');
}

const foobarBtn = document.querySelector('#foobar');
// foobarBtn.onclick = foo;
// foobarBtn.onclick = bar; 
// => fooが上書きされてしまう！
// 2つ以上の関数が設定できない！
foobarBtn.addEventListener('click', foo);
foobarBtn.addEventListener('click', bar, {once: true});
// 加えて、第3引数にオプションを指定することも出来る！