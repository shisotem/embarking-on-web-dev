const input = document.querySelector('input');

// input.addEventListener('change', function () {
//     console.log('change: 入力を変更し、カーソルを外したときに発火！');
// });

const h1 = document.querySelector('h1');

input.addEventListener('input', function () {
    console.log('input: 文字が入力される度に発火（shift等は無視！）');
    h1.innerText = input.value;
});