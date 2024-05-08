const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const NodeRSA = require('node-rsa');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Générer une paire de clés RSA
const key = new NodeRSA({ b: 2048 });
const publicKey = key.exportKey('public');
const privateKey = key.exportKey('private');

let numUsers = 0; // Variable pour stocker le nombre d'utilisateurs connectés
let users = {}; // Objet pour stocker les utilisateurs connectés et leurs clés publiques

// Serve les fichiers statiques depuis le dossier 'client'
app.use(express.static(path.join(__dirname, '../client')));

// Servez le fichier socket.io.js
app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../node_modules/socket.io-client/dist/socket.io.js'));
});
app.get('/socket.io/nodersa.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../node_modules/node-rsa/src/NodeRSA.js'));
});

// Route vers la page d'accueil (formulaire de nom d'utilisateur)
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Route vers la page de chat
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/chat.html'));
});

// Gestion des connexions socket
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');
    socket.on('join', (data) => {
    users[data.username] = { publicKey: publicKey };
    numUsers++;
    io.emit('userCount', numUsers);
    io.emit('user-list', { users: Object.keys(users) });
  });

    // Envoyer la clé publique au client
    socket.emit('publicKey', publicKey);

    // Écouter les messages du client
    socket.on('message', (data) => {
    console.log('Message reçu:', data.message);
      io.emit('message-envoye',{ message: data.message, username: data.username });
  });

  // Gestion de la déconnexion
  socket.on('disconnect', () => {
    console.log('Un utilisateur est déconnecté');
  });
});

// Écoute du port
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});