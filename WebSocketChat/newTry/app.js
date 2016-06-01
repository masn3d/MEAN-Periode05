var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();
//var indexRouter = require('./routes/index.js');
//var usersRouter = require('./routes/users.js');

var server = require('http').createServer(app);
app.io = require('socket.io').listen(server);
server.listen(3000);

console.log('server is running...');

app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);

app.use(logger('dev'));
/*app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(cookieParser());*/

var sendMsg = [];
var userList = [];
var connections = [];

app.io.sockets.on('connect', function (socket) {

    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('set username', function (data) {
        console.log('Username set to:' + data.newName);
        connections.splice(connections.indexOf(data.currentName), 1);
        userList.push(data.newName);
        app.io.sockets.emit('userList', userList);
    });

    socket.on('send message', function (data) {
        console.log(data.atTime);
        sendMsg.push(data);
        app.io.sockets.emit('new message', sendMsg);
    });

});


//---------------------error handling----------------------------------


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
