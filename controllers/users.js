const db = require('../db/index')
const bcrypt = require('bcryptjs')


const register = async(req, res) => {
  try {
    const {account, password} = req.body

    //输入验证
    if (!account || !password) {
      return res.status(400).json({message:'请提供账号、密码'})
    }

    //检查用户是否存在
    const existingUser = await db.query('select * from users where account = ?', account)
    if(existingUser.length > 0) {
      return res.status(409).json({message: '用户名账号已存在'})
    }

    //密码加密
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = await bcrypt.hashSync(password, salt)

    //插入用户
    const insertResult = await db.query('insert into users set ?', {
      account: account,
      password: hashedPassword,
      indentity: '用户',
      create_time: new Date(),
      status: 0,
    })
    res.status(201).json({message: '用户注册成功'})
  } catch(error) {
    console.error('注册错误', error)
    res.status(500).json({
      message: '服务器错误',
      error: error.message
    })
  }
}


module.exports = {
  register
}