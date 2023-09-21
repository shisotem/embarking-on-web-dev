// ページ上で見えているテキストだけ
document.querySelector('p').innerText;
// CSSによるdisplay: none等でページ上では見えてなくとも、
// 全ての要素の内容を取得（space, \n等も表示）
document.querySelector('p').textContent;
// 全てのHTMLが表示される（<b><i>やspace, \n等を含む）
document.querySelector('p').innerHTML;

const allLinks = document.querySelectorAll('a');
for (const link of allLinks) {
    // link先のアドレス（href）は変わらない
    link.innerText = "I'm link!";
}
// HTML要素を操作できるのはinnerHTMLだけ！
document.querySelector('h1').innerHTML += " said <i>\"I'm italic h1!\"</i>";



// 属性について
console.log(document.querySelector('#banner').id);
console.log(document.querySelector('#banner').src);
console.log(document.querySelector('a').title);
console.log(document.querySelector('a').href); // "file://wsl.localhost"も表示
// getAttributeメソッド（プロパティアクセスと微妙に異なる場合がある）
const firstLink = document.querySelector('a');
console.log(firstLink.getAttribute('title'));
console.log(firstLink.getAttribute('href')); // "file://wsl.localhost"は省略
// setAttribute
firstLink.setAttribute('href', 'https://google.com');
console.log(firstLink.getAttribute('href'));

// const input = document.querySelectorAll('input')[1];
const input = document.querySelector('input[type="text"]');
console.log(input.type);
input.type = 'password';
console.log(input.type);
input.setAttribute('type', 'color');
console.log(input.type);



// styleプロパティ
// 注: inlineで指定 | jsで指定 したstyleのみ取得可能
// （app.cssに書かれただけの場合は取得不可）
const h1 = document.querySelector('h1');
console.dir(h1.style);
console.dir(h1.style.color); // => ""
// jsで指定 (-> dev-toolのElementsのhtmlが書き換わる！)
h1.style.color = 'orange';
console.dir(h1.style);
console.log(h1.style.color); // => "purple"
h1.style.border = "3px dashed skyblue";
console.dir(h1.style);
console.dir(h1.style.border); // => "3px dashed skyblue"
// inlineで指定
const h2 = document.querySelector('h2[style="color: purple;"]');
console.dir(h2.style);
console.dir(h2.style.color); // => "purple"

// cf. getComputedStyle()
// ->（styleプロパティとは異なり）最終的なStyleを取得する方法
console.log(getComputedStyle(h1).color);
// inline | js で指定していないのに表示される！
console.log(getComputedStyle(h1).fontSize);



// クラスを利用した、よりよいスタイルの当て方について

// const h2History = document.querySelectorAll('h2')[1];
// h2History.setAttribute('class', 'red');
// // h2History.setAttribute('class', 'border'); // redが上書きされてしまう！

// // 出来るけど大変...
// const currentClasses = h2History.getAttribute('class');
// h2History.setAttribute('class', `${currentClasses} border`);

const h2History = document.querySelectorAll('h2')[1];
console.log(h2History.classList);
h2History.classList.add('red');
h2History.classList.add('border');
h2History.classList.remove('border');

console.log(h2History.classList.contains('red')); // => true
console.log(h2History.classList.contains('border')); // => false

h2History.classList.toggle('red'); // false (remove)
h2History.classList.toggle('red'); // true (add)
h2History.classList.toggle('border'); // true (add)



// parentElement
const firstBold = document.querySelector('b');
console.log(firstBold.parentElement); // => p
console.log(firstBold.parentElement.parentElement);

// children
const paragraph = firstBold.parentElement;
console.dir(paragraph.children); // HTMLCollection(11)
// paragraph.children[0].parentElement // => p

const squareImg = document.querySelector('.square');
// nextSibling（次のnode（ここでは"\n  "）を返す）
console.log(squareImg.nextSibling);
// nextElementSibling（次の要素=Elementを返す）
console.log(squareImg.nextElementSibling);



// 子要素としての追加

// appendChild
const newImg = document.createElement('img');
newImg.src = "https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RyYW5nZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60";
document.body.appendChild(newImg);
newImg.classList.add('square');
const newH3 = document.createElement('h3');
newH3.innerText = "This is new h3!";
document.body.appendChild(newH3);
// append
const p = document.querySelector('p');
p.append('aaa');
p.append('bbb', 'ccc', 'ddd');
// prepend
const newB = document.createElement('b');
newB.append('in b Element');
p.prepend(newB);


// 兄弟要素としての追加

// insertAdjacentElement()
const h2Inserted = document.createElement('h2');
h2Inserted.append('**inserted h2 Element**');
const h1Base = document.querySelector('h1');
h1Base.insertAdjacentElement('afterend', h2Inserted);
console.log(h1.nextElementSibling);
// after()
const h3After = document.createElement('h3');
h3After.innerText = '**After()**'
h1Base.after(h3After);


// 要素の削除

// （親要素から面倒な）removeChild()
const li = document.querySelector('li');
li.parentElement.removeChild(li);

// 便利な remove()
const a = document.querySelectorAll('a')[1];
a.remove();