const db = require('../db/index')
const bcrypt = require('bcrypt')

//注册
exports.register = (req, res) => {
  const reginfo = req.body
  //判断输入是否为空，虽然我认为在前端做更合适。
  if(!reginfo.account || !reginfo.password) {
    return res.send({
      statusl: 1,
      message: '账号或者密码不能为空'
    })
  }
  //查询账号是否已经存在
  const sql = 'select * from users where account = ?'
  db.query(sql, reginfo.account, (err, results) => {
    if(results.length > 0) {
      return res.send({
        statusl: 1,
        message: '账号已存在'
      })
    }
  })
  //加密密码
  reginfo.password = bcrypt.hashSync(reginfo.password, 10)
  const sql1 = 'insert into users set ?'
  const indentity = '用户'
  const create_time  = new Date()
  db.query(sql1, {
    account: reginfo.account,  //账号
    password: reginfo.password,  //密码
    indentity,  //身份
    create_time, //账号创建时间
    status: 0,  //冻结状态，初始为0
  }, (err, results) => {
    if(results.affectedRows !== 1) {
      return res.send({
        statusl: 1,
        message: '账号注册失败'
      })
    }
    res.send({
      statusl: 1,
      message: '账号注册成功'
    })
  })
}

exports.login = (req, res) => {
  res.send('登录')
}