const express = require('express')
const routes = require('./routers/v1/index')
const app = express()
const port = 3000

//跨域中间件
const cors = require('cors')
app.use(cors())

//解析表单中间件
let bodyParser = require('body-parser')
// 为false时不能给嵌套对象正常解析
app.use(bodyParser.urlencoded({ extended: false }))

// 把json转变成js对象
app.use(bodyParser.json())

app.use('/v1', routes)

app.listen(port, () => {
  console.log(`已连接 ${port}`)
})