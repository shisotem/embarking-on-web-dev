// - asyncでないミドルウェア関数 => エラーが生じた場合（うっかりでも、throwでも）、Expressではエラーハンドラが良しなにキャッチしてくれる！
// - asyncなミドルウェア関数 => エラーはnext()に渡さなければ、エラーハンドラへと処理が渡らない！
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./app-error');

const Product = require('./models/product');

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

// Index
app.get('/products', async (req, res, next) => {
    try {
        const { category } = req.query;
        if (category) {
            const products = await Product.find({ category });
            res.render('products/index', { products, category });
        } else {
            const products = await Product.find({});
            res.render('products/index', { products, category: '全' });
        }   
    } catch (e) {
        next(e);
    }
});
// New
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
});
// Create（mongooseのvalid違反によるエラー（e.g. 商品名が未設定のまま登録）には、try-catch(e)を使う）
app.post('/products', async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save(); // => 生じたerrorはキャッチしてnext()に渡す！
        res.redirect(`/products/${newProduct._id}`);   
    } catch (e) {
        next(e);
    }
});
// Show（Point:「非同期関数から返されたエラー」については、それらをnext()関数に渡す必要がある！ <- Expressというフレームワークの性質なので従う以外ない）
app.get('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            // throw new AppError('商品が見つかりません', 404); //（ここはasyncな関数内部なので、）AppErrorはちゃんとthrowされるが、「エラーハンドラへと処理が渡らない！」
            // return next(new AppError('商品が見つかりません', 404)); // 復習: next()に引数を渡した場合（e.g. err）=> err処理用のミドルウェアへ
            throw new AppError('商品が見つかりません', 404); // Refactor: catch(e)されてnext(e)として渡るので、ここはthrowでOK！
        }
        res.render('products/show', { product }); // productがnullの場合は実行されないように、next()をreturnしている！
    } catch (e) {
        next(e);
    }
    // 「productがnullの場合の、null.nameへのアクセスエラー」の他にも、
    // 「await Product.findById(id)の部分で生じる（mongoose側の）エラー」に対処するため、try-catch(e)も行う！
});
// Edit
app.get('/products/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            throw new AppError('商品が見つかりません', 404);
        }
        res.render('products/edit', { product, categories });   
    } catch (e) {
        next(e);
    }
});
// Update
app.put('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        res.redirect(`/products/${product._id}`);
    } catch (e) {
        next(e);
    }
});
// Destroy
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
});

//（カスタム）エラーハンドラ
app.use((err, req, res, next) => {
    const { status = 500, message = '問題が発生しました' } = err;
    res.status(status).send(message);
});

app.listen(3000, () => {
    console.log('Server started. Waiting for a request at port 3000');
});