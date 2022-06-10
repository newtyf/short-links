<template>
  <div>
    <h1>
    App Base
    </h1>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link> |
      <button>Log Out</button>
    </nav>
  </div>
  <router-view></router-view>
</template>

<script setup>

</script>