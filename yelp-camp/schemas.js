const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// XSSに対して、JoiでHTMLのサニタイズ
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        // escapeHTML関数を追加
        escapeHTML: {
            validate(value, helpers) {
                // sanitizeHTML: 引数（value）に<script>...</script>などの危険なタグが渡ってきたとき、該当箇所のみを空文字列に変換
                const clean = sanitizeHtml(value, {
                    allowedTags: [], // h1など危険性の少ないタグすら許さない、
                    allowedAttributes: {}, // 一番厳しい設定にオプションで変更している
                });
                // もしvalueが消毒された結果変更があった場合、エラーを投げる
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML(),
    }).required()
});

// 飛んでくるPOSTリクエストの形式（cf. review[rating], review[body]）
// ↓
// review: {
//     rating: Number,
//     body: String
// }