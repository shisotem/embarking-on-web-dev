const express = require('express');
const app = express();
// console.dir(app); // appオブジェクトがexpressそのもの！

// // （pathに依らず）あらゆるリクエストの度にコールバックが呼ばれる / req, resオブジェクトが使用可
// app.use((req, res) => {
//     console.log('Accepted a request');
//     // console.dir(req); // リクエスト情報の巨大なオブジェクト
//     res.send('Return a response');
//     // res.send({ color: 'red' });
//     // res.send('<h1>Hello world</h1>');
// });

// routing（上から見ていく）
app.get('/cats', (req, res) => {
    res.send('get meow!');
});
app.post('/cats', (req, res) => {
    res.send('post meow!');
});
app.get('/dogs', (req, res) => {
    res.send('get woof!');
});
app.get('/', (req, res) => {
    res.send('get root!');
});
// /r/{{something}}（-> path parameter）
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    res.send(`<h1>get /r/${subreddit}</h1>`);
});
app.get('/r/:subreddit/:postId', (req, res) => {
    const { subreddit, postId } = req.params;
    res.send(`<h1>get /r/${subreddit}/${postId}</h1>`);
});
// query string
app.get('/search', (req, res) => {
    const { q } = req.query;
    if (!q) {
        res.send('Give me a query string!');
    } else {
        res.send(`<h1>Search results for "${q}"</h1>`);
    }
});
// 「getの」ワイルドカード
app.get('*', (req, res) => {
    res.send('get unknown!!!');
});

app.listen(8080, () => {
    console.log('Server started. Waiting for a request at port 8080');
});