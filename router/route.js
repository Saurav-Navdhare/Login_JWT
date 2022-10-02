const express = require('express');
const router = express.Router();
const {regenToken, loginUser, registerUser} = require('../controllers/dbOp');

router.route("/register")
    .post(registerUser);

router.route("/login")
    .post(loginUser);

router.route("/token")
    .post(regenToken);

module.exports = router;