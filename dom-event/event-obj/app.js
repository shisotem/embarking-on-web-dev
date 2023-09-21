document.querySelector('button').addEventListener('click', function (e) {
    console.log(e);
});

// const input = document.querySelector('input');
// input.addEventListener('keydown', function (e) {
//     console.log(`key: ${e.key}`); // 文字の見た目
//     console.log(`code: ${e.code}`); // キーの位置
// });

// globalなwindow -> globalな処理
window.addEventListener('keydown', function (e) {
    switch (e.code) {
        case 'ArrowUp':
            console.log('↑');
            break;
        case 'ArrowDown':
            console.log('↓');
            break;
        case 'ArrowLeft':
            console.log('←');
            break;
        case 'ArrowRight':
            console.log('→');
            break;
        default:
            console.log('Other');
    }
});