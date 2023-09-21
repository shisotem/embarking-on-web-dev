// 殆どのルートハンドラはasync => try-catch(e), next(e)を毎回書くのは大変 => utility関数
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./app-error');

const Product = require('./models/product');
const { wrap } = require('module');

mongoose.connect('mongodb://localhost:27017/farmStand2', { useNewUrlParser: true, useUnifiedTopology: true })
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

const categories = ['果物', '野菜', '乳製品'];

// fn: asyncな関数
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    };
}

// Index
app.get('/products', wrapAsync(async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: '全' });
    }
}));
// New
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
});
// Create
app.post('/products', wrapAsync(async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
}));

// Show
app.get('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('商品が見つかりません', 404);
    }
    res.render('products/show', { product });
}));
// ↓ i.e.
// app.get('/products/:id', function (req, res, next) {
//     fn(req, res, next).catch(e => next(e)); // asyncな関数を実行 + Promiseが返るので、then-catchによりerrを捕捉し、next(err)
// });

// cf. async function -> 必ずPromiseを返す!
// - 関数が値を返す場合: Promiseはその値でresolveする
// - 関数がエラーをthrowする場合: Promiseはそのエラーでrejectする

// cf. 関数に余分な引数を渡した場合（next）、それは無視される

// Edit
app.get('/products/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('商品が見つかりません', 404);
    }
    res.render('products/edit', { product, categories });
}));
// Update
app.put('/products/:id', wrapAsync(async (req, res) => {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        res.redirect(`/products/${product._id}`);
}));
// Destroy
app.delete('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
}));

// エラーの種類による処理の分岐（Mongooseを例にとって）
const handleValidationErr = err => {
    console.log(err);
    // return err;
    return new AppError(`入力内容に誤りがあります...${err.message}`, 400);
};
app.use((err, req, res, next) => {
    console.log(err.name); // mongooseの場合、nameプロパティでエラーの種類がわかる（e.g. ValidationError, CastError）=> 処理の分岐！
    if (err.name === 'ValidationError') {
        err = handleValidationErr(err);
    }
    next(err);
});

app.use((err, req, res, next) => {
    const { status = 500, message = '問題が発生しました' } = err;
    res.status(status).send(message);
});

app.listen(3000, () => {
    console.log('Server started. Waiting for a request at port 3000');
});