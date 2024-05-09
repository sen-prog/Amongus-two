const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

// let spotifyTokens = {
//     accessToken: 'BQA8Y6Gi9vczOiFqchIjkoip0cI21HcN3SIuA9lEbrT3gFfUlh8cNh2Ki5w75si50oAVs7zqynUpBr9AADOVC52CFKFZ2hCjvloMetVl5VZV2wDl9ZHQ8LKTyebkJT0orSDZ40eoZWTgKii6I3wrdzlon34N_bNU_hVkKZaRJGd092ryZ_i91pKRC0xmPcJN9JiEHLy8DSkcaonDCbUaCk-3qiH2zCovSFsM9_89P8o5ZfOXZZUfkZ0lDjYCzWzXFHNwPq6aSCHOghDJjv8gYhbjF5edIyf5n9dwGmDJAS8Yvn4Ngx_6TFS4wFbzLJANu1c1hwLf26FEc28ZUmYlQIY',
//     refreshToken: 'refresh'
// }

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

        // spotifyTokens.accessToken = response.data.access_token;
        // if(response.data.refresh_token){
        //     spotifyTokens.refreshToken = response.data.refresh_token;
        // }

        return response.data.access_token;
    }catch(error){
        console.error('Error refreshing spotify token:', error.response);
        throw new Error('Failed to refresh spotify token');
    }
};

//middleware
async function ensureSpotifyToken(req, res, next) {
    try{
        if(!spotifyTokens.accessToken){
            await refreshSpotifyToken();
        } else {
            const decodedToken = jwt.decode(spotifyTokens.accessToken);
            const currentTime = Math.floor(Date.now() / 1000);
            if(decodedToken && decodedToken.exp && decodedToken.exp <= currentTime){
                await refreshSpotifyToken();
            }
        }
        req.spotifyAccessToken = spotifyTokens.accessToken;
        next();
    }catch(error){
        console.error('Error ensuring spotify token', error);
        res.status(500).json({ error: 'Failed to ensure spotify token' });
    }
}

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

app.get('/songName/:songName', async (req, res) => {
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
