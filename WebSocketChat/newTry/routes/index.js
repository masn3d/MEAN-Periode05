var express = require('express');
var router = express.Router();

var sendMsg = [];
var userList = [];
var connections = [];

/* GET home page. */
router.get('/', function (req, res, next) {

    app.io.sockets.on('connect', function (socket) {

        connections.push(socket);
        console.log('Connected: %s sockets connected', connections.length);

        socket.on('disconnect', function (data) {
            connections.splice(connections.indexOf(socket), 1);
            console.log('Disconnected: %s sockets connected', connections.length);
        });

        socket.on('set username', function (data) {
            console.log('Username set to:' + data.newname);
            connections.splice(connections.indexOf(data.currentName), 1);
            userList.push(data.newName);
            app.io.sockets.emit('userList', userList);
        });

        socket.on('send message', function (data) {
            console.log('Server got message:' + data.msg);
            console.log('From:' + data.fromUser);
            console.log('At timeStamp:' + data.timeStamp);
            sendMsg.push(data);
            app.io.sockets.emit('new message', sendMsg);
        });

    });
});

module.exports = router;
