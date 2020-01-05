// ENV
require('dotenv').config();
// DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var routes = require('./routes');
const User = require('./models/list');
const socketio = require('socket.io');

const app = express();
const port = process.env.PORT || 4500;

// Static File Service
app.use(express.static('public'));

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

// CONNECT TO MONGODB SERVER
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

var index = require('./routes/index')(app);

app.use('/', index);
app.get('/', function(req, res, next) {
    res.render('index');
})

const server = app.listen(port, () => console.log(`Server listening on port ${port}`));
var io = socketio.listen(server);
var roomName;
var whoIsOn = [];

io.sockets.on('connection', function (socket){
    // console.log('Socket ID : ' + socket.id + ', Connect');

    //메세지 보내기
    socket.on('clientMessage', function(data){ 
        console.log('Client Message : ' + data);
         
        var message = {
            msg : 'server',
            data : data
        };

        socket.emit('serverMessage', message);
    });

    //특정 방에 들어감
    socket.on('joinRoom', function(data){  //클라이언트가 보내는 이벤트 듣기 : socket.on('event', function(data)...)
        console.log(data); //들어간 방, username
        socket.join(data.roomName);
        roomName = data.roomName;
        // username = data.username;
        // whoIsOn.push(username);

        // var whoIsOnJson = `${whoIsOn}`;
        // console.log(whoIsOnJson);
        // io.emit('newUser', whoIsOnJson); //server에서 client로 이벤ㅌ 보내기
    });

    socket.on('reqMsg', function(data) {
        console.log(data);
        io.sockets.in(roomName).emit('reqMsg', { {comment: instanceId + " : " + data.comment+'\n'})
    })
});
