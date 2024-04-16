<template>
    <div>
      <h1>Dashboard</h1>
      <p>{{ message }}</p>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        message: ''
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
    setup(){
        const router = useRouter();

        const logout = () => {
            localStorage.removeItem('authToken');
            router.push('/');
        };

        return {
            logout
        };
    }
    
  };
  </script>

<style scoped>

</style>
  