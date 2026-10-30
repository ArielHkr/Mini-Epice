<template>
  <main class="error-page">
    <section class="error-card" aria-labelledby="error-title">
      <p class="error-code">{{ code }}</p>

      <h1 id="error-title">{{ title }}</h1>
      <p class="error-description">{{ message }}</p>

      <RouterLink to="/items" class="error-button">
        Back to items
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";

defineProps({
  code: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
</script>

<style scoped src="../assets/styles/error.css"></style>