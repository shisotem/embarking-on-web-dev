const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true }) // => Promise
    .then(() => {
        console.log('MongoDB connection ok!');
    })
    .catch(err => {
        console.log('MongoDB connection err!');
        console.log(err);
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Formのリクエストが来たら、パースしてreq.bodyに入れてね！
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const categories = ['果物', '野菜', '乳製品'];

// Index
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category }); // { category: category }
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: '全' });
    }
});

// New（注意: ルーティングは"上から判定されていく"ので、NewをShowの後ろに書くと:idが'new'だと判定され、Newのルーティングが妨害される！）
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
});
// Create
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    // res.sendなどとするとそのページを再読込する毎にPOSTが何度も投げられてしまう -> redirectで防止
    res.redirect(`/products/${newProduct._id}`);
});

// Show
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    // Product.findOne({_id: id});
    const product = await Product.findById(id);
    res.render('products/show', { product });
});

// Edit
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
});
// Update（PATCHでも良さそうだがまるっと入れ替えてるのと同じような感じなので今回はPUTで）
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    // findById(id)で取ってきてプロパティに代入してsave()する方法もOK！
    // MongooseのUpdateはValidationに注意！ // { new: true } -> 更新"後"が返る
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    // res.sendなどとするとそのページを再読込する毎にPUTが何度も投げられてしまう -> redirectで防止
    res.redirect(`/products/${product._id}`); // MongoDBから返ってきた確実なid（product._id）を使った方がベター
});

// Destroy
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
});

app.listen(3000, () => {
    console.log('Server started. Waiting for a request at port 3000');
});

// ** +ALPHA（カテゴリで絞り込み）**

// [routing案: 1] /categories/果物 <- 今回のWebAppではカテゴリというリソースを明示的には用意していない／カテゴリ（e.g. 果物）が主のWebAppという印象が強くなる（今回のWebAppは商品（e.g. コーヒー牛乳）一覧を主としている）
// [routing案: 2] /products?category=果物 <- 絞り込みにはよくqueryStringが使われる／主となるのは商品一覧であってそれをカテゴリを使って絞り込むという位置づけに出来る
// => [2]を採用！

// 実装はIndexを参照