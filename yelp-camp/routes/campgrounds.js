const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catch-async');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary'); // /index.js省略
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
    // .post(upload.array('image'), (req, res) => {
    //     console.log(req.body, req.files);
    //     // => campground: { // file以外は今まで通りreq.bodyに入る
    //     //     title: 'foo', location: 'foo city', price: '100', description: 'foo!'
    //     // }
    //     // => fileの情報が詰まったオブジェクトの配列: [{ fieldname: 'image', originalname: 'tent.jpg', encoding, mimetype, path: 'https://res.cloudinary.com/.../odin...cnj5.jpg', size, filename: 'yelp-camp/odin...cnj5' }, ...]
    //     res.send('受け付けました');
    // });

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;