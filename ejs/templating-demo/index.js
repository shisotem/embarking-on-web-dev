// Template (e.g. Embedded JS) => Dynamic HTML
const path = require('path'); // nodejs組み込みモジュール // **

const express = require('express');
const app = express();

// nodejsでのjsonの読み込み（JSON側でexportsなどしてないがこれでok!）
// require(): JSONファイルを読み込み、内部的にJSON.parse()を使用し、JSオブジェクトに変換
// -> redditDataは既にJSオブジェクト！
const redditData = require('./data.json');


// * app.use(express.static('public'));
//   上記では、viewsと全く同じ問題（.cwd()/public）があるので、次のように出来る
app.use(express.static(path.join(__dirname, 'public')));
// * express.static(): ミドルウェア
// * 静的ファイルの提供（serve, 公開）=> localhost:3000/app.css で公開されている
//   -> publicDirの中身がリクエスト度にサーバから提供される（リクエスト毎にコールバックを実行）
// * public (== rootDir)
//    /css
//    /js
//    /imgs etc.

// app.use(express.static('js'));
// app.use(express.static('css'));
// -> public1つに集約せず複数のdirにしてもよい


// __dirname: 実行中ファイル（index.js）が存在するdirへの絶対パス（nodejsのglobal変数）
app.set('views', path.join(__dirname, 'views')); // **
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home'); // .ejs 省略可能
    // default: process.cwd()/views/*.ejs を見に行く
    // (+α: どこでnode index.jsしても動作するための設定 -> **)
});

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    const data = redditData[subreddit];
    if (data) {
        res.render('subreddit', { ...data }); // objのspread構文
        // const obj = { a: 1, b: 2, c: "three" };
        // const objDup = { ...obj };
    } else {
        res.render('notfound', { subreddit });
    }
});

app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1;
    res.render('random', { num });
    // { num: num } の省略記法（変数名をrandとして渡したい場合{ rand: num }等でもok）
});

app.get('/dogs', (req, res) => {
    const dogs = ['lucia', 'pochi', 'innu', 'girolamo', 'chiaki'];
    res.render('dogs', { dogs });
});


app.listen(3000, () => {
    console.log('Server started. Waiting for a request at port 3000');
});