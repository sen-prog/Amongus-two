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
      <!-- Displaying an iframe for each track -->
      <iframe v-for="track in tracks" :key="track.id"
              :src="'https://open.spotify.com/embed/track/' + track.id + '?utm_source=generator'"
              style="border-radius: 12px" width="100%" height="80" frameborder="0"
              allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
      </iframe>
    </div>
  </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        message: '',
        searchInput: '',
        tracks: []
      };
    },
    mounted() {
      const token = localStorage.getItem('authToken');
        if(!token){
            alert('You need to log in.');
            this.$router.push('/login');
            return;
        }

      axios.get('http://localhost:3000/dashboard', {
        headers: {
          'Authorization': token
        }
      }).then(response => {
        this.message = response.data.message;
      }).catch(() => {
        alert('You need to log in.');
        this.$router.push('/login');
      });

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
  