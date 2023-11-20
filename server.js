import express from 'express';
import { createServer } from 'http';
import { Server, OPEN } from 'ws';

const app = express();
const server = createServer(app);
const wss = new Server({ server });

const port = 3000;

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
      if (client !== ws && client.readyState === OPEN) {
        client.send(frameData, { binary: true });
      }
    });
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
