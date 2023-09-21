const mongoose = require('mongoose');
const { Schema } = mongoose;
const Product = require('./product');

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'nameが必要です']
    },
    city: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'emailが必要です']
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

// 注: MongooseのミドルウェアとExpressのミドルウェアは、全く何の関係もない別物！！

// ・Mongooseのミドルウェア
//   - Mongooseのミドルウェアでは「async関数の場合はnextを呼ぶ必要がない」（Promiseが返る場合、nextしないでOKな作りになっている）
//   - Doc曰く、findByIdAndDeleteはfindOneAndDeleteというミドルウェアを内部的に実行する
farmSchema.post('findOneAndDelete', async function (farm) { // farm: 削除された農場
    if (farm.products.length) {
        // farm.products: 商品idの配列 ['h3is9kt', 'ja72i9a', 'en7fi29'] -> _idがこの配列に含まれているならその商品を消去
        const res = await Product.deleteMany({ _id: { $in: farm.products } });
        console.log(res);
    }
});

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;