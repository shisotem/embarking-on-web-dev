const express = require('express');
const app = express();

const AppError = require('./app-error');

// 色々なErrがある（構文を守れていない、外部の要因（e.g. 期待していたデータが取得できない、MongoDBと接続できない、外部APIになぜかリクエストが届かない、ユーザの想定外の操作、MongooseのValidをパスできない））
app.get('/error', (req, res) => {
    hoge.moge(); // => レスポンス（＝エラーのHTML）が返る（エラーの種類、スタックトレース）

    // Expressデフォルトのエラー処理（ビルトインエラーハンドラ）: エラー処理ミドルウェア関数が、ミドルウェア関数スタックの最後に追加される => hoge.moge()のように意図せず生じたか、errをthrowしたかに依らず、これにキャッチされる
    // =>（ステータスコード500で、）レスポンス（＝エラーのHTML）が返る（エラーの種類、スタックトレース）
});

const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === 'asdf0123') {
        return next();
    }
    // res.send('password required');
    // throw new Error('password required');
    throw new AppError('password required', 401); // -> err.status === 401 --(Expressの仕様)--> res.statusCode === 401 
};

app.get('/secret', verifyPassword, (req, res) => {
    res.send('this is the secret page');
});

app.get('/admin', (req, res) => {
    throw new AppError('Only administrators have access.', 403);
});

// // custom error handler（最後に定義する）
// app.use((err, req, res, next) => {
//     // next(); // http://localhost:3000/secretで検索 => Cannot GET /secret （next()では次の"普通の"（!=エラー処理用の）ミドルウェアを呼び出す！）

//     console.log('\n* * * * * * * * * *');
//     console.log(err); // => （エラーの種類、スタックトレース、ステータスコード）
//     console.log('* * * * * * * * * *\n');

//     next(err); // => 次の"エラー処理用"のミドルウェアを呼び出す！
// });

app.use((err, req, res, next) => {
    const { status = 500, message = 'Some error occurred.' } = err;
    res.status(status).send(`[${status}] ERR!!! (${message})`); // .status(status) 不要なのでは...?
});

app.listen(3000, () => {
    console.log('YelpCamp listening on port 3000');
});