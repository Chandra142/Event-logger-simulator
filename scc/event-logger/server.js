const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const os = require("os");
const path = require("path");
const si = require("systeminformation");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the dashboard assets from the sibling scc directory
app.use(express.static(path.join(__dirname, "..")));

wss.on("connection", (clientSocket) => {
  console.log("Client connected");

  const eventTypes = [
    "User login detected",
    "Failed login attempt",
    "Unauthorized access attempt",
    "Security policy triggered",
    "New session initialized"
  ];

  const platformMap = {
    darwin: "macOS",
    win32: "Windows",
    linux: "Linux"
  };

  const sendSystemReport = async () => {
    const timestamp = new Date().toLocaleString();
    const cpu = await si.currentLoad();
    const memory = await si.mem();
    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    const log = {
      timestamp,
      cpuUsage: `${cpu.currentLoad.toFixed(2)}%`,
      freeMemory: `${(memory.available / (1024 * 1024)).toFixed(2)} MB`,
      operatingSystem: platformMap[os.platform()] || os.platform(),
      securityEvent: randomEvent
    };

    console.log("Sending to client:", log);
    clientSocket.send(JSON.stringify(log));
  };

  const streamInterval = setInterval(sendSystemReport, 3000);

  clientSocket.on("close", () => {
    clearInterval(streamInterval);
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
