const audio = document.getElementById('audio');
const sceneNameInput = document.getElementById('scene-name-input');
const phraseInput = document.getElementById('phrase');
const submitButton = document.getElementById('submit');

// Lire le son à l'entrée
audio.play();

submitButton.addEventListener('click', (event) => {
  event.preventDefault();

  const sceneName = sceneNameInput.value.trim();
  const phrase = phraseInput.value.trim();

  if (sceneName !== '' && phrase !== '') {
    // Stockez le nom de scène et la phrase dans le stockage local ou transmettez-les directement à la page client.html
    localStorage.setItem('sceneName', sceneName);
    localStorage.setItem('phrase', phrase);

    // Redirigez l'utilisateur vers la page client.html
    window.location.href = 'client.html';
  } else {
    alert('Veuillez entrer un nom de scène et une phrase secrète valides.');
  }
});

// Ajouter un écouteur d'événement pour le bouton d'envoi
submitButton.addEventListener('click', () => {
  const phrase = phraseInput.value.trim();

  // Vérifier si la phrase secrète est correcte
  if (phrase === 'ilSeFichier') {
    // Rediriger vers la page du chat
    window.location.href = 'chat.html';
  } else {
    // Afficher une fenêtre contextuelle d'avertissement
    alert('Désolé, vous n\'êtes pas invité à entrer dans ce chat !');
  }
});

