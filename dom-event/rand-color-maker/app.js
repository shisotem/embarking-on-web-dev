// const body = document.querySelector('body');
// -> document.body というショートカットがある！

const h1 = document.querySelector('h1');
const button = document.querySelector('button');

button.addEventListener('click', () => {
    const newColor = makeRandColor();
    document.body.style.backgroundColor = newColor;
    h1.innerText = newColor;

    // // 追加機能
    // if (isDark(r, g, b)) {
    //     h1.style.color = "white";
    // } else {
    //     h1.style.color = "black";
    // }
});

const makeRandColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
};

// // 追加機能
// const isDark = (r, g, b) => {
//     const avgRGB = (r + g + b) / 3;
//     const threshold = 100;
//     return avgRGB < threshold;
// };