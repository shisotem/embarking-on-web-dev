const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['果物', '野菜', '乳製品']
    },
    farm: {
        type: Schema.Types.ObjectId, 
        ref: 'Farm'
    }
});

const Product = new mongoose.model('Product', productSchema);

module.exports = Product;