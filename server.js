const express = require('express');
const https = require('https');
const WebSocket = require('ws');
const expressWs = require('express-ws');
const path = require('path');
const fs = require('fs');
const app = express();

const server = https.createServer({
  cert: fs.readFileSync('certificate.pem'),
  key: fs.readFileSync('private-key.pem'),
}, app);

//const wss = new WebSocket.Server({server});
expressWs(app, server);
const port = process.env.PORT||443;
//expressWs(app);
app.use(express.static(__dirname));

app.ws('/video', (ws) => {
  console.log('WebSocket connection established for /video');
 // res.sendFile(path.join(__dirname + '/index.html'));
  ws.on('message', (frameData) => {
    ws.send(frameData, { binary: true });
  });

  ws.on('message', (frameData) => {
    if (frameData instanceof Buffer) {
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
         
          client.send(frameData, { binary: true }, (error) => {
            if (error) {
              console.error(`Error sending binary data to client: ${error.message}`);
            }
          });
        }
      });
    } else {
      console.error('Received non-binary data. Ignoring.');
    }
  });
});
 

// server.on('upgrade', (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit('connection', ws, request);
//   });
// });

server.listen(port, () => {
  console.log(`Server is running on port ${server.address().port}`);
});
