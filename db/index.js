const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host     : 'localhost',
  user     : 'back-system',
  password : '123456',
  database : 'back-system'
})

// 添加数据库连接测试
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('数据库连接成功!');
    connection.release();
  } catch (err) {
    console.error('数据库连接失败:', err.message);
  }
}

// 执行连接测试
testConnection();




module.exports = db