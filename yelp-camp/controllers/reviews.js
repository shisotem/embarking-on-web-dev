const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'レビューを登録しました');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    // idのcampgroundのreviews配列からreviewIdをpullした上でUpdateする
    // -> これにより、campground.reviews配列に消去するレビューのObjectIdが残らないようにする（参照の削除）
    // -> 当該操作のために、このルーティングパスには:reviewIdのみならず:idを含める必要があった
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId); // レビュー自体の削除
    req.flash('success', 'レビューを削除しました');
    res.redirect(`/campgrounds/${id}`);
};

