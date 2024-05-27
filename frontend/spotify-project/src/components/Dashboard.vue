<template>
  <div class="mainscreen container-fluid">
    <nav class="navbar navbar-expand-lg">
      <a class="navbar-brand" href="#" id="logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-spotify px-0" viewBox="0 0 16 16" id="spotify">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288" />
        </svg> Spotify
      </a>

      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <button @click="logout" id="logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
              <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>

    <div class="container-fluid px-0">
      <div class="row mx-0">
        <!-- Songs Display -->
        <div class="col-sm-6 px-0">

          <div class="searchCont">
            <form @submit.prevent="searchSong">
              <div class="mb-3 d-flex">
                <input type="text" v-model="searchInput" placeholder=" What do you want to play?" class="form-control" id="searchBar" aria-describedby="emailHelp" autocomplete="off">
                <!-- <button type="submit" class="btn" id="searchButton">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                  </svg>
                </button> -->
              </div>
            </form>
            <!-- <button @click="clearSearchResults">Clear Results</button> -->
          </div>

          <div id="results">
              <!-- <div v-if="!Iframe">
                <h3>Search for songs in the search box</h3>
              </div>
              <div v-else> -->
                <div v-for="track in tracks" :key="track.id" id="individualTrack">
                  <iframe
                    :src="'https://open.spotify.com/embed/track/' + track.id + '?utm_source=generator'"
                    style="border-radius: 12px"
                    width="100%"
                    height="80"
                    frameborder="0"
                    allowfullscreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  >                               
                </iframe>
                <button type="submit" @click="shareSong(track.id)" id="shareButton">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16" id="share">
                    <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"/>
                  </svg> Share
                </button> 
                </div>
              </div>
            <!-- </div> -->
          </div>

        <!-- Chat System -->
        <div class="col-sm-6 px-0">
          <div v-if="loggedIn">
            <div class="p-3">
              <h2 class="text-light">Chat</h2>
            </div>
            
            <div class="messCont" ref="chatContainer">
              <div v-for="msg in messages" :key="msg.id">
                <div class="bg">
                  <div class="chtms" id="textCont">
                    <span v-if="isIframe(msg.message)">
                      <p class="uname d-flex fw-semibold">{{ msg.username }}<p class="sentTrack fw-lighter">Sent a track</p></p> 
                      <span v-html="msg.message" id="iframeMsg"></span>
                    </span>
                    <span v-else>
                      <p class="sentMsg d-flex fw-semibold">{{ msg.username }}: <p class="sentTrack fw-lighter"> {{ msg.message }}</p></p>
                    </span>
                  </div>
                </div>
              </div>
             
            </div>
            
            <div class="bg2">
              <form id="textfield" @submit.prevent="sendMessage">
                <div class="mb-3" id="messageInput">
                  <input v-model="newMessage" type="text" placeholder="Type your message..." @keyup.enter="sendMessage" class="form-control" id="chat" aria-describedby="emailHelp" autocomplete="off">
                </div>
              </form>

</div>
            <!-- <input v-model="newMessage" type="text" placeholder="Type your message..." @keyup.enter="sendMessage" id="messageInput"> -->
            
          </div>
        </div>

      </div>
    </div>
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
                this.scrollToBottom();
              }
            });

            this.fetchMessages().then(() => {
              this.scrollToBottom();
            });
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
      },

      scrollToBottom() {
        this.$nextTick(() => {
          const container = this.$refs.chatContainer;
          container.scrollTop = container.scrollHeight;
        });
      }
    }
    
  };
  </script>

<style scoped>
  .mainscreen {
    max-width: 100%;
    width: 1280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    /* border: 2px solid red; */
    margin-top: -4px;
  }

  nav{
    background-color: #121212;
    /* border: 1px solid green; */
  }

  .row {
    width: 100%;
    margin: 0 auto;
  }

  .navbar {
    width: 100%;
    margin-bottom: 20px;
  }

  .navbar .navbar-brand,
  .navbar .navbar-nav,
  .navbar .form-control,
  .navbar .btn {
    width: auto;
  }

  #results {
    width: 100%;
    margin-top: -20px;
    max-height: 721px; /* Set the desired maximum height */
    overflow-y: auto; /* Enable vertical scrolling */
    padding-left: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-right: 0.25rem;
  }

  #results iframe {
    max-width: 100%;
    width: 768px;
    height: 80px;
    border-radius: 12px;
    margin-top: -10px;
  }

  #logout{
    background: none;
    border: none;
    color:white;
  }

  #logout:hover{
    background: none;
    border: none;
    color:#1db954;
  }

  /* #spotify{
    color:#1db954;
  } */

  .navbar-brand{
    color:white;
  }

  .navbar-brand:hover{
    color:#1db954;
    background: none;
  }

  /* .col-sm-6{
    border: 1px solid aqua;
  } */

  .searchCont{
    padding: 15px;
  }

  #individualTrack{
    padding-bottom: 35px;
  }

  /* #searchButton{
    margin-left: 12px;
    border: 1px solid #1db954;
    color: #1db954;
  }

  #searchButton:hover{
    margin-left: 12px;
    border: 1px solid #1db954;
    background-color: #1db954;
    color: white;
  } */
  #searchBar::placeholder {
  /* font-family: "Font Awesome 5 Free"; */
  /* font-weight: 900; */
  font-size: 1rem;
  padding-left: 1.5rem;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='%23adb5bd' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 0.1rem center;
  background-size: 1rem;
  color: gray;
  }

  .input, #searchBar {
  /* font-family: "Font Awesome 5 Free"; */
  /* font-weight: 900; */
    background-color: #212121;
    border: 1px solid #212121;
  }

  .input, #searchBar:focus {
  /* font-family: "Font Awesome 5 Free"; */
  /* font-weight: 900; */
    box-shadow: none !important;
    border: 1px solid white;
    color: white;
  }

    /* Custom Scrollbar Styles */
    #results::-webkit-scrollbar {
    width: 12px; /* Width of the scrollbar */
  }

  #results::-webkit-scrollbar-track {
    background: #121212; /* Background color of the scrollbar track */
  }

  #results::-webkit-scrollbar-thumb {
    background-color: #212121; /* Color of the scrollbar thumb */
    border-radius: 10px; /* Rounded corners for the scrollbar thumb */
    border: 3px solid #121212; /* Space around the scrollbar thumb */
  }

  #results::-webkit-scrollbar-thumb:hover {
    background-color: #535353; /* Color of the scrollbar thumb when hovered */
  }

   /* Custom Scrollbar Styles */
   .messCont::-webkit-scrollbar {
    width: 12px; /* Width of the scrollbar */
  }

  .messCont::-webkit-scrollbar-track {
    background: #121212; /* Background color of the scrollbar track */
  }

  .messCont::-webkit-scrollbar-thumb {
    background-color: #212121; /* Color of the scrollbar thumb */
    border-radius: 10px; /* Rounded corners for the scrollbar thumb */
    border: 3px solid #121212; /* Space around the scrollbar thumb */
  }

  .messCont::-webkit-scrollbar-thumb:hover {
    background-color: #535353; /* Color of the scrollbar thumb when hovered */
  }
  
  #share{
    padding-right: 5px;
  }

  #shareButton{
    background: none;
    border: none;
    color: white;
  }

  #shareButton:hover{
    color: #1db954;
  }

  .uname{
    color: white;
    font-size: medium; 
    margin-bottom: -5px;
  }

  .sentTrack{
    font-size: medium;
    padding-left: 4px;
  }

  .sentMsg{
    color: white;
    font-size: medium; 
    font-weight: light;
    margin-bottom: 5x;
  }

  #textCont{
    /* border: 1px solid red; */
    padding: 10px;
  }

  #iframeMsg{
    padding: 0px;
  }

  #messageInput{
    /* border: 1px solid red; */
    margin-top: 50px;
    color: gray;
  }

  #textfield{
    padding-left: 4px;
    padding-right: 4px;
    width: 560px; /* Optional: adjust as needed */
    /* padding-bottom: 1px; */
  }

  .messCont{
    padding: 15px;
    max-height: 638px; /* Adjust the maximum height as needed */
    overflow-y: auto;
    margin-top: -20px;
  }

  .bg{
    background-color: 	#212121;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    margin-top: 10px;
  }

  .bg2 {
  /* background-color: #212121; */
  /* width: 100%; */
  border-radius: 10px;

  display: flex;
  justify-content: center; 
  align-items: center; 
}


.form-control {
  width: 100%;
  max-width: 1000px; /* Optional: Set a max-width for better appearance */
  box-sizing: border-box; /* Ensure padding is included in the width */
}

  #chat {
    width: 542px;
  }

  @media (max-width: 768px) {
    .mainscreen {
    max-width: 100%;
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    /* border: 2px solid red; */
    margin-top: -24px;
    }

    .navbar {
      width: 100%;
    }

    .form-control {
      width: auto;
    }

    #results iframe {
      width: 100%;
    }

    .btn {
      width: auto;
    }

    #searchBar{
      width: 100%;
    }

    #chat{
      width: 100%;
    }

    #textfield{
    padding-left: 16px;
    padding-right: 16px;
    width: 800px; /* Optional: adjust as needed */
    /* padding-bottom: 1px; */
  }
  }
</style>
