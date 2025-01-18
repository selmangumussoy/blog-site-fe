<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="logo">BlogSite</router-link>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
        <li v-if="isLoggedIn">
          <button @click="logout">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from "@/store/auth";

export default {
  computed: {
    isLoggedIn() {
      const authStore = useAuthStore();
      return !!authStore.token;
    },
  },
  methods: {
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
    },
  },
};
</script>

<style scoped>
.navbar {
  background-color: #333;
  color: white;
  padding: 10px 20px;
}
.nav-links a {
  color: white;
  margin-right: 10px;
  text-decoration: none;
}
</style>
