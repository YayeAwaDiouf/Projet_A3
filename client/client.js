/*const socket = io();
let publicKey;
const sceneName = localStorage.getItem('sceneName');
const params = new URLSearchParams(window.location.search);
let username = params.get('username');
document.addEventListener('DOMContentLoaded', () => {

  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');

  // Récupérer la clé publique du serveur
    socket.on('publicKey', (data) => {
    console.log('publicKey:',data);
    publicKey = new NodeRSA(data);
  });
  
  // Émettre l'événement "join" vers le serveur lorsque la page est chargée
  socket.emit('join', { username: getUsername() });

  // Écouter l'événement "userCount" émis par le serveur
  socket.on('userCount', (count) => {
    console.log(`Nombre d'utilisateurs connectés : ${count}`);
  });

  // Gestion de la soumission du formulaire de chat
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();
    if (message !== '') {
      sendMessage(message);
      messageInput.value = ''; // Effacer le champ de saisie après l'envoi du message
    }
  });

  // Écouter les messages du serveur
  socket.on('message-envoye', (data) => {
    console.log('Message reçu :', data.message);
    appendMessage(data.username + ' : '+ data.message);
  });

  // Fonction pour ajouter un message à la chatbox
  function appendMessage(message) {
    console.log('Message à afficher :', message);
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
  }

  // Fonction pour envoyer un message
  function sendMessage(message) {
    console.log('Message à envoyer :', message, socket);
    socket.emit('message',{ message: message, username:getUsername()});
  }

  // Fonction pour récupérer le nom d'utilisateur à partir du stockage local
  function getUsername() {
    return sceneName;
  }
  

});

// Code existant pour la connexion au serveur et la gestion des messages

// Ajouter une fonction pour gérer la soumission du formulaire de connexion
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const userId = document.getElementById('user-id').value;
  const password = document.getElementById('password').value;

  // Vérifiez si l'ID et le mot de passe sont corrects
  // ID : culteDelbot
  // PWD : bienvenueEnEnfer
  if (userId === 'culteDelbot' && password === 'bienvenueEnEnfer') {
    // Rediriger vers la page de chat
    window.location.href = 'intermediaire.html?username=' + userId;
  } else {
    // Afficher un message d'erreur amusant
    alert("Désolé, vous n'êtes pas autorisé à notre CULTE . Essayez de trouver un SACRIFICE HUMAINE pour le TOUT puissant.");
  }
});
*/
const socket = io();
let publicKey;
const sceneName = localStorage.getItem('sceneName');
const params = new URLSearchParams(window.location.search);
let username = params.get('username');

document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');

  socket.on('publicKey', (data) => {
    publicKey = new NodeRSA(data);
  });

  socket.emit('join', { username: getUsername() });

  socket.on('userCount', (count) => {
    console.log(`Nombre d'utilisateurs connectés : ${count}`);
  });

  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInput.value.trim();
    if (message !== '') {
      sendMessage(message);
      messageInput.value = '';
    }
  });

  socket.on('message-envoye', (data) => {
    const decryptedMessage = cesarDecrypt(data.message, data.shift);
    appendMessage(`${data.username} : ${decryptedMessage}`);
  });

  function appendMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
  }

  function sendMessage(message) {
    socket.emit('message', { message, username: getUsername() });
  }

  function getUsername() {
    return sceneName;
  }

  function cesarDecrypt(text, shift) {
    return text.split('').map(char => {
      const asciiCode = char.charCodeAt(0);
      if (asciiCode >= 65 && asciiCode <= 90) {
        return String.fromCharCode((asciiCode - 65 - shift + 26) % 26 + 65);
      } else if (asciiCode >= 97 && asciiCode <= 122) {
        return String.fromCharCode((asciiCode - 97 - shift + 26) % 26 + 97);
      }
      return char;
    }).join('');
  }
});