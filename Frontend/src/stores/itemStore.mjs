import { ref } from "vue";
import { defineStore } from "pinia";


const Url ="http://localhost:3000/api"
export const useItemStore = defineStore("items", () => {
  const items = ref([]);
  const errorMessage = ref("");
  const isLoading = ref(false);
  const isSaving = ref(false);
  const saveError = ref("");

  async function addItem(item) {
  if (isSaving.value) return false;

  isSaving.value = true;
  saveError.value = "";

  try {
    const response = await fetch(Url+"/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error("Unable to add the item.");
    }

    const createdItem = await response.json();
    items.value.push(createdItem);

    return true;
  } catch (error) {
    saveError.value = error.message;
    return false;
  } finally {
    isSaving.value = false;
  }
}
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
  isSaving,
  saveError,
  addItem,
};
});