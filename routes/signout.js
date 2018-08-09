const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 退出
router.get('/', checkLogin, function (req, res, next) {
    res.send('退出')
})

module.exports = router