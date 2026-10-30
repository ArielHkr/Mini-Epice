import { computed, ref } from "vue";
import { defineStore } from "pinia";

const Url = "http://localhost:3000/api/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(
    JSON.parse(sessionStorage.getItem("user") || "null")
  );
  const token = ref(sessionStorage.getItem("token") || "");
  const isLoading = ref(false);
  const errorMessage = ref("");

  const isAuthenticated = computed(() => token.value !== "");
  const isAdmin = computed(
    () => isAuthenticated.value && user.value?.role === "admin"
  );

  async function register(userData) {
    if (isLoading.value) return false;

    isLoading.value = true;
    errorMessage.value = "";

    try {
      const response = await fetch(Url + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Unable to create the account.");
      }

      return true;
    } catch (error) {
      errorMessage.value = error.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function login(credentials) {
    if (isLoading.value) return false;

    isLoading.value = true;
    errorMessage.value = "";

    try {
      const response = await fetch(Url + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.status === 401) {
        throw new Error("Invalid email or password.");
      }

      if (!response.ok) {
        throw new Error("Unable to log in.");
      }

      const data = await response.json();

      user.value = data.user;
      token.value = data.token;

      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("token", data.token);

      return true;
    } catch (error) {
      errorMessage.value = error.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = "";
    errorMessage.value = "";

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  }

  return {
    user,
    token,
    isLoading,
    errorMessage,
    isAuthenticated,
    isAdmin,
    register,
    login,
    logout,
  };
});