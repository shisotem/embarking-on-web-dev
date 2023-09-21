const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '[商品名が必要です。このMongooseエラーメッセージは./models/product.jsで設定されています。]']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['果物', '野菜', '乳製品']
    }
});

const Product = new mongoose.model('Product', productSchema);

module.exports = Product;