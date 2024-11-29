const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../config/env')

//注册
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

//登录
const login = async (req, res) => {
  try {
    const {account, password} = req.body
    //判断账号是否存在
    const users = await db.query('select * from users where account = ?', [account])
    if (users.length !==1 ) {
      return res.status(409).json({message: '账号不存在'})
    }
    // 校验密码
    const storedHashedPassword  = bcrypt.compareSync(password, users[0].password)
    const isPasswordCorrect = bcrypt.compareSync(password, storedHashedPassword)
    if (!isPasswordCorrect) {
      return res.status(409).json({message: '密码错误'})
    }
    if (users[0].status ==1 ) {
      return res.status(409).json({message: '账号已冻结'})
    }
    const token = jwt.sign(
      {
        userId: users[0].id,
        account: users[0].account,
      },
      SECRET_KEY,
      {
        expiresIn: '24h'
      }
    )
    return res.status(200).json({
      message: '登录成功',
      token: token
    })
  } catch(error) {
    console.error('登录错误', error)
    return res.status(500).json({message: '服务器错误'})
  }
}


module.exports = {
  register
}