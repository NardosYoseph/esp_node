const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
// const privateKey = fs.readFileSync('key_no_passphrase.pem', 'utf8');
// const certificate = fs.readFileSync('cert.pem', 'utf8');
//const credentials = { key: privateKey, cert: certificate };
const app = express();

const server = http.createServer( app);


const wss = new WebSocket.Server({ server});

const port = process.env.PORT||443;
app.use(express.static(__dirname));

app.get('/video', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (frameData) => {

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(frameData, { binary: true });
      }
    });
  });
});


server.listen(port, () => {
  console.log(`Server is running on port ${server.address().port}`);
});
