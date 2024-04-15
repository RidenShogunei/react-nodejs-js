const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const uuid = require('uuid');
const router = express.Router();

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
    console.log('File upload received');
    const uid = req.body.uid; 

    const file = req.file;
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
      file.originalname,
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

  return router;
};