const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
      }
});

const connection = mysql.createConnection({
    host: 'localhost',
    user:   'root',
    password: '',
    database: 'spotify-amongus'
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('connected to database');
  });

io.on('connection', (socket) => {
    console.log('A client connected');
  
    socket.on('message', (data) => {
      console.log(data);


      const { user_id, message } = data;

      const insertMessageQuery = 'INSERT INTO messages (user_id, message) VALUES (?, ?)';
        connection.query(insertMessageQuery, [user_id, message], (err, results) => {
          if (err) {
            console.error(err);
            return;
          }
  
          console.log(`Inserted message with id ${results.insertId}`);
          

        });

        io.emit('message', data);
  
      console.log(data);
    });
  });

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});