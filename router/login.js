const express = require('express')
const router = express.Router()

const loginhandler = require('../router_handle/login')

router.post('/register', loginhandler.register)
router.post('/login', loginhandler.login)

module.exports = router