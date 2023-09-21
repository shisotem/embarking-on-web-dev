const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopApp', { useNewUrlParser: true, useUnifiedTopology: true }) // => Promise
    .then(() => {
        console.log('connection ok!');
    })
    .catch(err => {
        console.log('connection err!');
        console.log(err);
    });
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 10
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'priceは0より大きい値にしてください']
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
});

// >>> instance methods（インスタンスから使えるメソッド）の追加 >>>
productSchema.methods.greet = function () {
    console.log(`Hello!! I'm ${this.name}!!`)
    // thisは"p"（"p".greet()）
};

productSchema.methods.toggleOnSale = function () {
    this.onSale = !this.onSale;
    return this.save(); // saveは時間がかかる処理（i.e. 非同期な処理）なので、呼び出し元でthen/await出来るよう、（ほぼ）プロミスをreturnしてあげる
};

productSchema.methods.addCategory = function (newCat) {
    this.categories.push(newCat);
    return this.save();
};
// <<< instance methods（インスタンスから使えるメソッド）の追加 <<<

const Product = mongoose.model('Product', productSchema);

const p = new Product({ name: 'バッグ', price: 1000 });
p.greet(); // ins

const findProduct = async () => {
    const foundProduct = await Product.findOne({ name: 'ヘルメット' });
    foundProduct.greet(); // ins

    console.log(foundProduct);
    await foundProduct.toggleOnSale(); // ins // 時間がかかる処理（i.e. 非同期な処理）をawaitで、待ってあげる
    await foundProduct.addCategory('アウトドア'); // ins
    console.log(foundProduct);
};
findProduct();

// >>> static methods（クラスから使えるメソッド）の追加 >>>
productSchema.statics.fireSale = function () {
    return this.updateMany({}, { onSale: true, price: 0 });
    // thisは"Product"（"Product".fireSale()）
};
// <<< static methods（クラスから使えるメソッド）の追加 <<<

Product.fireSale().then(msg => console.log(msg)); // sta