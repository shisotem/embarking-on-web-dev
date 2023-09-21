console.dir(document);

const banner = document.getElementById("banner");
console.dir(banner);

// allImages: HTMLCollection(Elementの集まり)
// => length, for-of は使用可
const allImages = document.getElementsByTagName("img");
console.dir(allImages);
console.dir(allImages[0]);
for (const img of allImages) {
    console.log(img.src);
    // img.src = "https://images.unsplash.com/photo-1563281577-a7be47e20db9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80";
}

const squareImages = document.getElementsByClassName("square");
console.dir(squareImages);
for (const img of squareImages) {
    console.log(img.src);
}

// 失敗時の返り値
// id => null
// tag, class => 空のHTMLCollection


// querySelector ... 柔軟！
document.querySelector("img");
document.querySelector("#banner");
document.querySelector(".square");

document.querySelector("img:nth-of-type(3)"); // 擬似クラス
document.querySelector('a[title="ヒツジ"]'); // 属性セレクタ

document.querySelectorAll("img");
const links = document.querySelectorAll("p a"); // 子孫セレクタ
for (const link of links) {
    // a要素のhref属性
    // console.log(link.href);
}