const express = require('express')
const userRoute = require('./users-router')

const router = express.Router()

const defaultRoutes = [
  {
    path: '/users',
    route: userRoute
  }
]

// 注册默认路由
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;