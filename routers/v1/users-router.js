const express = require('express')
const router = express.Router()
const {userController} = require('../../controllers/index')

router
  .route('/register')
  .post(userController.register)

  

module.exports = router