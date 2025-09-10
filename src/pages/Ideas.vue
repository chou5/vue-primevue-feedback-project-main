<template>
  <div class="page-shell">
    <h2 class="mb-3">Ideas</h2>
    <IdeaTable :hideTitle="true" />
  </div>
</template>

<script setup>
import IdeaTable from '../components/IdeaTable.vue' // use relative path
</script>

<style scoped>
/* Wider content so the table can spread comfortably */
.page-shell {
  max-width: 1360px; /* bump to 1440px if you want even wider */
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
}
</style>
