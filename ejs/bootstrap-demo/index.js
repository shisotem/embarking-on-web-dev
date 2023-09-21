const path = require('path');
const express = require('express');
const app = express();

const redditData = require('./data.json');

app.use(express.static(path.join(__dirname, 'public')));
// public
//   /css
//     /bootstrap.min.css
//   /js
//     /bootstrap.min.js

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    const data = redditData[subreddit];
    if (data) {
        res.render('subreddit', { ...data });
    } else {
        res.render('notfound', { subreddit });
    }
});

app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1;
    res.render('random', { num });
});

app.get('/dogs', (req, res) => {
    const dogs = ['lucia', 'pochi', 'innu', 'girolamo', 'chiaki'];
    res.render('dogs', { dogs });
});

app.listen(3000, () => {
    console.log('Server started. Waiting for a request at port 3000');
});