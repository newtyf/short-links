<template>
  <div>
    <h1>
    App Base
    </h1>
    <nav v-if="!userStore.loadingSession">
      <router-link v-if="userStore.userData" to="/">Home</router-link> |
      <router-link to="/login" v-if="!userStore.userData">Login</router-link> |
      <router-link to="/register" v-if="!userStore.userData">Register</router-link> |
      <button v-if="userStore.userData" @click="userStore.logOutUser">Log Out</button>
    </nav>
    <div v-else>
      Loading...
    </div>
  </div>
  <router-view></router-view>
</template>

<script setup>
import { useUserStore } from './stores/user';

  const userStore = useUserStore();

</script>