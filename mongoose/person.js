// - virtual
// - Middleware
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopApp', { useNewUrlParser: true, useUnifiedTopology: true }) // => Promise
    .then(() => {
        console.log('connection ok!');
    })
    .catch(err => {
        console.log('connection err!');
        console.log(err);
    });
const personSchema = new mongoose.Schema({
    first: String,
    last: String
});

// virtual -> fullNameまでもDBに保存するムダをなくせる！
// virtualにはget（ゲッター）とset（セッター）がある（cf. mongoose docs）
personSchema.virtual('fullName').get(function () {
    return `${this.first} ${this.last}`;
});

// MongooseのMiddleware: 特定処理（e.g. save）の前（pre）や後（post）に、任意の処理を差し込める
// 注意: Middleware特有のルールを守る必要がある（パスするために幾つか方法がある:（今回はasyncで）Promiseを返す方法 / next（次のミドルウェア）を呼ぶ方法）-> Expressのミドルウェアの章で詳述
personSchema.pre('save', async function () {
    console.log('セーブ開始！');
});
personSchema.post('save', async function () {
    console.log('セーブ完了！');
});

const Person = mongoose.model('Person', personSchema);

// モデルのインスタンスにfullNameプロパティがあるかのように振舞う（しかし、DBにはfirst/lastプロパティしか存在しない！）
const yamada = new Person({ first: 'Ryo', last: 'Yamada' });
// yamada.save();
console.log(yamada.fullName);