const makeRandColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
};

// 同じ処理内容
const buttons = document.querySelectorAll('button');
for (const button of buttons) {
    // button.addEventListener('click', function () {
    //     button.style.backgroundColor = makeRandColor();
    //     button.style.color = makeRandColor();
    // });
    button.addEventListener('click', colorize);
}
const h1s = document.querySelectorAll('h1');
for (const h1 of h1s) {
    // h1.addEventListener('click', function () {
    //     h1.style.backgroundColor = makeRandColor();
    //     h1.style.color = makeRandColor();
    // });
    h1.addEventListener('click', colorize);
}

// 共通化
function colorize() {
    this.style.backgroundColor = makeRandColor();
    this.style.color = makeRandColor();
}

// Point:
// xxx.yyy(zzz, function() {
//     console.log(this); // => xxx
// });

// Note: arrowには注意（こちらの性質が勝つ）
// xxx.yyy(zzz, () => {
//     console.log(this); // => window
// });
