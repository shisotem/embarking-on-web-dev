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
        min: [0, 'priceは0より大きい値にしてください'] // カスタムErrMsgの書き方
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String], // typeの省略記法
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
        enum: ['S', 'M', 'L'] // 有効な値を設定
    }
});
const Product = mongoose.model('Product', productSchema);

const bike = new Product({
    name: 'ジャージ',
    price: 2980,
    categories: ['サイクリング'],
    size: 'XS'
});
bike.save()
    .then(data => {
        console.log('save ok!');
        console.log(data);
    })
    .catch(err => {
        console.log('save err!');
        console.log(err);
    });

// 注意: "update"時にもvalidationを効かせるには、{ runValidators: true }が必要！
Product.findOneAndUpdate({ name: '空気入れ' }, { price: -1980 }, { new: true, runValidators: true })
    .then(data => {
        console.log('update ok!');
        console.log(data);
    })
    .catch(err => {
        console.log('update err!');
        console.log(err);
    });
