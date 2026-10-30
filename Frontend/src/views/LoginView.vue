<template>
  <main class="auth-page">
    <section class="auth-card">
      <RouterLink to="/items" class="auth-link">
        ← Back to items
      </RouterLink>

      <header class="auth-header">
        <p class="auth-brand">MINI-ÉPICE</p>
        <h1>Log in</h1>
        <p>Enter your email and password.</p>
      </header>

      <form novalidate @submit.prevent="submitForm">
        <fieldset :disabled="isLoading" class="auth-fields">
          <legend class="auth-legend">Login information</legend>

          <div class="auth-field">
            <label for="email">Email</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              autocomplete="email"
              aria-required="true"
            />
          </div>

          <div class="auth-field">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              aria-required="true"
            />
          </div>

          <p
            v-if="formError || errorMessage"
            class="auth-error"
            role="alert"
          >
            {{ formError || errorMessage }}
          </p>

          <button type="submit" class="auth-button">
            {{ isLoading ? "Logging in..." : "Log in" }}
          </button>
        </fieldset>
      </form>

      <p class="auth-footer">
        Don't have an account?
        <RouterLink to="/register" class="auth-link">
          Create an account
        </RouterLink>
      </p>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useAuthStore } from "../stores/authStore.mjs";

const router = useRouter();
const authStore = useAuthStore();
const { isLoading, errorMessage } = storeToRefs(authStore);

const email = ref("");
const password = ref("");
const formError = ref("");

function validateForm() {
  formError.value = "";

  if (!email.value.trim()) {
    formError.value = "Email is required.";
  } else if (!password.value) {
    formError.value = "Password is required.";
  }

  return formError.value === "";
}

async function submitForm() {
  if (isLoading.value) return;

  authStore.errorMessage = "";

  if (!validateForm()) return;

  const success = await authStore.login({
    email: email.value,
    password: password.value,
  });

  if (!success) return;

  await router.push("/items");

  toast.success("Logged in successfully!", {
    duration: 3500,
  });
}

onMounted(() => {
  authStore.errorMessage = "";
});
</script>

<style scoped src="../assets/styles/auth.css"></style>