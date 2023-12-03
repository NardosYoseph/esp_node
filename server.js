const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const expressWs = require('express-ws');
const path = require('path');
const fs = require('fs');
const app = express();

const server = http.createServer( app);

const wss = new WebSocket.Server({ noServer: true});

const port = process.env.PORT||3000;
expressWs(app);
app.use(express.static(__dirname));

app.ws('/video', (ws, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
  ws.on('message', (frameData) => {
    ws.send(frameData, { binary: true });
  });
});


wss.on('connection', (ws) => {

  console.log('WebSocket connection established');
 
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
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${server.address().port}`);
});
