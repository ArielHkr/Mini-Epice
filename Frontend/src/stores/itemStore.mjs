import { ref } from "vue";
import { defineStore } from "pinia";


const Url ="http://localhost:3000/api"
export const useItemStore = defineStore("items", () => {
  const items = ref([]);
  const errorMessage = ref("");
  const isLoading = ref(false);

  async function loadItems() {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const response = await fetch(Url+"/items");

      if (!response.ok) {
        throw new Error("Unable to retrieve items.");
      }

      items.value = await response.json();
    } catch (error) {
      errorMessage.value = error.message;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    items,
    errorMessage,
    isLoading,
    loadItems,
  };
});