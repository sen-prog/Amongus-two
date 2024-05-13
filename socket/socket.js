const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
// app.use(cors({ origin: 'http://localhost:5173' }));
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

// io.on('connection', (socket) => {
//     console.log('A client connected');

//     socket.on('message', (data) => {
//         console.log('Received message:', data);

//         io.emit('message', data);

//         const { id, username, message } = data;
//         const date = new Date().toISOString();

//         const checkUserQuery = `SELECT * FROM users WHERE id = ?`;
        
        
//         const insertMessageQuery = `INSERT INTO messages (id, username, message, date) VALUES ('${id}','${username}', '${message}', '${date}')`;
//         console.log('Inserting message into database:', insertMessageQuery);
        
//         connection.query(insertMessageQuery, (err, result) => {
//             if(err){
//                 console.error('Error inserting message: ', err);
//                 return;
//             }
//             console.log('Message inserted into database:', message);
//             // io.emit('message', data);
//         });

//         console.log(data);
//     });
// });

io.on('connection', (socket) => {
    console.log('A client connected');
  
    socket.on('message', (data) => {
      console.log('Received message:', data);
  
      io.emit('message', data);
  
      const { id, username, message } = data;
      const date = new Date().toISOString();
  
      // Check if the user exists in the users table
      const checkUserQuery = `SELECT * FROM users WHERE id = ?`;
      connection.query(checkUserQuery, [id], (err, results) => {
        if (err) {
          console.error(err);
          return;
        }
  
        if (results.length === 0) {
          console.log(`User with id ${id} not found in users table`);
          return;
        }
  
        // Insert the message into the messages table
        const insertMessageQuery = `INSERT INTO messages (id, username, message, date) VALUES (?, ?, ?, ?)`;
        connection.query(insertMessageQuery, [id, username, message, date], (err, results) => {
          if (err) {
            console.error(err);
            return;
          }
  
          console.log(`Inserted message with id ${results.insertId}`);
        });
      });
  
      console.log(data);
    });
  });

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});