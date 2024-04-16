const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');
const privateKey = fs.readFileSync('/etc/nginx/ssl/chenjinxu.top.key', 'utf8');
const certificate = fs.readFileSync('/etc/nginx/ssl/chenjinxu.top.pem', 'utf8');

const app = express();

const conn = mysql.createConnection({
  user: 'blog',          //用户名
  password: 'chen2003',  //密码
  host: '47.96.160.149',     //主机（默认都是local host）
  database: 'fiveth',   //数据库名
  charset: 'utf8mb4'
});

app.use(cors());
app.use(bodyParser.json());

conn.connect(err => {
  if (err) {
    console.error(err, '如果不为null，则连接失败');
  } else {
    console.log('数据库连接成功');
    // 完成连接后，开启一个定时器，每隔一段时间发送一个查询至数据库服务，保持连接活跃
    setInterval(function () {
      conn.query('SELECT 1');
    }, 5000);

    // 连接成功后导入路由
    const loginRouter = require('./modle/login')(conn);
    const registerdRouter = require('./modle/register')(conn);
    const getconfirmRouter = require('./modle/getconfirm')(conn);
    const documentRouter = require('./modle/document')(conn);
    const audioRouter = require('./modle/sound')(conn);
    const videoRouter = require('./modle/video')(conn);
    const getanalysisRouter = require('./modle/getanalysis')(conn);
    app.use('/login', loginRouter);
    app.use('/register', registerdRouter);
    app.use('/getconfirm', getconfirmRouter);
    app.use('/document', documentRouter);
    app.use('/audio', audioRouter);
    app.use('/video', videoRouter);
    app.use('/getanalysis', getanalysisRouter);
    app.use('/document/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use('/audio/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use('/video/uploads', express.static(path.join(__dirname, 'uploads')));
  }
});

// Create an HTTPS service identical to the HTTP service.
const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);
httpsServer.listen(6002, () => {
  console.log('HTTPS Server is running on https://localhost:6001');
});

// Then create a WebSocket server by fixing it on the HTTPS server
const wss = new WebSocket.Server({ server: httpsServer });
wss.on('connection', function connection(ws) {
  console.log('WebSocket client connected');
  // handle WebSocket connections and messages...
  ws.send('Hello! I am a WebSocket server.');
});