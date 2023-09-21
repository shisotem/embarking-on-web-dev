const express = require('express');
const app = express();
const morgan = require('morgan');

// ミドルウェア: ライフサイクル（リクエスト～レスポンス）の中で実行される「関数」
// - リクエスト／レスポンスオブジェクトにアクセス可能（変更も可能 e.g. urlencoded -> reqのbodyプロパティにパースした内容を詰め込む）
// * resオブジェクトを使ってライフサイクルの途中でレスポンスを返し、HTTPリクエスト（ライフサイクル）を終了させることが可能
// * next() -> 次のミドルウェアを呼び出すことも可能（次々と連鎖させることが可能）

// app.use(() => {
//     // このコールバックもミドルウェアといえる
//     // console.log('しかし、レスポンスを返していないし、次のミドルウェアも呼んでいない');
//     // console.log('=> リクエストが宙ぶらりんになって、グルグルし続けてしまう！ダメ！');
// });

// app.use(express.urlencoded());
//  ↓ urlencoded関数の返り値（評価後の値）は、ミドルウェア（つまり関数）であるため、urlencodedは高階関数といえる
// app.use(() => {}); // ミドルウェア内部でnext()もしている

// morganは最初に実行されているにも関わらず、最終行に表示される...？
// ->「レスポンスのタイミングでlogを出す」ように書かれているため
app.use(morgan('dev'));

// app.use((req, res, next) => {
//     console.log('first middleware')
//     return next(); // 次のミドルウェアを呼ぶ
//     console.log('first middleware (after next())') // 上の行が再帰的に終了した後、実行される（next()をreturnすることで、この行には到達しなくなる）
// });
// app.use((req, res, next) => {
//     console.log('second middleware')
//     return next(); // 次のミドルウェアを呼ぶ
// });
// app.use((req, res, next) => {
//     console.log('third middleware')
//     return next(); // 次のミドルウェアを呼ぶ
// });

app.use((req, res, next) => {
    req.requestTime = Date.now(); // デフォルトではreqに存在しないプロパティを作ることも出来る
    // req.method = 'GET'; // 汎ゆるリクエストがGETルートを通るようになる（疑似method-override）
    console.log(req.method, req.path); //（疑似morgan）
    next();
});

app.use('/dogs', (req, res, next) => {
    console.log('bow!bow!')
    next();
});

app.get('/', (req, res) => {
    console.log(`requestTime: ${req.requestTime}`)
    res.send('home');
});
app.get('/dogs', (req, res) => {
    console.log(`requestTime: ${req.requestTime}`)
    res.send('woof!');
});

// password demo
const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === 'asdf0123') {
        return next();
    }
    res.send('password required');
};
// verifyPasswordで特定のルートを守る（1つのルートに複数のハンドラーを設置する）
app.get('/secret', verifyPassword, (req, res) => {
    res.send('this is the secret page');
});

// elseやdefaultのような受け皿として
app.use((req, res) => {
    // status(): ステータスコードを200->404に指定変更出来る
    res.status(404).send('page not found');
});

app.listen(3000, () => {
    console.log('YelpCamp listening on port 3000');
});