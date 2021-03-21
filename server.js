require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const http = require('http');

const httpsMode = process.env.HTTPS_MODE === 'true';

let key = undefined;
let cert = undefined;
let peerjsKey = undefined;
let peerjsCert = undefined;

const peerjsHost = process.env.PEERJS_HOST || '/';
const peerjsPort = process.env.PEERJS_PORT || '';
const serverPort = process.env.SERVER_PORT || 3001;
const debugOn = process.env.DEBUG || 'false';

function createServer(theExpressApp, useHttps) {
  let server = undefined;

  if (useHttps) {
    // use the cert and key for server.js

    // read in the cert and key for server.js
    key = fs.readFileSync('./certs/key.pem');
    cert = fs.readFileSync('./certs/cert.pem');

    // read in the cert and key for peerjs server
    // used later when rendering room.ejs
    peerjsKey = fs.readFileSync('./certs/peerjs/key.pem');
    peerjsCert = fs.readFileSync('./certs/peerjs/cert.pem');

    server = https.createServer({ key: key, cert: cert }, theExpressApp);
  } else {
    server = http.createServer(theExpressApp);
  }

  return server;
}

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// creates either an http or https server
const server = createServer(app, httpsMode);
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

  const renderData = {
    roomId: 'videochat',
    peerjsHost: peerjsHost,
    peerjsPort: peerjsPort,
    userName: userName,
    useHttps: `${httpsMode}`,
    debugOn: `${debugOn}`,
  };

  if (httpsMode) {
    renderData.sslKey = peerjsKey;
    renderData.sslCert = peerjsCert;
  } else {
    // room.ejs will fail to load
    // when these fields are missing
    renderData.sslKey = '';
    renderData.sslCert = '';
  }

  res.render('room', renderData);
});
io.on('connection', (socket) => {
  const socketID = socket.id;

  socket.on('join-room', (roomId, userId, userName) => {
    console.log(
      `server.js:socket.on:join-room:event: SOCKET_ID: ${socketID} room: ${roomId}, userid: ${userId}, userName:${userName}`
    );
    socket.join(roomId);
    // sends to all sockets
    io.sockets.emit('some_socket_id', roomId, userId, userName, socketID);
    socket
      .to(roomId)
      .broadcast.emit('user-connected', userId, userName, socketID);
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
    console.log(`By the way, this socketID is ${socketID}`);
    socket.to(roomId).broadcast.emit('user-name', userId, userName);
  });

  socket.on('broadcast-socket-id', (roomId, userId, socketId) => {
    console.log(
      `server.js:socket.on:broadcast-socket-id:event: room: ${roomId}, userid: ${userId}, socketId: ${socketId}`
    );
    socket.to(roomId).broadcast.emit('socket-id', userId, socketId);
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

  socket.on(
    'send_chat_message',
    (roomId, userId, userName, theSocketID, chatMessage) => {
      console.log(
        `server.js:socket.on:send_chat_message:event: room: ${roomId}, userid: ${userId}, userName: ${userName} socketID: ${theSocketID}, chatMessage: ${chatMessage}`
      );

      if (theSocketID === 'everyone') {
        socket
          .to(roomId)
          .broadcast.emit(
            'chat_message_everyone',
            userId,
            userName,
            chatMessage
          );
      } else {
        if (theSocketID) {
          try {
            io.to(theSocketID).emit(
              'chat_message_specific',
              userId,
              userName,
              chatMessage
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('ERROR: theSocketID is null');
        }
      }
    }
  );

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

/**
 * Some endpoints to help developer
 * obtain and debug state information
 * from each participant's store.
 */
const debugdata = {};
if (debugOn === 'true') {
  app.post('/debugdata', (req, res) => {
    const dataPost = req.body;
    const userName = dataPost.userName;
    debugdata[`${userName}`] = dataPost;

    console.log(`${userName} posted debug data`);
    res.send('debug data posted');
  });

  app.get('/debugdata', (req, res) => {
    const dataAsString = JSON.stringify(debugdata, null, 2);
    res.send(dataAsString);
  });
}

server.listen(serverPort);
