// factory func
function makeColor(r, g, b) {
    const color = {};
    color.r = r;
    color.g = g;
    color.b = b;
    color.rgb = function () {
        const { r, g, b } = this; // this: firstColor (.の左側)
        return `rgb(${r}, ${g}, ${b})`;
    };
    color.hex = function () {
        const { r, g, b } = this;
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return color;
}

const firstColor = makeColor(35, 255, 150);
console.log(firstColor);
console.log(firstColor.rgb());
console.log(firstColor.hex());

// makerColor()を呼ぶ度に，関数(rgb/hex)を重複して作ってしまう!
const secondColor = makeColor(0, 0, 0);
console.log(firstColor.hex === secondColor.hex); // => false
console.log('ab'.slice === 'cd'.slice); // => true (String.prototype.slice)



// constructor func (Color型)
function Color(r, g, b) {
    // this = {};
    this.r = r;
    this.g = g;
    this.b = b;
    // return this;
}

// Array.prototype.pop = function() {
//     console.log('dummy!');
// }; と同様にしてメソッドを定義する
Color.prototype.rgb = function () {
    const { r, g, b } = this;
    return `rgb(${r}, ${g}, ${b})`;
};
Color.prototype.hex = function () {
    const { r, g, b } = this;
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
// 注: Arrow関数内のthisは「Arrow関数が定義されているスコープのthis」になる
// よって、次でArrow関数を使うと、「globalスコープのthis(＝ブラウザの場合はWindow)」になってしまう！
// this <-「globalスコープのthis(＝ブラウザの場合はWindow)」
Color.prototype.rgba = function (a = 1.0) {
    const { r, g, b } = this;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// new 演算子は次のことを行います。// new Color(0, 0, 0)
// 1. 空のプレーンな JavaScript オブジェクトを生成します。// {}
// 2. 新しいオブジェクトにプロパティ (__proto__) を追加し、コンストラクター関数のプロトタイプオブジェクトに結びつけます。
// --- 新しいオブジェクト (this = {}) に__proto__を追加する．このプロパティは，Color.prototypeを指す．
// 3. 新しく生成されたオブジェクトインスタンスを this コンテキストとして結びつけます。 （すなわち、コンストラクター関数内の this へのすべての参照は、最初のステップで作成されたオブジェクトを参照するようになります。）// this = {}
// 4. 関数がオブジェクトを返さない場合は this を返します。// return this

const color1 = new Color(90, 37, 60);
// color1.rgb();とした時のrgb関数内のthisは、.の左側であるcolor1オブジェクト
const color2 = new Color(0, 0, 0);

console.log(color1.hex === color2.hex); // true

document.body.style.backgroundColor = color1.rgba(0.5);