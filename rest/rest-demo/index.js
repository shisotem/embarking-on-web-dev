const path = require('path');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
// - 変数名をv4 -> uuidに変更（分割代入）
// e.g. const obj = { a: 1, b: 2 };
//      const { a: a1, b: b1 } = obj;
const { v4: uuid } = require('uuid');

// （コールバック: ミドルウェア）
// postで送られてくるデータには種類がある（form, json, html, binary, GraphQL, ...）
// -> サーバ側は、対応した方法で（JSオブジェクトに）パースして受け取る必要がある！
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded（つまりフォーム）
// app.use(express.json()); // for parsing application/json
app.use(methodOverride('_method')); // queryStringのkeyを設定

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// dummy data（DB の代わり）
let comments = [
    {
        id: uuid(),
        username: 'yamada',
        comment: 'fun!'
    },
    {
        id: uuid(),
        username: 'suzuki',
        comment: 'I like birds!'
    },
    {
        id: uuid(),
        username: 'tanaka',
        comment: '???'
    },
    {
        id: uuid(),
        username: 'dog',
        comment: 'wan!wan!'
    }
];

// >>> RESTful CRUD >>>

// {name}  {path}             {method} {usage}
// Index   /comments          GET      一覧
// 
// New     /comments/new      GET      作成フォーム（注: formを使わず、JSONならNewは不要）
// Create  /comments          POST     サーバ側で作成
// 
// Show    /comments/:id      GET      表示（詳細ページ）
// 
// Edit    /comments/:id/edit GET      編集フォーム（注: formを使わず、JSONならEditは不要）
// Update  /comments/:id      PATCH    サーバ側で更新
// 
// Destroy /comments/:id      DELETE   サーバ側で削除

app.get('/comments', (req, res) => {
    res.render('comments/index', { comments }); // views/comments/index.ejs を渡す
});

app.get('/comments/new', (req, res) => {
    res.render('comments/new');
});
app.post('/comments', (req, res) => { // /comments(POST)されたときに...
    const { username, comment } = req.body;
    comments.push({ username, comment, id: uuid() }); // { username: username, comment: comment }
    res.redirect('/comments'); // /comments(GET)に飛ばす！(redirect -> StatusCode: 302)
});

app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id); // filter（配列を返す）と違い、発見時点で1つ要素を返す
    res.render('comments/show', { comment });
});

app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id); // 変更前の内容をformに入れておくため
    res.render('comments/edit', { comment });
});
// PATCH: 部分的な更新（commentのみ）VS. PUT: リソース全体を丸々更新（id, usernameごと置換）
app.patch('/comments/:id', (req, res) => {
    const { id } = req.params;
    const newCommentText = req.body.comment;
    const foundComment = comments.find(c => c.id === id);
    foundComment.comment = newCommentText;
    res.redirect('/comments');
});

app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');
});

// <<< RESTful CRUD <<<

app.listen(3000, () => {
    console.log('Server started. Waiting for a request at port 3000');
});

// app.get('/tacos', (req, res) => {
//     res.send('get /tacos response');
// });
// app.post('/tacos', (req, res) => {
//     const { meat, qty } = req.body; // request body（上記のパースをしないとundefinedが返る）　
//     res.send(`post /tacos response (${meat}, ${qty})`);
// });