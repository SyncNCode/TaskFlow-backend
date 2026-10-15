const express = require('express')
const { userSignup, userLogin } = require('../controller/userController')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

router.post('/signup',userSignup)
router.post('/login',userLogin)

module.exports = router