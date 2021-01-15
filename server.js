require('dotenv').config();

const fs = require('fs');
const key = fs.readFileSync('./certs/key.pem');
const cert = fs.readFileSync('./certs/cert.pem');

const peerjsHost = process.env.PEERJS_HOST || '/';
const peerjsPort = process.env.PEERJS_PORT || '';


const express = require('express');
const https = require('https');
const app = express();
const server = https.createServer({key: key, cert: cert }, app);

const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');


app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/', (req,res) => {
   //res.redirect(`/${uuidv4()}`);
   res.redirect(`/videochat`);
});

app.get('/:room', (req,res) => {
  res.render('room', { roomId: req.params.room, sslKey: key, sslCert: cert,peerjsHost: peerjsHost, peerjsPort: peerjsPort});
});

io.on('connection', socket => {
  socket.on('join-room', (roomId,userId) => {
    
    console.log(`server.js:socket.on:join-room:event: room: ${roomId}, userid: ${userId}`);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
    socket.on('disconnect',()=>{
     
      console.log(`server.js:socket.on:disconnect:event: room: ${roomId}, userid: ${userId}`);
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    });
  });
});
server.listen(443);