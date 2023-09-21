const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/relationshipDemo',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('MongoDB connection ok!');
    })
    .catch(err => {
        console.log('MongoDB connection err!');
        console.log(err);
    });

// 子
const productSchema = new Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['spring', 'summer', 'fall', 'winter']
    }
});

// 親
const farmSchema = new Schema({
    name: String,
    city: String,
    // mongoose.Schema.TypesにあるObjectId型を取ってくる
    // -> 何のObjectId？-> 対象となるモデルを指定する（ref）
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

const Product = mongoose.model('Product', productSchema);
const Farm = mongoose.model('Farm', farmSchema);

// Product.insertMany([
//     { name: 'メロン', price: 498, season: 'summer' },
//     { name: 'スイカ', price: 498, season: 'summer' },
//     { name: 'アスパラガス', price: 298, season: 'spring' }
// ]);

const makeFarm = async () => {
    const farm = new Farm({ name: 'まったり牧場', city: '淡路市' });
    const melon = await Product.findOne({ name: 'メロン' });
    farm.products.push(melon);
    await farm.save();
    console.log(farm);
};

// makeFarm();
// ↓（MongoDBでは...）
// [
//   {
//     _id: ObjectId("64fec2bf25a48162c0eb31f4"),
//     products: [ ObjectId("64febb676998724bf22c64f0") ],
//     name: 'まったり牧場',
//     city: '淡路市',
//     __v: 0
//   }
// ]

const addProduct = async () => {
    const farm = await Farm.findOne({ name: 'まったり牧場' });
    const watermelon = await Product.findOne({ name: 'スイカ' });
    farm.products.push(watermelon);
    await farm.save();
    console.log(farm);
};

// addProduct();
// ↓（MongoDBでは...）
// [
//   {
//     _id: ObjectId("64fec2bf25a48162c0eb31f4"),
//     products: [
//       ObjectId("64febb676998724bf22c64f0"),
//       ObjectId("64febb676998724bf22c64f1")
//     ],
//     name: 'まったり牧場',
//     city: '淡路市',
//     __v: 1
//   }
// ]



// Farm.findOne({ name: 'まったり牧場' }).then(farm => console.log(farm));
// ↓（Mongooseでは...）
// {
//     products: [ 64febb676998724bf22c64f0, 64febb676998724bf22c64f1 ],
//     _id: 64fec2bf25a48162c0eb31f4,
//     name: 'まったり牧場',
//     city: '淡路市',
//     __v: 1
// }

Farm.findOne({ name: 'まったり牧場' })
    .populate('products') // productsプロパティをpopulate（ObjectIdの参照先を参照する）せよ
    .then(farm => console.log(farm));
// ↓（Mongooseでは...）
// {
//   products: [
//     {
//       _id: 64febb676998724bf22c64f0,
//       name: 'メロン',
//       price: 498,
//       season: 'summer',
//       __v: 0
//     },
//     {
//       _id: 64febb676998724bf22c64f1,
//       name: 'スイカ',
//       price: 498,
//       season: 'summer',
//       __v: 0
//     }
//   ],
//   _id: 64fec2bf25a48162c0eb31f4,
//   name: 'まったり牧場',
//   city: '淡路市',
//   __v: 1
// }