const express = require('express');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const privateKey = fs.readFileSync('key_no_passphrase.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const app = express();
// Create an HTTPS server
const server = https.createServer(credentials, app);


const wss = new WebSocket.Server({ server});

const port = process.env.PORT||10000;
app.use(express.static(__dirname));
// Route to serve the HTML page with video player
app.get('/video', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Listen for video frames from ESP32-CAM
  ws.on('message', (frameData) => {
    // Broadcast the frame to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(frameData, { binary: true });
      }
    });
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${server.address().port}`);
});
