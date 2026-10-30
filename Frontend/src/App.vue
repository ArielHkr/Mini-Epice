
<script setup>
import NavBar from "./components/NavBar.vue";

import { RouterView } from "vue-router";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
</script>

<template>
  <NavBar/>
  <RouterView />
  <Toaster
    position="top-right"
    richColors
    closeButton
    :duration="3500"
  />
</template>
