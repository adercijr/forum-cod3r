<template>
    <div class="user-dropdown">
        <div class="user-button">
            <span class="d-none d-sm-block" >{{ user.name }}</span>
            <div class="user-dropdown-img">
                <Gravatar :email="user.email" alt="User" />
            </div>
            <i class="fa fa-angle-down"></i>
        </div>
        <div class="user-dropdown-content">
            <router-link to="/admin" v-if="user.admin">
                <i class="fa fa-cogs"></i> Administration
            </router-link>
            <a href @click.prevent="logout"><i class="fa fa-sign-out"></i> Sair</a>
        </div>
    </div>
</template>

<script>
import { userKey } from "@/global"
import { mapState } from "vuex"
import Gravatar from "vue-gravatar" // gera uma img aleatorio pro usuario se não tiver

export default {
  name: "UserDropdown",
  components: { Gravatar },
  computed: mapState(["user"]),
  methods: {
    logout() {
      localStorage.removeItem(userKey)
      this.$store.commit("setUser", null)
      this.$router.push({ name: "auth" })
    },
  },
}
</script>

<style>
.user-dropdown {
  height: 100%;
  position: relative;
}
.user-dropdown:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
.user-button {
  display: flex;
  align-items: center;
  color: #fff;
  font-weight: 100;
  height: 100%;
  padding: 0 20px;
}
.user-dropdown-img {
  margin: 0 10px;
}
.user-dropdown-img > img {
  height: 30px;
  border-radius: 15px;
}
.user-dropdown-content {
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  min-width: 190px;
  box-shadow: 0 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 1;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
}
.user-dropdown:hover .user-dropdown-content {
  visibility: visible;
  opacity: 1;
}
.user-dropdown-content a {
  text-decoration: none;
  padding: 10px;
  color: #000;
}
.user-dropdown-content a:hover {
  background-color: #ededed;
  text-decoration: none;
  color: #000;
}
</style>
