const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

let rooms = [];

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "rooms.html"));
});

app.get("/canvas.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "canvas.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("createRoom", (room) => {
    if (!rooms.includes(room)) {
      rooms.push(room);
    }
  });

  socket.on("getRooms", () => {
    socket.emit("availableRooms", rooms);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    socket.room = room;
    console.log(`User joined room: ${room}`);
  });

  socket.on("drawing", (data) => {
    socket.to(socket.room).emit("drawing", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
