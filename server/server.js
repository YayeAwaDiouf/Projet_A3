
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const NodeRSA = require('node-rsa');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const key = new NodeRSA({ b: 2048 });
const publicKey = key.exportKey('public');
const privateKey = key.exportKey('private');

let numUsers = 0;
let users = {};

function cesarEncrypt(text, shift) {
  return text.split('').map(char => {
    const asciiCode = char.charCodeAt(0);
    if (asciiCode >= 65 && asciiCode <= 90) {
      return String.fromCharCode((asciiCode - 65 + shift) % 26 + 65);
    } else if (asciiCode >= 97 && asciiCode <= 122) {
      return String.fromCharCode((asciiCode - 97 + shift) % 26 + 97);
    }
    return char;
  }).join('');
}

function generateRandomShift() {
  return Math.floor(Math.random() * 26) + 1;
}

io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté');

  socket.on('join', (data) => {
    users[data.username] = { publicKey };
    numUsers++;
    io.emit('userCount', numUsers);
    io.emit('user-list', { users: Object.keys(users) });
  });

  socket.emit('publicKey', publicKey);

  socket.on('message', (data) => {
    const shift = generateRandomShift();
    const encryptedMessage = cesarEncrypt(data.message, shift);
    io.emit('message-envoye', { username: data.username, message: encryptedMessage, shift });
  });

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });
});

app.use(express.static(path.join(__dirname, '../client')));

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../node_modules/socket.io-client/dist/socket.io.js'));
});

app.get('/socket.io/nodersa.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../node_modules/node-rsa/src/NodeRSA.js'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/chat.html'));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
