const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const uuid = require('uuid');
const router = express.Router();
const fs = require('fs')

router.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const fileId = uuid.v4();
    cb(null, `${fileId}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = function (db) {
  router.post('/', upload.single('file'), (req, res) => {
    console.log('Video upload received');
    const uid = req.body.uid;
    const file = req.file;
    const original_name = Buffer.from(file.originalname, "latin1").toString("utf8");
    if (!file) {
      console.log('file empty')
      return res.status(400).json({
        code: 400,
        message: 'No video file uploaded'
      });
    }

    const videoId = uuid.v4();
    const uploadTime = new Date();

    const sqlStr =
      'INSERT INTO video (video_id, user_id, file_name, file_path, file_type, file_size, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const query = db.format(sqlStr, [
      videoId,
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
          videoId: videoId
        }
      });
    });
  });

  router.get('/:uid', (req, res) => {
    const uid = req.params.uid;
    console.log("get data", uid)

    const sqlStr = 'SELECT * FROM video WHERE user_id = ?';
    const query = db.format(sqlStr, [uid]);

    db.query(query, (err, results) => {
      if (err) {
        console.error('Database query failed: ', err.message);
        return res.status(500).send('Database query failed: ' + err.message);
      }

      return res.status(200).json({
        code: 200,
        data: results
      });
    });
  });

  router.delete('/:videoId', (req, res) => {
    const videoId = req.params.videoId;
    console.log("delete data", videoId)

    const selectSqlStr = 'SELECT file_path FROM video WHERE video_id = ?';
    const selectQuery = db.format(selectSqlStr, [videoId]);

    db.query(selectQuery, (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).json({
          code: 404,
          message: 'No video found for the provided video ID'
        });
      }

      const filePath = result[0].file_path;

      const deleteSqlStr = 'DELETE FROM video WHERE video_id = ?';
      const deleteQuery = db.format(deleteSqlStr, [videoId]);

      db.query(deleteQuery, (err, results) => {
        if (err) {
          console.error('Database query failed: ', err.message);
          return res.status(500).send('Database query failed: ' + err.message);
        }

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('File deletion failed: ', err.message);
          }

          return res.status(200).json({
            code: 200,
            message: 'Video successfully deleted'
          });
        });
      });
    });
  });
  return router;
};