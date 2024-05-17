<template>
    <div>
      <h1>Dashboard</h1>
      <p>{{ message }}</p>
      <button @click="logout">Logout</button>
    </div>

    <div>
    <h2>Search for a song</h2>

    <form @submit.prevent="searchSong">
      <input type="text" v-model="searchInput" placeholder="Enter song name...">
      <button type="submit">Search</button>
    </form>

    <button @click="clearSearchResults">Clear Results</button>

    <div id="results">
      <div v-for="track in tracks" :key="track.id">
        <iframe
          :src="'https://open.spotify.com/embed/track/' + track.id + '?utm_source=generator'"
          style="border-radius: 12px"
          width="100%"
          height="80"
          frameborder="0"
          allowfullscreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        ></iframe>
        <button type="submit" @click="shareSong(track.id)">Share</button>
      </div>
    </div>
  </div>


  

  <div v-if="loggedIn">
    <h2>Chat</h2>
    <div>
      <div v-for="msg in messages" :key="msg.id">
          <span v-if="!isIframe(msg.message)">
            <strong>{{ `${ msg.username }: ` }}</strong>{{ msg.message }}
          </span>
          <span v-else v-html="`${ msg.username }: ` + msg.message"></span>
      </div>
    </div>
    <input v-model="newMessage" type="text" placeholder="Type your message..." @keyup.enter="sendMessage">
  </div>
  </template>
  
  <script>
  import axios from 'axios';
  import io from 'socket.io-client';
  
  export default {
    data() {
      return {
        message: '',
        searchInput: '',
        tracks: [],
        loggedIn: false,
        user_id: null,
        messages: [],
        newMessage: '',
        socket: null
      };
    },
    async mounted() {
      const token = localStorage.getItem('authToken');
        if(!token){
            alert('You need to log in.');
            this.$router.push('/login');
            return;
        }

        
        try{
          const response = await axios.get('http://localhost:3000/dashboard', {
              headers: {
                'Authorization': token
              }
            });

            this.message = response.data.message;
            this.loggedIn = true;
            this.user_id = response.data.user.userId;
            this.username = response.data.user.username;

            console.log(response);

            this.socket = io('http://localhost:4000');
            this.socket.on('message', (message) => {
              if(!this.messages.some(msg => msg.id === message.id)){
                this.messages.push(message);
              }
            });

            this.fetchMessages();
        }catch(error){
          console.log('error fetching dashboard data:', error);
          this.$router.push('/login');
        }
    },
    methods: {
      logout(){
        localStorage.removeItem('authToken');
        this.$router.push('/');
      },

      searchSong(){
        axios.get(`http://localhost:3000/songName/${encodeURIComponent(this.searchInput)}`)
        .then(response => {
          this.tracks = response.data.data;
          this.searchInput = '';
        })
        .catch(error => {
          console.error('Error searching for songs:', error);
          alert('Failed to search for songs.');
        });
      },

      clearSearchResults(){
        this.tracks = [];
      },

      isIframe(message){
        return message.startsWith('<iframe');
      },

      async fetchMessages(){
        try{
          const response = await axios.get('/api/displayMessage');
          this.messages = response.data;
        }catch(error){
          console.error('Error fetching message', error);
        }
      },

      async sendMessage(){
        if(this.newMessage.trim() === '') return;
        try{
          console.log('Sending message:', this.newMessage);
          console.log('User ID:', this.user_id);

          const data = {
            user_id: this.user_id,
            username: this.username,
            message: this.newMessage
          };

          console.log(data);
          console.log(this.user_id);

          this.socket.emit('message', data);
          this.newMessage = '';

        }catch(error){
          console.log('Error sending message:', error);
        }
      },

      async shareSong(songId){
        try {
          const token = localStorage.getItem('authToken');
          console.log('Token: ', token);
          const response = await axios.post('http://localhost:3000/shareSong', {
            songId
          }, {
            headers: {
              'Authorization': token
            }
          });
          console.log('Song shared successfully');
        } catch (error) {
          console.error("There's an error while sharing a song.", error);
          alert("There's an error while sharing a song.");
        }
      }
    }
    
  };
  </script>

<style scoped>

</style>
  