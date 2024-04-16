const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
// const path = require('path');
const app = express();
const port = 3000;

const saltRounds = 10;

// app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());
app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
});

const connection = mysql.createConnection({
    host: 'localhost',
    user:   'root',
    password: '',
    database: 'spotify-amongus'
});

connection.connect((err)=>{
    if(err){
        console.log('error connecting to database', err);
    }else{
        console.log('connected to database');
    }
});

app.post('/register', async (req, res)=>{
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results)=>{
        if(err){
            console.log('Error creating user:', err);
            return res.status(500).json({error: 'Internal Server error'});
        }

        console.log('User registered: ', results.insertId);
        res.json({message: 'User registered successfully'});
    });
});

app.post('/login', (req, res) => {
    const {username,password} = req.body;

    connection.query('SELECT * FROM users WHERE username = ?', [username], async(err, results) => {
        if(err){
            console.error('Error retrieving user: ', err);
            return res.status(500).json({error: 'Internal Server error'});
        }

        if(results.length === 0){
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const token = jwt.sign({userId: user.id, username: user.username}, 'secretKey');
        res.json({token});
    });
});

app.get('/dashboard', verifyToken, (req, res) => {
    res.json({message: 'This is a protected route. You have access!', user:req.user});
});

app.post('/logout', (req, res) => {
    res.json({ message: 'Logged out Successfully!' });
});

// app.get('*', (req, res) => {
//     res.sendFile(path.json(__dirname, 'index.html'))
// });

function verifyToken(req, res, next){
    const token = req.headers['authorization'];

    if(!token){
        return res.status(403).json({error: 'Token not provided'});
    }

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if(err){
            return res.status(401).json({error: 'Invalid Token'});
        }

        req.user = decoded;
        next();
    });
}

