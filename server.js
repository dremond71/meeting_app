require('dotenv').config();

const fs = require('fs');

const key = fs.readFileSync('./certs/key.pem');
const cert = fs.readFileSync('./certs/cert.pem');

const peerjsHost = process.env.PEERJS_HOST || '/';
const peerjsPort = process.env.PEERJS_PORT || '';

const express = require('express');
const https = require('https');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const server = https.createServer({ key: key, cert: cert }, app);

const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  //res.redirect(`/${uuidv4()}`);
  res.redirect(`/lobby`);
});

app.get('/lobby', (req, res) => {
  res.render('lobby');
});

app.get('/videochat', (req, res) => {
  const userName = req.query.username;
  console.log(`/room and userName is ${userName}`);

  res.render('room', {
    roomId: 'videochat',
    sslKey: key,
    sslCert: cert,
    peerjsHost: peerjsHost,
    peerjsPort: peerjsPort,
    userName: userName,
  });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId, userName) => {
    console.log(
      `server.js:socket.on:join-room:event: room: ${roomId}, userid: ${userId}, userName:${userName}`
    );
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId, userName);
    socket.on('disconnect', () => {
      console.log(
        `server.js:socket.on:disconnect:event: room: ${roomId}, userid: ${userId}, user name ${userName}`
      );
      socket.to(roomId).broadcast.emit('user-disconnected', userId, userName);
    });
  });

  socket.on('broadcast-username', (roomId, userId, userName) => {
    console.log(
      `server.js:socket.on:broadcast-username:event: room: ${roomId}, userid: ${userId}, userName: ${userName}`
    );
    socket.to(roomId).broadcast.emit('user-name', userId, userName);
  });

  socket.on('muted-audio', (roomId, userId) => {
    console.log(
      `server.js:socket.on:muted-audio:event: room: ${roomId}, userid: ${userId}`
    );
    socket.to(roomId).broadcast.emit('user-muted-audio', userId);
  });

  socket.on('unmuted-audio', (roomId, userId) => {
    console.log(
      `server.js:socket.on:unmuted-audio:event: room: ${roomId}, userid: ${userId}`
    );
    socket.to(roomId).broadcast.emit('user-unmuted-audio', userId);
  });

  socket.on('muted-video', (roomId, userId) => {
    console.log(
      `server.js:socket.on:muted-video:event: room: ${roomId}, userid: ${userId}`
    );
    socket.to(roomId).broadcast.emit('user-muted-video', userId);
  });

  socket.on('unmuted-video', (roomId, userId) => {
    console.log(
      `server.js:socket.on:unmuted-video:event: room: ${roomId}, userid: ${userId}`
    );
    socket.to(roomId).broadcast.emit('user-unmuted-video', userId);
  });

  socket.on('starting-share', (roomId, userId) => {
    console.log(
      `server.js:socket.on:starting-share:event: room: ${roomId}, userid: ${userId}`
    );
    socket.to(roomId).broadcast.emit('user-starting-share', userId);
  });

  socket.on('stopping-share', (roomId, userId) => {
    console.log(
      `server.js:socket.on:stopping-share:event: room: ${roomId}, userid: ${userId}`
    );
    socket.to(roomId).broadcast.emit('user-stopping-share', userId);
  });
});
server.listen(443);
