const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('user connected', 'Un usuario se ha conectado');

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('user disconnected', 'Un usuario se ha desconectado');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ', msg);
        io.emit('chat message', msg);
    });

    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });

    socket.on('stop typing', (username) => {
        socket.broadcast.emit('stop typing', username);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
