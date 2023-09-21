const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'usernameは必須です']
    },
    password: {
        type: String,
        required: [true, 'passwordは必須です']
    },
});

userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username }); // <- User.findOne() <- User.findAndValidate()
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
};

// await user.save(); -> this は user
userSchema.pre('save', async function (next) {
    // ユーザ登録に関係ない場面で使われたsave()では、処理をskipする必要がある -> user.passwordが編集されたときだけ処理へ
    if (!this.isModified('password')) return next();
    // 処理
    this.password = await bcrypt.hash(this.password, 12); // <- user.password
    next();
});

module.exports = mongoose.model('User', userSchema);