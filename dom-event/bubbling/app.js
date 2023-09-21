const container = document.querySelector('#container');
const button = document.querySelector('#changeColor');

button.addEventListener('click', function (e) {
    e.stopPropagation();
    container.style.backgroundColor = makeRandColor();
});

container.addEventListener('click', function () {
    container.classList.add('hide');
});

const makeRandColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}