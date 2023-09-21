const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('./models/product');
const Farm = require('./models/farm');

const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = { secret: 'mysecret', resave: false, saveUninitialized: false };
app.use(session(sessionOptions));
app.use(flash()); // -> 全てのreqでreq.flash()が使えるようになる

mongoose.connect('mongodb://localhost:27017/flashDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connection ok!');
    })
    .catch(err => {
        console.log('MongoDB connection err!');
        console.log(err);
    });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// flashを使う度に{ messages: req.flash('success') }などと書くのは大変 -> ミドルウェアを作成
app.use((req, res, next) => {
    // res.locals:「ライフサイクル（リク～レス）の間だけ」情報を保存しておける場所をExpressが提供してくれている
    // -> res.localsに保存した情報は、view(s)配下内から簡単にアクセス出来る！ cf. views/farms/index.ejs
    res.locals.messages = req.flash('success'); // messagesプロパティを追加（res.localsは容れ物なので自由に使ってよい）
    next();
});

const categories = ['果物', '野菜', '乳製品'];

// Farm関連
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });

    // フラッシュの'success'に何かメッセージが入っていれば、それをmessagesという変数に束縛
    // res.render('farms/index', { farms, messages: req.flash('success') });
    // -> 一回使用するとセッションからそのフラッシュの情報は消える
});
app.get('/farms/new', (req, res) => {
    res.render('farms/new');
});
app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    // （redirectの直前で）flashを作成（セッションにflashの情報を保存・セットする）
    req.flash('success', '新しい農場を登録しました'); // (キー, メッセージ)
    res.redirect('/farms');
});





app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('products');
    res.render('farms/show', { farm });
});
app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', { categories, farm });
});
app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category });
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${farm._id}`);
});
app.delete('/farms/:id', async (req, res) => {
    await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms');
});
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: '全' });
    }
});
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
});
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
});
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('farm', 'name');
    res.render('products/show', { product });
});
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
});
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
});
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
});
app.listen(3000, () => {
    console.log('Server started. Waiting for a request at port 3000');
});