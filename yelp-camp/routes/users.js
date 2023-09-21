const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users')

router.route('/register')
    .get(users.renderRegister)
    .post(users.register);

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);
// passport.authenticate(): req.bodyのusername/password(->ハッシュ化)とDBを見比べて、認証してくれる！（内部的にreq.login()を実行）

router.get('/logout', users.logout);

module.exports = router;