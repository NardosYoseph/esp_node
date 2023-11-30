const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const expressWs = require('express-ws');
const path = require('path');
const fs = require('fs');
const app = express();

const server = http.createServer( app);

const wss = new WebSocket.Server({ server});

const port = process.env.PORT||443;
expressWs(app);
app.use(express.static(__dirname));

// app.ws('/video', (ws, res) => {
//   res.sendFile(path.join(__dirname + '/index.html'));
//     ws.send(data);
// });


wss.on('connection', (ws) => {

  console.log('WebSocket connection established');

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
