const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

// Connection opened
wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    // Broadcast to all clients
    wss.clients.forEach((client) => client.send(data.toString()));
  });

  console.log("Client connected");
});
