<template>
    <div class="auth-content" v-on:keyup.enter="buttonKey">
        <div class="auth-modal">
            <img src="@/assets/logo.png" width="200" alt="Logo">
            <hr>
            <div class="auth-title">{{ showSignup ? 'Register' : 'Login' }}</div>

            <input v-if="showSignup" v-model="user.name" type="text" placeholder="Name">
            <input v-model="user.email" name="email" type="text" placeholder="E-mail">
            <input v-model="user.password" name="password" type="password" placeholder="Password">
            <input v-if="showSignup" v-model="user.confirmPassword" type="password" 
                placeholder="Confirm the Password">

            <b-button v-if="showSignup" @click="signup" variant="primary">Register</b-button>
            <b-button v-else @click="signin" variant="primary" >Sign in</b-button>

            <a href @click.prevent="showSignup = !showSignup">
                <span v-if="showSignup">Already registered? Log in!</span>
                <span v-else>Don't have a record? Register here!</span>
            </a>
        </div>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global"
import axios from "axios"

export default {
  name: "Auth",
  data: function() {
    return {
      showSignup: false,
      user: {},
    }
  },
  methods: {
    signin() {
      axios
        .post(`${baseApiUrl}/signin`, this.user)
        .then((res) => {
          this.$store.commit("setUser", res.data)
          localStorage.setItem(userKey, JSON.stringify(res.data))
          this.$router.push({ path: "/" })
        })
        .catch(showError)
    },
    signup() {
      axios
        .post(`${baseApiUrl}/signup`, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.user = {}
          this.showSignup = false
        })
        .catch(showError)
    },
    buttonKey() {
      if (this.showSignup) {
        this.signup()
      } else {
        this.signin()
      }
    },
  },
}
</script>

<style>
.auth-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.auth-modal {
  background-color: #fff;
  width: 350px;
  padding: 35px;
  border-radius: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);

  display: flex;
  flex-direction: column;
  align-items: center;
}
.auth-title {
  font-size: 1.2rem;
  font-weight: 100;
  margin-top: 10px;
  margin-bottom: 15px;
}
.auth-modal input {
  border: 1px solid rgb(218, 218, 218);
  width: 100%;
  margin-bottom: 15px;
  padding: 7px 15px;
  outline: none;
  border-radius: 3px;
}
.auth-modal button {
  align-self: flex-end;
  background-color: #055fb9;
  color: #fff;
  padding: 5px 15px;
  border: none;
  border-radius: 3px;
}
.auth-modal a {
  margin-top: 35px;
}
.auth-modal hr {
  border: 0;
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(120, 120, 120, 0),
    rgba(120, 120, 120, 0.25),
    rgba(120, 120, 120, 0)
  );
}
</style>
