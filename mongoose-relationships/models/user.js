const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relationshipDemo',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('MongoDB connection ok!');
    })
    .catch(err => {
        console.log('MongoDB connection err!');
        console.log(err);
    });

// Point:
// * one to one
// * many to many（テーブル同士の関連づけ専用のテーブルを用意する）
// * one to many（この場合に絞って以降扱っていく）
//   - 1対数個(one to few): user.js -> ドキュメントにデータをまるごと入れてしまう
//   - 1対たくさん: farm.js -> データを別のコレクションに保存し、ドキュメントIDへの参照を親のどこかに保存する
//   - 1対超たくさん: tweet.js -> 数千以上のドキュメントでは、親への参照を子のドキュメントに保存する方が効果的

const userSchema = new mongoose.Schema({
    first: String,
    second: String,
    addresses: [{
        _id: { id: false }, // デフォルトでは、ネストした{}毎に_idが生成される（Mongooseの性質）
        country: String,
        prefecture: String,
        address1: String,
        address2: String,
    }]
});

const User = mongoose.model('User', userSchema);

const makeUser = async () => {
    const u = new User({
        first: '太郎',
        second: '山田'
    });

    u.addresses.push({
        country: '日本',
        prefecture: '北海道',
        address1: '札幌市',
        address2: '0丁目0番地'
    });

    const res = await u.save();
    console.log(res);
};

const addAddress = async (id) => {
    const user = await User.findById(id);
    user.addresses.push({
        country: '日本',
        prefecture: '青森県',
        address1: '青森市',
        address2: '0丁目0番地'
    });
    const res = await user.save();
    console.log(res);
};

// makeUser();
addAddress('64feb374227c31338c2c8e14');



// スキーマ設計の指針（注: 絶対的・普遍的に正しい設計は存在しないため、あくまで指針）
// 1. 埋め込みをしてはいけない理由がない限り、埋め込みを推奨する
// 2. 子ドキュメントに単独でアクセスする必要があれば、埋め込みをしない理由になり得る
// 3. 1対100~: 親に子への参照Idをもたせる VS. 1対1000~: 子に親への参照Idをもたせる
// 4. 省略
// 5. 殆ど書き込まれず、頻繁に読み込まれるデータ => 重複して複数箇所で（冗長に）保持することを検討（非正規化）
//    { id: ObjectID('AAAA'), name: 'hoge' } -> nameはidの参照先からも読み込めるが、一々参照せずとも読み込めるよう、冗長にもたせる場合がある（データの読み・書きの比率に基づいて判断）
// 6. アプリケーション（のデータの照会・更新方法）によって、ベターな設計は異なる