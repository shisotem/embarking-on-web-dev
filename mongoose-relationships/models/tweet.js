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

// 親
const userSchema = new Schema({
    username: String,
    age: Number,
});

// 子
const tweetSchema = new Schema({
    text: String,
    likes: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

const makeTweet = () => {
    const user = new User({ username: 'yamada99', age: 61 });
    const tweet1 = new Tweet({ text: '今日は晴れてて気持ちがいい', likes: 0 });
    // userをまるごと保存しているように見えるが、tweetSchemaの型定義により、ObjectIDだけが保存される
    tweet1.user = user;
    // セーブ後にconsole.log()などの処理がないのでawaitをさぼっている？
    user.save();
    tweet1.save();
};

// makeTweet();

const addTweet = async () => {
    const user = await User.findOne({ username: 'yamada99' });
    const tweet2 = new Tweet({ text: '今日は曇っていて涼しい', likes: 100 });
    tweet2.user = user;
    tweet2.save();
};

// addTweet();

const findTweet = async () => {
    // const t = await Tweet.findOne({});
    // console.log(t);
    // ↓（Mongooseでは...）
    // {
    //   _id: 64feef629b6242ee48386c6c,
    //   text: '今日は晴れてて気持ちがいい',
    //   likes: 0,
    //   user: 64feef629b6242ee48386c6b,
    //   __v: 0
    // }

    // const t = await Tweet.findOne({}).populate('user');
    // console.log(t);
    // ↓（Mongooseでは...）
    // {
    //   _id: 64feef629b6242ee48386c6c,
    //   text: '今日は晴れてて気持ちがいい',
    //   likes: 0,
    //   user: {
    //     _id: 64feef629b6242ee48386c6b,
    //     username: 'yamada99',
    //     age: 61,
    //     __v: 0
    //   },
    //   __v: 0
    // }

    const t = await Tweet.findOne({}).populate('user', 'username');
    console.log(t);
    // ↓（Mongooseでは...）
    // {
    //   _id: 64feef629b6242ee48386c6c,
    //   text: '今日は晴れてて気持ちがいい',
    //   likes: 0,
    //   user: { _id: 64feef629b6242ee48386c6b, username: 'yamada99' },
    //   __v: 0
    // }
};

findTweet();