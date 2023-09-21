const mongoose = require('mongoose');
// [URI]
// 27017: mongodbのサーバがデフォルトで使用する（リクエストを待ち受ける）ポート
// movieApp: どのdbを使うか？（e.g. animalShelter）
mongoose.connect('mongodb://localhost:27017/movieApp', { useNewUrlParser: true, useUnifiedTopology: true }) // => Promise
    .then(() => {
        console.log('connection ok!');
    })
    .catch(err => {
        console.log('connection err!');
        console.log(err);
    });

// Schema: collection内に入るドキュメントの形を定義する（mongodbにはschemaの概念はなく、あくまでmongoose内の概念）
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
});

// Model: mongooseが提供するJSの"クラス"（1つのcollectionに対して、1つのModelを用意する）
const Movie = mongoose.model('Movie', movieSchema);
// const Movie ... Model（JSのクラス）
// ('Movie', ... moviesという名前のcollection名になる

// インスタンス化（mongooseが_idを発行しプロパティに自動追加）
const amadeus = new Movie({ title: 'Amadeus', year: 1986, score: 9.2, rating: 'R' });
// amadeus.save(); // mongodbにインサート（全Modelが所持するメソッド）



// 時間が掛かるのでPromiseが返るつくりになっている（validationを通った"documentがresolveされる"）
// Movie.insertMany([
//     { title: 'Amelie', year: 2001, score: 8.3, rating: 'R' },
//     { title: 'Alien', year: 1979, score: 8.1, rating: 'R' },
//     { title: 'The Iron Giant', year: 1999, score: 7.5, rating: 'PG' },
//     { title: 'Stand By Me', year: 1986, score: 8.6, rating: 'R' },
//     { title: 'Moonrise Kingdom', year: 2012, score: 7.3, rating: 'PG-13' },
// ]).then(data => {
//     console.log('insertMany ok!');
//     console.log(data);
// });



// find() => Query が返る: 完全にPromiseではないがthenもawaitも使用可能なもの
// find().exec() => 完全な Promise が返る: より推奨される方法
// Movie.find({}).then(data => console.log(data));
// Movie.find({rating: 'PG-13'}).then(data => console.log(data));
Movie.find({ year: { $gte: 2010 } }).then(data => console.log(data)); // => （オブジェクトの入った）配列
Movie.findOne({ _id: '64ef35a72e28991e7a72b490' }).then(data => console.log(data)); // => オブジェクト
Movie.findById('64ef35a72e28991e7a72b490').then(data => console.log(data)); // _idを指定した場合のfindOne（1つ上）と同じ！



// $setが不要
Movie.updateOne({ title: 'Amadeus' }, { year: 1984 }).then(res => console.log(res)); // => { n: 1, nModified: 1, ok: 1 }
Movie.updateMany({ title: { $in: ['Amadeus', 'Stand By Me'] } }, { score: 10 }).then(res => console.log(res)); // => { n: 2, nModified: 2, ok: 1 }
Movie.findOneAndUpdate({ title: 'The Iron Giant' }, { score: 7.8 }, { new: true }).then(m => console.log(m)); //  // =>（変更後）オブジェクト（: { new: true }）



// Movie.deleteOne({ title: 'Amelie' }).then(msg => console.log(msg)); // => { n: 1, ok: 1, deletedCount: 1 }
// Movie.deleteMany({ year: { $gte: 1999 } }).then(msg => console.log(msg)); // => { n: 2, ok: 1, deletedCount: 2 }
// Movie.findOneAndDelete({ title: 'Alien' }).then(m => console.log(m)); // => オブジェクト