const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server});

const port = process.env.PORT||3000;
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
  console.log(`Server is running on port ${port}`);
});
