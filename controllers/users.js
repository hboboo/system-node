const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../config/env')

// 注册
const register = async (req, res) => {
  try {
    const { account, password } = req.body;
    // 输入验证
    if (!account || !password) {
      return res.status(400).json({ message: '请提供账号、密码' });
    }
    
    // 检查用户是否存在
    const [existingUsers] = await db.query('SELECT * FROM users WHERE account = ?', [account]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: '用户名账号已存在' });
    }
    
    // 密码加密
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    // 插入用户
    const [insertResult] = await db.query('INSERT INTO users SET ?', {
      account: account,
      password: hashedPassword,
      identity: '用户',
      create_time: new Date(),
      status: 0,
    });
    
    // 判断插入是否成功
    if (insertResult.affectedRows > 0) {
      res.status(201).json({ message: '用户注册成功' });
    } else {
      res.status(500).json({ message: '插入数据失败，服务器错误' });
    }
  } catch (error) {
    console.error('注册错误', error);
    res.status(500).json({
      message: '服务器错误',
      error: error.message
    });
  }
};



// 登录
const login = async (req, res) => {
  try {
    const { account, password } = req.body;
    
    // 判断账号是否存在
    const [users] = await db.query('SELECT * FROM users WHERE account = ?', [account]);
 
    if (users.length !== 1) {
      return res.status(404).json({ message: '账号不存在' });
    }

    const user = users[0];

    // 校验密码
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: '密码错误' });
    }

    if (user.status === 1) {
      return res.status(403).json({ message: '账号已冻结' });
    }

    const token = jwt.sign(
      {
        account: account,
        userId: user.id
      },
      SECRET_KEY,
      {
        expiresIn: '24h'
      }
    );

    return res.status(200).json({
      message: '登录成功',
      token: token
    });
  } catch(error) {
    console.error('登录错误', error);
    return res.status(500).json({ message: '服务器错误' });
  }
};


module.exports = {
  register,
  login,
}