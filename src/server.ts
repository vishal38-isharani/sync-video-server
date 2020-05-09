import express from 'express';
import cors from 'cors';
import http from 'http';
import socketIo from 'socket.io';

const app = express();
// app.use(cors());
const server = new http.Server(app);
const io = socketIo(server);
const PORT = process.env.PORT || 5000;

let connectionCount = 0;

// start server
server.listen(PORT, () => {
    console.log("server running on " + PORT);
});


io.on('connection', (socket) => {
    connectionCount++;
    socket.on('subscribe', function (room) {
        socket.join(room);
    });
    socket.on("disconnect", function () {
        connectionCount--;
    });
    socket.on('played', function (data) {
        io.to(data).emit('play-client', data);
    });
    socket.on("paused", function (data) {
        io.to(data).emit('pause-client');
    });

    socket.on('seeked', function (data) {
        io.to(data.room).emit('seek-client', data.time);
    });

    // socket.on("pause", function (data) {
    //     io.to(data.room).emit('pausesong', data.times);
    // });
})