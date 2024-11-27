const mysql = require('mysql');

const db = mysql.createPool({
  host     : 'localhost',
  user     : 'back-system',
  password : '123456',
  database : 'back-system'
})

// 添加数据库连接测试
db.getConnection((err, connection) => {
  if (err) {
    console.error(' 数据库连接失败:', err.message);
  } else {
    console.log('数据库连接成功!');
    // 连接测试完成后立即释放连接
    connection.release();
  }
});

module.exports = db