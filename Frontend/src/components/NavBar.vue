<template>
  <nav class="navbar" aria-label="Main navigation">
    <div class="navbar-content">
      <RouterLink to="/items" class="navbar-brand">
        MINI-ÉPICE
      </RouterLink>

      <div class="navbar-actions">
        <RouterLink
          v-if="authStore.isAdmin"
          to="/items/add"
          class="navbar-add"
        >
          + Add item
        </RouterLink>

        <details
          ref="accountMenu"
          class="account-dropdown"
          @keydown.esc="closeAccountMenu"
        >
          <summary class="account-toggle">
            {{
              authStore.isAuthenticated
                ? authStore.user?.name
                : "Account"
            }}
            <span aria-hidden="true">▾</span>
          </summary>

          <div class="account-menu">
            <template v-if="!authStore.isAuthenticated">
              <RouterLink to="/login" class="account-option">
                Log in
              </RouterLink>

              <RouterLink to="/register" class="account-option">
                Register
              </RouterLink>
            </template>

            <button
              v-else
              type="button"
              class="account-option"
              @click="logout"
            >
              Log out
            </button>
          </div>
        </details>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useAuthStore } from "../stores/authStore.mjs";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const accountMenu = ref(null);

function closeAccountMenu() {
  if (!accountMenu.value) return;

  accountMenu.value.open = false;
  accountMenu.value.querySelector("summary")?.focus();
}

async function logout() {
  closeAccountMenu();
  authStore.logout();
  toast.dismiss("delete-item-confirmation");

  await router.push("/items");

  toast.success("Logged out successfully!");
}

watch(
  () => route.fullPath,
  () => {
    if (accountMenu.value) {
      accountMenu.value.open = false;
    }
  }
);
</script>

<style scoped src="../assets/styles/navbar.css"></style>