// クッキーでクライアントサイドにデータを保存 -> 容量も多くない・安全でもない...
// => サーバ側のデータストア（セッション）にデータを保存し、ブラウザにセッションを識別するためのクッキーを送信する -> サーバ側のセッションのデータが取得できる
// データストアはデフォルトではExpressアプリ内のMemoryStore（開発中はこれでいいが本番ではダメ／サーバを止めるとセッションが初期化されてしまう）-> 本番では、RedisやMongoDBなどを使う（永続）
// セッションでは重要な情報は保持しない（消えても平気なログインなどの情報を保持させる）: 例えばユーザがクッキーを消去すると、紐づくセッションが識別できなくなってしまうが、その場合は仕方がないので再度ログインを促す
// 尚、セッションもクッキー同様、HTTPをステートフルにする目的
const express = require('express');
const app = express();
const session = require('express-session');

// 設定
// - これにより全てのルーティングにreq.sessionが用意される（この容れ物をセッションとして扱う！）
// - 自動でセッション識別用の署名付きクッキーを送信（res.cookie('connect.sid', '~~~', { signed: true })）し、ブラウザに保存させる（connect.sid: s%3AWzWe2LVJJwuTVtMkn-jBEvdI1LeclZ1c.ZZJQ1%2FdR02%2BAEkBt8feC7fZvq1p6TxLgHtz2fO4qPGE）
//   -> リクエストが投げられると、サーバはクッキーが改ざんされていないかを確認する -> 平気ならクッキー（sid）に紐づいたsessionをサーバーサイドで使える！
const sessionOptions = {
    secret: 'mysecret', // べた書きではなく環境変数を使う方法は後述
    resave: false,
    saveUninitialized: false
};
app.use(session(sessionOptions));

app.get('/viewcount', (req, res) => {
    // req.session（空のオブジェクト）にcountプロパティを追加
    if (req.session.count) {
        req.session.count += 1;
    } else {
        req.session.count = 1;
    }
    res.send(`あなたは${req.session.count}回このページ（/viewcount）を表示しました`);
});

app.get('/register', (req, res) => {
    const { username = 'Anonymous' } = req.query;
    req.session.username = username;
    res.redirect('/greet');
});
app.get('/greet', (req, res) => {
    const { username } = req.session;
    res.send(`ようこそ！${username}さん`);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});