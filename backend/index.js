const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

const saltRounds = 10;

const clientId = '1f016cd082034c2aad72cdacf963ac2c';
const clientSecret = 'afd666df2bb64006919ef46448e9dda9';

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

const refreshSpotifyToken = async () => {
    try{
        const response = await axios.post('https://accounts.spotify.com/api/token', {
                grant_type: 'client_credentials'
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
    
                auth: {
                    username: clientId,
                    password: clientSecret
                }
            }
        );

            return response.data.access_token;
    }catch(error){
        console.error('Error refreshing spotify token:', error.response);
        throw new Error('Failed to refresh spotify token');
    }
};


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
        res.json({token, userId: user.id});
    });
});

app.get('/dashboard', verifyToken, (req, res) => {
    res.json({message: 'This is a protected route. You have access!', user:req.user});
});

app.post('/logout', (req, res) => {
    res.json({ message: 'Logged out Successfully!' });
});



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

app.get('/songName/:songName', async(req, res) => {
    const q = req.params.songName;
    try{
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track`, {
            headers: {
            'Authorization' : `Bearer  ${await refreshSpotifyToken()}`
            }
        });

        let trackIDS = [];
        response.data.tracks.items.forEach(element => {
            trackIDS.push({ id: element.id, name: element.name });
        });

        res.json({message: 'Search Results', data: trackIDS});
    }catch(error){
        if(error.response && error.response.status === 401){
            await refreshSpotifyToken();
            return res.redirect('songName/' + q);
        }

        console.error('Error fetching song:', error);
        res.status(500).json({error: 'failed to fetch song'});
    }
});

app.get('/displayMessage', (req, res) => {
    const query = 'SELECT u.username, m.message FROM messages m JOIN users u ON m.user_id = u.id';
    console.log('Executing query', query);

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
        } else {
            console.log('Messages:', results);
            res.json(results);
        }
    });
});
