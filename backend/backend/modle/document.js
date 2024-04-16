const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const uuid = require('uuid');
const router = express.Router();
const fs=require('fs')
router.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = function (db) {

  router.post('/', upload.single('file'), (req, res) => {
    req.setEncoding('utf-8');
    console.log('File upload received');
    const uid = req.body.uid;
    const file = req.file;
    const original_name = Buffer.from(file.originalname, "latin1").toString("utf8");
    if (!file) {
      console.log('file empty')
      return res.status(400).json({
        code: 400,
        message: 'No file uploaded'
      });
    }

    const docId = uuid.v4(); // 生成uuid
    const uploadTime = new Date(); // 获取当前时间

    const sqlStr =
      'INSERT INTO docs (doc_id, user_id, file_name, file_path, file_type, file_size, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const query = db.format(sqlStr, [
      docId,
      uid,
      original_name,
      file.path,
      file.mimetype,
      file.size,
      uploadTime
    ]);
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database query failed: ', err.message);
        return res.status(500).send('Database query failed: ' + err.message);
      }

      console.log('Database query succeeded');
      return res.status(200).json({
        code: 200,
        data: {
          docId: docId // 返回新插入的文档的id
        }
      });
    });
  });

  router.get('/:uid', (req, res) => {
    const uid = req.params.uid;
    console.log("get data", uid)
    if (!uid) {
      return res.status(400).json({
        code: 400,
        message: 'No UID provided'
      });
    }

    const sqlStr = 'SELECT * FROM docs WHERE user_id = ?';
    const query = db.format(sqlStr, [uid]);

    db.query(query, (err, results) => {
      if (err) {
        console.error('Database query failed: ', err.message);
        return res.status(500).send('Database query failed: ' + err.message);
      }

      if (results.length === 0) {
        return res.status(200).json({
          code: 200,
          message: 'No documents found for the provided UID'
        });
      }
      console.log('get data', results)
      return res.status(200).json({
        code: 200,
        data: results
      });
    });
  });

  router.delete('/:docId', (req, res) => {
    const docId = req.params.docId;
    console.log("delete data", docId)
    if (!docId) {
      return res.status(400).json({
        code: 400,
        message: 'No document ID provided'
      });
    }

    // 先查询要删除的文件的路径
    const selectSqlStr = 'SELECT file_path FROM docs WHERE doc_id = ?';
    const selectQuery = db.format(selectSqlStr, [docId]);

    db.query(selectQuery, (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).json({
          code: 404,
          message: 'No documents found for the provided document ID'
        });
      }

      // 获得文件路径
      const filePath = result[0].file_path;

      // 删除数据库记录
      const deleteSqlStr = 'DELETE FROM docs WHERE doc_id = ?';
      const deleteQuery = db.format(deleteSqlStr, [docId]);

      db.query(deleteQuery, (err, results) => {
        if (err) {
          console.error('Database query failed: ', err.message);
          return res.status(500).send('Database query failed: ' + err.message);
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({
            code: 404,
            message: 'No documents found for the provided document ID'
          });
        }

        // 删除服务器上的文件
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('File deletion failed: ', err.message);
            // 你需要决定是否在无法删除文件时回滚数据库删除操作
          }

          return res.status(200).json({
            code: 200,
            message: 'Document successfully deleted'
          });
        });
      });
    });
  });
  return router;
};