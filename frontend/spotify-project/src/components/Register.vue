<template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="register">
        <input v-model="username" type="text" placeholder="Username" required>
        <input v-model="password" type="password" placeholder="Password" required>
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      register() {
        axios.post('/api/register', {
          username: this.username,
          password: this.password
        })
        .then(() => {
          alert('Registration successful');
          this.username = '';
          this.password = '';
          this.$router.push('/');
        })
        .catch(error => {
          alert(error.response.data.error || 'Failed to register');
        });
      }
    }
  };
  </script>

<style scoped>

</style>
  