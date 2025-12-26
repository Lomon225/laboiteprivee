const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');

  // Rejoindre une "boîte" privée (salle)
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Utilisateur dans la salle ${room}`);
  });

  // Réception d’un message et renvoi à l’autre utilisateur de la même salle
  socket.on('chat-message', (data) => {
    // renvoyer le message à tous dans la même salle (sauf l’émetteur)
    socket.to(data.room).emit('chat-message', {
      from: 'Ami',
      text: data.text
    });
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('LaBoitePrivée ready sur le port ' + PORT);
});
