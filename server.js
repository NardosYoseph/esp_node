const express = require('express');
const http = require('http');
const rtsp = require('rtsp-stream');

const app = express();
const server = http.createServer(app);

const esp32CamDDNS = 'nardos123.ddns.net';  // Replace with your actual ESP32-CAM DDNS domain

app.get('/video', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'image/jpeg',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  });

  const rtspUrl = `rtsp://${esp32CamDDNS}:554/mjpeg/1`;
  const stream = new rtsp.FFMpeg({ input: rtspUrl, resolution: '640x480' });

  stream.on('data', (data) => {
    try{
    res.write('--myboundary\r\n');
    res.write('Content-Type: image/jpeg\r\n');
    res.write(`Content-Length: ${data.length}\r\n\r\n`);
    res.write(data, 'binary');
  } catch(error) {
      console.error('Error writing to response:', error);
    }
  });

  req.on('close', () => {
    stream.stop();
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
