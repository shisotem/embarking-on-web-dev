const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/authDemo',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('MongoDB connection ok!');
    })
    .catch(err => {
        console.log('MongoDB connection err!');
        console.log(err);
    });

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'mysecret' }));

// 注: sid（署名付きクッキー）によってsessionを指定している -> login状態が保たれるのはChromeでだけ
// -> safariでアクセスしてもsidが異なる -> safariのsidで指定されるsessionにはuser_idプロパティがない！（Chromeでsidを削除->新規sidを取得しても同様）
// 注: sessionの保存先にMemoryStoreを使っている場合、node再起動（nodemon起動中の編集）をするとsessionが揮発する！
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
};

app.get('/', (req, res) => {
    res.send('ホームページ');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// ログイン・ユーザ登録 => GETは避ける（クエリストリングでPWがまる見え）
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // const hash = await bcrypt.hash(password, 12);
    // * ベストプラクティスの1つ: ルートハンドラではなるべくロジックを書かないようにする
    // -> 上のハッシュ化をMongooseのミドルウェアに任せる（save()前に自動でハッシュ化を行うようにする）cf. models/user.js

    const user = new User({
        username,
        // password: hash
        password
    });
    await user.save();
    // 登録と同時にlogin状態を保つようにする
    // req.session.isLoggedIn = true; でも勿論いいが、user._idを保持しておくと「誰なのか？」がわかるので、
    // 次のリクエストが来たときに、user_idを使ってDBからその人の情報を引っ張ってくることが出来る！
    req.session.user_id = user._id; // ログイン状態（+ 誰なのか？）
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // const user = await User.findOne({ username });
    // const validPassword = await bcrypt.compare(password, user.password);
    // * ベストプラクティスの1つ: ルートハンドラではなるべくロジックを書かないようにする
    // -> ここでは、上のロジックをモデル側に移す（Userモデルのスタティックメソッド作成）cf. models/user.js
    const foundUser = await User.findAndValidate(username, password);

    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    } else {
        res.redirect('/login');
    }
});

app.post('/logout', (req, res) => {
    // req.session.user_id = null;
    req.session.destroy(); // session自体を破壊する（ブラウザ上のsidも新しいものに変わり、サーバ側でもそれと紐づく新たなsessionが用意される）
    res.redirect('/login');
});

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret');
});
app.get('/topsecret', requireLogin, (req, res) => {
    res.send('<h1>㊙</h1>');
});

app.listen(3000, () => {
    console.log('Server started. Waiting for a request at port 3000');
});