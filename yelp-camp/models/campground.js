const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose; // ショトカ

const imageSchema = new Schema({
    url: String,
    filename: String
});
// https://res.cloudinary.com/dk72ybe53/image/upload/w_200/v1695032382/yelp-camp/xpwuybfbblowhnprfzm9.jpg
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: { // GeoJSON形式
        type: {
            type: String,
            enum: ['Point'], // 'Point'という値しか受け付けない
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    // properties: {
    //     popupMarkup: 
    // }
}, opts); // Mongooseはデフォルトでは、documentをJSONにするとき（JSON.stringify()）、その変換にvirtualを含めない cf. docs

campgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

// deleteOneやdeleteManyではトリガーされないので注意
campgroundSchema.post('findOneAndDelete', async function (doc) {
    // doc: 削除対象となったオブジェクト（削除されたcampground）が渡ってくる
    if (doc) {
        // 全レビューの内、レビューの_idがdoc.reviews配列に含まれるものを一括削除
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

module.exports = mongoose.model('Campground', campgroundSchema);