const express = require("express");
// import cors from 'cors';
const http = require("http");
const socketIo = require("socket.io");

const app = express();
// app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Credentials", true.toString());
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});
const server = require("http").Server(app);
const io = socketIo(server);
io.origins('http://localhost:4200');
const PORT = process.env.PORT || 5000;

let connectionCount = 0;

// start server
server.listen(PORT, () => {
  console.log("server running on " + PORT);
});

io.on("connection", (socket) => {
  connectionCount++;
  socket.on("subscribe", function (room) {
    socket.join(room);
  });
  socket.on("disconnect", function () {
    connectionCount--;
  });
  socket.on("played", function (data) {
    io.to(data.room).emit("play-client", data);
  });
  socket.on("paused", function (data) {
    io.to(data.room).emit("pause-client");
  });

  socket.on("seek", function (data) {
    io.to(data.room).emit("seek-client", data.time);
  });

  // socket.on("pause", function (data) {
  //     io.to(data.room).emit('pausesong', data.times);
  // });
});
