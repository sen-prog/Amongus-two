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

    <div id="results">
      
      <iframe v-for="track in tracks" :key="track.id"
              :src="'https://open.spotify.com/embed/track/' + track.id + '?utm_source=generator'"
              style="border-radius: 12px" width="100%" height="80" frameborder="0"
              allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
      </iframe>

    </div>

  </div>

  <div v-if="loggedIn">

    <h2>Chat</h2>

    <div>
      <div v-for="msg in messages" :key="msg.id">
          <p><strong>{{ msg.username }}:</strong> {{ msg.message }}</p>
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
        id: null,
        username: '',
        messages: [],
        newMessage: ''
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
            this.id = response.data.user.id;
            this.username = response.data.user.username;

            this.socket = io('http://localhost:4000');
            this.socket.on('message', (message) => {
              this.messages.push(message);
            });

            // .then(response => {
            //   this.message = response.data.message;
            // }).catch(() => {
            //   alert('You need to log in.');
            //   this.$router.push('/login');
            // });
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
        })
        .catch(error => {
          console.error('Error searching for songs:', error);
          alert('Failed to search for songs.');
        });
      },

      sendMessage(){
        if(this.newMessage.trim() === '') return;
        try{
          console.log('Sending message:', this.newMessage);
          console.log('User ID:', this.id);
          this.socket.emit('message', {
            id: this.id,
            username: this.username,
            message: this.newMessage
          });

          this.newMessage = '';
        }catch(error){
          console.log('Error sending message:', error);
        }
      }
    }
    // setup(){
    //     const router = useRouter();

    //     const logout = () => {
    //         localStorage.removeItem('authToken');
    //         router.push('/');
    //     };

    //     return {
    //         logout
    //     };
    // }
    
  };
  </script>

<style scoped>

</style>
  