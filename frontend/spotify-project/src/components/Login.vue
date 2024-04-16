<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Username" required>
        <input v-model="password" type="password" placeholder="Password" required>
        <button type="submit">Login</button>
        <button @click="register">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      login() {
        axios.post('/api/login', {
          username: this.username,
          password: this.password
        }).then(response => {
          localStorage.setItem('authToken', response.data.token);
          this.$router.push('/dashboard');
        }).catch(error => {
          alert(error.response.data.error || 'Failed to login');
        });
      }
    },
    setup(){
        const router = useRouter();

        const register = () => {
            router.push('/register');
        };

        return {
            register
        };
    }
  };
  </script>

<style scoped>

</style>