var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('server is running...');

app.use(express.static(__dirname + '/public'));

app.get('/*', express.static(__dirname + './public/index.html'));


io.sockets.on('connect', function (socket) {

    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    io.sockets.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    io.sockets.on('send message', function (data) {
        io.sockets.emit('new message', {msg: data});
    });
});
