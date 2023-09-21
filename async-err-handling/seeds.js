// シードファイル: 初期データ（シードデータ）をDBに一括作成する（投入する）スクリプト
const mongoose = require('mongoose');
const Product = require('./models/product');

// seeds.js -> index.jsやexpressとは無関係（nodejsから実行して"シードデータを投入"するスクリプトファイル）
// -> 別途、seeds.jsとmongodbを接続する必要がある
mongoose.connect('mongodb://localhost:27017/farmStand2', { useNewUrlParser: true, useUnifiedTopology: true }) // => Promise
    .then(() => {
        console.log('MongoDB connection ok!');
    })
    .catch(err => {
        console.log('MongoDB connection err!');
        console.log(err);
    });

// const p = new Product({
//     name: 'ルビーグレープフルーツ',
//     price: 198,
//     category: '果物'
// });
// p.save().then(p => {
//     console.log(p);
// }).catch(e => {
//     console.log(e);
// });

const seedProducts = [
    {
        name: 'ナス',
        price: 98,
        category: '野菜'
    },
    {
        name: 'カットメロン',
        price: 480,
        category: '果物'
    },
    {
        name: '種無しスイカのカット',
        price: 380,
        category: '果物'
    },
    {
        name: 'オーガニックセロリ',
        price: 198,
        category: '野菜'
    },
    {
        name: 'コーヒー牛乳',
        price: 298,
        category: '乳製品'
    },
];

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res);
    }).catch(e => {
        console.log(e);
    });