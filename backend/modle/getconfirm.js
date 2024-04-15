const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

module.exports = function (db) {
  router.post('/', (req, res) => {
    console.log('POST received');
    const uid = req.body.uid; // 从请求正文中获取uid

    const sqlStr = 'SELECT * FROM user WHERE uid = ?';
    const query = db.format(sqlStr, uid); // 格式化查询字符串

    db.query(query, (err, results) => {
        if (err) { // 如果错误
          console.error('Database query failed: ', err.message); // 显示错误信息
          return res.status(500).send('Database query failed: ' + err.message); // 返回含有错误消息的响应
        }

        // 查询成功
        console.log('Database query succeeded');
        if (results.length > 0) { // 如果找到了用户
          return res.status(200).json({
            code: 200,
            data: results[0] // 返回查询到的用户信息
          }); 8.
          
        }

        // 用户未找到
        res.status(404).json({
          code: 404,
          message: 'User not found'
        });
    });
  });

  return router;
};