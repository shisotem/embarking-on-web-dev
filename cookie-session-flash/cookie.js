// cookie:（特定のウェブサイト閲覧時に）ユーザのリクエストに対して、サーバから渡すことのできる、ブラウザに保存される小容量な情報
// - 一度クッキーが保存されると、そのサイト内での次回以降のリクエストでは、ブラウザは保存されたクッキーを必ず（サーバに）送信する
// - クッキーにより、HTTPをステートフルにする（状態をもたせる）ことが可能
// - タブやChromeを終了させてもクッキーはChromeに残る（当然ブラウザのクッキー消去操作をしたら消える）
// - cookieの用途
//   1. セッション管理（ログイン、ショッピングカート、ゲームスコア）-> session.js + flashで詳述
//   2. パーソナライゼーション（ユーザ設定、テーマ）-> 本セクション
//   3. トラッキング（ユーザの行動記録及び分析）

// 署名付き（signed）cookie: クッキーに署名を入れておくことで、クッキーの中身が"改ざん"されていないかをチェック（注: 中身を"隠す"ための技術ではない！）
// - ざっくりいうと、クッキーのValueに署名をつけて、少々ヘンテコな見た目になったものをレスポンスで渡す
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
// app.use(cookieParser());
// 次のように引数を与えることでcookie-parserは、クッキーに署名を付けてくれる
// 普通は（別の場所に保管して）隠しておく値であり、ソースコードに'mysecret'などと生では書かない
// この値を途中で変えると署名が変わってしまい、それまでに送ったクッキーは全て無効になる
app.use(cookieParser('mysecret'));

app.get('/greet', (req, res) => {
    const { name = 'anonymous' } = req.cookies;
    res.send(`ようこそ！${name}さん`);
});
app.get('/setname', (req, res) => {
    res.cookie('name', 'yamadataro'); // レスポンスを返しているわけではない（レスポンスのクッキーに引数内の情報（Name: Value）をセット）
    res.cookie('animal', 'cat');
    res.send('クッキー送ったよ！');
});

app.get('/getsignedcookie', (req, res) => {
    res.cookie('fruit', 'grape', { signed: true }); // 署名付きクッキー
    // devToolのApplicationでブラウザに保存されたクッキーを確認 => fruit: s%3Agrape.iAFRE8iCRHWXRV8ttPvGw91hOZJMYJ5lSGfOMSmBiYo（"."以降が署名）
    res.send('署名付きクッキー送ったよ！');
});
app.get('/verifyfruit', (req, res) => {
    // res.send(req.cookies); // => {"name":"yamadataro","animal":"cat"}
    res.send(req.signedCookies); // => {"fruit":"grape"}

    // devToolのApplicationで次のように改ざんしてから、このルーティングを用いてクッキーを確認すると...
    // ・fruit: s%3Aapple.iAFRE8iCRHWXRV8ttPvGw91hOZJMYJ5lSGfOMSmBiYo
    //   -> res.send(req.signedCookies); // => {"fruit":false}
    // ・fruit: eoifjaiefa
    //   -> res.send(req.signedCookies); // => {}
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

// cf. HMAC