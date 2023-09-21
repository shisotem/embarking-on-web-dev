const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // 同じメールアドレスを持つユーザーが複数存在しない
    }
});

// passportLocalMongooseの機能がuserSchemaに組み込まれる
// - username/hash/saltのフィールドが自動でuserSchemaに加えられる
// - 便利なメソッドも使えるようになる（User.authenticate(), User.serializeUser(), User.deserializeUser(), User.register()）
userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        UserExistsError: 'そのユーザ名はすでに使われています。', // en -> jp
        MissingPasswordError: 'パスワードを入力してください。',
        AttemptTooSoonError: 'アカウントがロックされています。時間をあけて再度試してください。',
        TooManyAttemptsError: 'ログインの失敗が続いたため、アカウントをロックしました。',
        NoSaltValueStoredError: '認証ができませんでした。',
        IncorrectPasswordError: 'パスワードまたはユーザ名が間違っています。',
        IncorrectUsernameError: 'パスワードまたはユーザ名が間違っています。',
    }
});

module.exports = mongoose.model('User', userSchema);