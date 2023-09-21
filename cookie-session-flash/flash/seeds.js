const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/flashDemo', { useNewUrlParser: true, useUnifiedTopology: true }) // => Promise
    .then(() => {
        console.log('MongoDB connection ok!');
    })
    .catch(err => {
        console.log('MongoDB connection err!');
        console.log(err);
    });

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