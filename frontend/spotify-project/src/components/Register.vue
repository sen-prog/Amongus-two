<!-- <template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="register">
        <input v-model="username" type="text" placeholder="Username" required>
        <input v-model="password" type="password" placeholder="Password" required>
        <button type="submit">Register</button>
      </form>
    </div>
  </template> -->

<template>
  <div class="mainscreen">
    <div class="row justify-content-center">
      <div class="col text-center d-flex flex-column justify-content-center align-items-center">
        <div class="formCont text-center d-flex flex-column justify-content-center">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="bi bi-spotify" viewBox="0 0 16 16" id="spotify">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288"/>
            </svg>
          </div>    
          <h1 class="text-light fw-light" id="header">Create an Account</h1>
          <form @submit.prevent="login" class="d-flex flex-column align-items-center" id="form">
            <input  v-model="username" type="text" placeholder="Username" class="form-control mb-3" id="exampleFormControlInput1" required>
            <input  v-model="password" type="password" placeholder="Create Password" class="form-control mb-3" id="exampleFormControlInput1" required>
            <div class="d-flex flex-column d-grid gap-3 col-10 mx-auto" id="buttons">
              <button @click="register" class="btn mr-3" id="login">Create Account</button>
              <button  @click="login" class="btn" id="register">Already have an account? <strong class="fw-semibold">Log In</strong></button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
    },
    setup(){
        const router = useRouter();

        const login = () => {
            router.push('/');
        };

        return {
            login
        };
    }
  };
  </script>

<style scoped>
  .mainscreen {
    /* height: 100vh; */
    max-width: 100%;
    max-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .row {
    width: 100%;
  }

  .col {
    /* border: 2px solid red; */
    justify-content: center;
    padding: 220px;
  }

  #form {
    padding-bottom: 0px;
  }

  .form-control {
    width: 300px;
    height: 40px;
    font-size: 0.9rem;
  }

  input:focus {
    box-shadow: none !important;
    border: 3px solid #1db954;
  }

  .logo {
    padding-bottom: 5px;
  }

  #header {
    padding-bottom: 10px;
    font-size: 1.8rem;
  }

  .formCont {
    background-color: #212121;
    width: 400px;
    height: 400px;
    border-radius: 20px;
  }

  #buttons {
    padding-top: 0px;
  }

  .btn {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  #login {
    color: white;
    border: 1px solid white;
  }

  #login:hover {
    color: #212121;
    border: 1px solid white;
    background-color: white;
  }

  #spotify {
    color: #1db954;
  }

  #register {
    background-color: none;
    color: white;
    padding-top: 15px;
  }
  #register:hover {
    color: #1db954;
  }

  #register:focus {
    border: none;
  }

  @media (min-width: 768px) {
    .formCont {
      width: 480px;
      height: 450px;
    }

    .form-control {
      width: 400px;
      height: 45px;
      font-size: 1rem;
    }

    #header {
      font-size: 2rem;
    }

    .btn {
      font-size: 1rem;
      padding: 0.75rem 1.5rem;
    }
  }

  @media (max-width: 767px) {
    .form-control {
    width: 336px;
    height: 40px;
    font-size: 0.9rem;
    }
  }
</style>
  