const express = require('express')
const router = express.Router()
const {userController} = require('../../controllers/index')
const {vailidateLogin} = require('../../middlewares/validate')

router
  .route('/register')
  .post(vailidateLogin, userController.register)

router
  .route('/login')
  .post(vailidateLogin, userController.login)

module.exports = router