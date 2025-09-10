<template>
  <div class="min-h-screen flex flex-column">
    <NavBar :themeLabel="themeLabel" @toggle-theme="toggleTheme" />

    <Toast />
    <ConfirmDialog />

    <main class="p-3">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import "./styles/tokens.css"
import "./styles/layout.css"
import { computed } from 'vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import NavBar from './components/NavBar.vue'
import { theme } from './main'

/* labels + toggle are passed into NavBar for clarity */
const themeLabel = computed(() => theme.get() === 'dark' ? 'Light' : 'Dark')
const toggleTheme = () => theme.toggle()
</script>

<style>
/* Ensure active route link indicator still bold */
.router-link-active { font-weight: 600; }
</style>
