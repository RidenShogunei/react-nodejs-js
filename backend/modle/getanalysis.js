const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

module.exports = function (db) {
  router.get('/:uid', (req, res) => {
    let userId = req.params.uid;
    console.log("data analysis",userId)
    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    const query = `
      SELECT 
        (
          SELECT SUM(file_size) FROM docs WHERE user_id = '${userId}'
        ) AS docsSize,
        (
          SELECT SUM(file_size) FROM video WHERE user_id = '${userId}'
        ) AS videoSize,
        (
          SELECT SUM(file_size) FROM audio WHERE user_id = '${userId}'
        ) AS audioSize
      `;

    db.query(query, (err, results) => {
      if(err) throw err;

      const totalSize = results[0].docsSize + results[0].videoSize + results[0].audioSize;

      const response = {
        totalSizeKB: totalSize/1024,
        fileSizeKB: results[0].docsSize/1024,
        videoSizeKB: results[0].videoSize/1024,
        audioSizeKB: results[0].audioSize/1024,
        fileRatio: results[0].docsSize / totalSize,
        videoRatio: results[0].videoSize / totalSize,
        audioRatio: results[0].audioSize / totalSize
    };

      res.json(response);
    });
  });
  
  return router;
};