// NODE_ENV: Node.jsの動作環境（e.g. 'production'）を入れるのによく使われる
// Node.jsがもし本番環境で動いてない（開発モード）なら.envファイルから環境変数を取得
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/express-error');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

// セッションストア（デフォルト: MemoryStore）に今回はMongoDBを使う（本来はDBはMongoDB、セッションストアはRedisなど、別でも良い）
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('MongoDB connection ok!');
    })
    .catch(err => {
        console.log('MongoDB connection err!');
        console.log(err);
    });

const app = express();

app.engine('ejs', ejsMate); // ejsを解釈するときに、デフォルトのエンジンではなく、ejs-mate（layout機能が含まれる）を使用するよう指定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // 静的ファイルを提供
app.use(mongoSanitize({ // MongoDBインジェクション（e.g. db.users.find({ username: { "$gt": "" } })）への対策
    replaceWith: '_' // $などを_に置換してしまう
}));

const secret = process.env.SECRET || 'mysecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret
    },
    // ムダを減らすため、セッションの内容が変わっていなければこの期間は一々MongoDBをセーブしない（ユーザがページを読み込む度にセッションの中身は変わっていないのにセーブすることをやめる）
    // 勿論、セッションの中身に変更があれば都度セーブする
    touchAfter: 24 * 360
});
// storeにエラーを監視できるイベントが用意されている
store.on('error', e => {
    console.log('セッションストアエラー', e);
});

const sessionConfig = {
    store,
    name: 'session', // connect.sidを改名するのは良い習慣（passportを使ってるんだろうなとバレにくくなる -> passportに重大なバグが見つかったとき少しはまし）
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // session関連のcookieがhttp経由でしかアクセス不可 -> クライアントサイドのjsからはcookieにアクセス不可 -> cookieを盗めないように（デフォルトでtrueだが明示した）
        // secure: true, // より安全なhttps通信でしかcookieのやり取りをしない様になる（現在、http://localhost:3000 なのでセッション周りが動作しなくなってしまう）
        maxAge: 1000 * 60 * 60 * 24 * 7, // cookieの有効期限
    }
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session()); // express-session()を事前に実行しておく必要がある
passport.use(new LocalStrategy(User.authenticate())); // passportに対しLocalStrategyというログイン方法を使うと伝える ／ どういう風に認証するか？ -> User.authenticate()
passport.serializeUser(User.serializeUser()); // ユーザの情報をsessionの中にどうやって詰め込むか？ -> User.serializeUser()
passport.deserializeUser(User.deserializeUser()); // 反対に、sessionに入っている情報からユーザをどうやって作るか？ -> User.deserializeUser()

app.use(flash());

// helmet:（レスポンスとしてクライアントに渡る）HTTP headerに、セキュリティを強化してくれる項目を追加してくれる
// 11個のミドルウェア（app.use(helmet.contentSecurityPolicy()); 含む）を纏めて有効化
app.use(helmet());
// CSP:（自分のサービスからアクセスする外部のサイトを最小限に抑えることで、）XSSを防ぐのを助けてくれる仕組みの1つ
// 色々なコンテンツの取得先を制御する（e.g fontはgoogle-fontからのみ/画像はunsplash&cloudinaryからのみ/jsは特定のCDNからのみ）
// -- CSPに許可する取得先の追加 --
const scriptSrcUrls = [
    'https://api.mapbox.com',
    'https://cdn.jsdelivr.net'
];
const styleSrcUrls = [
    'https://api.mapbox.com',
    'https://cdn.jsdelivr.net'
];
const connectSrcUrls = [
    'https://api.mapbox.com',
    'https://*.tiles.mapbox.com',
    'https://events.mapbox.com'
];
const fontSrcUrls = [];
const imgSrcUrls = [
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, // 特定のURL以降を許可 -> / を忘れない
    'https://images.unsplash.com'
];
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["blob:"],
        objectSrc: [],
        imgSrc: ["'self'", 'blob:', 'data:', ...imgSrcUrls],
        fontSrc: ["'self'", ...fontSrcUrls]
    }
}));

app.use((req, res, next) => {
    // req.user: passportが用意してくれるログイン中ユーザの情報（session内の情報をdeserializeした、ユーザの情報が入ったオブジェクト）
    // -> { _id: 6506afe7460b73a02909b7a5, email: 'hoge@ex.com', username: 'hoge', __v: 0 }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
// デフォルトでは:idがrouterに渡らない -> req.params.idとして取得できない => { mergeParams: true }が必要！ cf. routes/reviews.js

// 存在しないパスへのアクセス（任意のメソッド（all）の任意のパス（*）=> app.use()と同じ振舞い！）
app.all('*', (req, res, next) => {
    next(new ExpressError('ページが見つかりませんでした', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = '問題が起きました'; // default value
    }
    res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`YelpCamp listening on port ${port}`);
});