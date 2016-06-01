var clientApp = angular.module('clientApp', []);

clientApp.controller('chatController', function () {

    var self = this;
    self.current_name = "Anonymous";
    self.messages = [];
    self.userList = [];
    var socket = io();

    socket.on('new message', function (messages) {
        self.messages = messages;
    });

    socket.on('userList', function (userlist) {
        self.userList = userlist;
    });

    self.setUsername = function (new_name) {
        console.log('new name:' + new_name);

        if (new_name) {
            socket.emit('set username', {currentName: self.current_name, newName: new_name});
            self.current_name = new_name;
        }
    }

    self.sendMessage = function () {
        console.log('inde i send message');
        var date = new Date();

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        var timeStamp = hour + ":" + min + ":" + sec;

        socket.emit('send message', {msg: self.message, fromUser: self.current_name, atTime : timeStamp});
    }


})
;