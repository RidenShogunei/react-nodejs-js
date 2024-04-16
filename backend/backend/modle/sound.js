const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const uuid = require('uuid');
const router = express.Router();
const fs = require('fs')

router.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fileId = uuid.v4();
    cb(null, `${fileId}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = function (db) {
  router.post('/', upload.single('file'), (req, res) => {
    console.log('Audio upload received');
    const uid = req.body.uid;
    const file = req.file;
    const original_name = Buffer.from(file.originalname, "latin1").toString("utf8");
    if (!file) {
      console.log('file empty')
      return res.status(400).json({
        code: 400,
        message: 'No audio file uploaded'
      });
    }

    const audioId = uuid.v4();
    const uploadTime = new Date();

    const sqlStr =
      'INSERT INTO audio (audio_id, user_id, file_name, file_path, file_type, file_size, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const query = db.format(sqlStr, [
      audioId,
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
          audioId: audioId
        }
      });
    });
  });

  router.get('/:uid', (req, res) => {
    const uid = req.params.uid;
    console.log("get data", uid)

    const sqlStr = 'SELECT * FROM audio WHERE user_id = ?';
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

  router.delete('/:audioId', (req, res) => {
    const audioId = req.params.audioId;
    console.log("delete data", audioId)

    const selectSqlStr = 'SELECT file_path FROM audio WHERE audio_id = ?';
    const selectQuery = db.format(selectSqlStr, [audioId]);

    db.query(selectQuery, (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).json({
          code: 404,
          message: 'No audio found for the provided audio ID'
        });
      }

      const filePath = result[0].file_path;

      const deleteSqlStr = 'DELETE FROM audio WHERE audio_id = ?';
      const deleteQuery = db.format(deleteSqlStr, [audioId]);

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
            message: 'Audio successfully deleted'
          });
        });
      });
    });
  });
  return router;
};