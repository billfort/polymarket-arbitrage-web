<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Wallet from './components/Wallet.vue'
</script>

<template>
  <header>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/trades">Trade History</RouterLink>
        <RouterLink to="/prices">Prices</RouterLink>
        <RouterLink to="/positions">Open Positions</RouterLink>
      </nav>
      <!-- <Wallet /> -->
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 16px;
  text-align: left;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
