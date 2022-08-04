<template>
  <a-layout>
    <a-layout-header class="header">
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys1"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item v-if="userStore.userData" key="home">
          <router-link to="/">Home</router-link>
        </a-menu-item>
        <a-menu-item v-if="userStore.userData" key="perfil">
          <router-link to="/perfil">Perfil</router-link>
        </a-menu-item>
        <a-menu-item v-if="!userStore.userData" key="login">
          <router-link to="/login">Login</router-link>
        </a-menu-item>
        <a-menu-item v-if="!userStore.userData" key="register">
          <router-link to="/register">Register</router-link>
        </a-menu-item>
        <a-menu-item v-if="userStore.userData" @click="userStore.logOutUser" id="logout">
          Log Out
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0px 50px">
      <div class="container">
        <div v-if="userStore.loadingSession">Loading...</div>
        <router-view v-else></router-view>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "./stores/user";

const userStore = useUserStore();
const route = useRoute();

const selectedKeys1 = ref([]);

watch(
  () => route.name, // => el valor a mirar
  () => {
    selectedKeys1.value = [route.name]; //==> la funcion que se ejecuta cuando cambia el valor mirado
  }
);
</script>

<style>
.container {
  background-color: #fff;
  padding: 24px 24px;
  min-height: calc(100vh - 64px);
}
.text-center {
  text-align: center;
}
#logout:hover {
  background-color: rgb(219, 52, 52);
}
</style>
