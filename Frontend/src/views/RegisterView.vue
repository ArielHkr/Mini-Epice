<template>
  <main class="auth-page">
    <section class="auth-card">
      <RouterLink to="/items" class="auth-link">
        ← Back to items
      </RouterLink>

      <header class="auth-header">
        <p class="auth-brand">MINI-ÉPICE</p>
        <h1>Create an account</h1>
        <p>Enter your details to get started.</p>
      </header>

      <form novalidate @submit.prevent="submitForm">
        <fieldset :disabled="isLoading" class="auth-fields">
          <legend class="auth-legend">Account information</legend>

          <div class="auth-field">
            <label for="name">Name</label>
            <input
              id="name"
              v-model.trim="name"
              type="text"
              autocomplete="name"
              aria-required="true"
            />
          </div>

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
              autocomplete="new-password"
              aria-required="true"
            />
          </div>

          <div class="auth-field">
            <label for="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
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
            {{ isLoading ? "Creating account..." : "Create account" }}
          </button>
        </fieldset>
      </form>

      <p class="auth-footer">
        Already have an account?
        <RouterLink to="/login" class="auth-link">
          Log in
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

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const formError = ref("");

function validateForm() {
  formError.value = "";

  if (!name.value.trim()) {
    formError.value = "Name is required.";
  } else if (!email.value.includes("@")) {
    formError.value = "A valid email is required.";
  } else if (password.value.length < 8) {
    formError.value = "Password must contain at least 8 characters.";
  } else if (new TextEncoder().encode(password.value).length > 72) {
    formError.value = "Password is too long.";
  } else if (password.value !== confirmPassword.value) {
    formError.value = "Passwords do not match.";
  }

  return formError.value === "";
}

async function submitForm() {
  if (isLoading.value) return;

  authStore.errorMessage = "";

  if (!validateForm()) return;

  const success = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value,
  });

  if (!success) return;

  await router.push("/login");

  toast.success("Account created successfully!", {
    description: "You can now log in.",
    duration: 3500,
  });
}

onMounted(() => {
  authStore.errorMessage = "";
});
</script>

<style scoped src="../assets/styles/auth.css"></style>