import { ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore.mjs";

const Url ="http://localhost:3000/api"
export const useItemStore = defineStore("items", () => {
  const items = ref([]);
  const errorMessage = ref("");
  const isLoading = ref(false);
  const isSaving = ref(false);
  const saveError = ref("");
  const deletingId = ref(null);
  const deleteError = ref("");
  const authStore = useAuthStore();
  async function addItem(item) {
  if (isSaving.value) return false;

  isSaving.value = true;
  saveError.value = "";

  try {
    const response = await fetch(Url+"/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${authStore.token}`,
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
async function getItemById(id) {
  const response = await fetch(`${Url}/items/${id}`);

  if (response.status === 404) {
    throw new Error("Item not found.");
  }

  if (!response.ok) {
    throw new Error("Unable to retrieve the item.");
  }

  return response.json();
}

async function updateItem(id, item) {
  if (isSaving.value) return false;

  isSaving.value = true;
  saveError.value = "";

  try {
    const response = await fetch(`${Url}/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,

      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error("Unable to update the item.");
    }

    const updatedItem = await response.json();

    const index = items.value.findIndex(
      (item) => item.id === updatedItem.id
    );

    if (index !== -1) {
      items.value[index] = updatedItem;
    }

    return true;
  } catch (error) {
    saveError.value = error.message;
    return false;
  } finally {
    isSaving.value = false;
  }
}

async function deleteItem(id) {
  if (deletingId.value !== null) return false;

  const itemId = Number(id);

  deletingId.value = itemId;
  deleteError.value = "";

  try {
    const response = await fetch(`${Url}/items/${itemId}`, {
      method: "DELETE",
      headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
    });

    if (!response.ok) {
      throw new Error("Unable to delete the item.");
    }

    items.value = items.value.filter((item) => item.id !== itemId);

    return true;
  } catch (error) {
    deleteError.value = error.message;
    return false;
  } finally {
    deletingId.value = null;
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
  getItemById,
  updateItem,
  deletingId,
  deleteError,
  deleteItem,
};
});