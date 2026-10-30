<template>
  <main class="page">
    <div class="page-content">
      <header class="page-header">
  <div>
    <h1 class="page-title">Items</h1>
    <p class="page-description">
      Keep track of your items, quantities and prices.
    </p>
  </div>
</header>

      <section class="items-card">
        <header class="card-header">
          <h2>All items</h2>

          <span
            v-if="!isLoading && !errorMessage"
            class="items-count"
          >
            {{ items.length }}
          </span>
        </header>

        <div v-if="isLoading" class="state-container" role="status">
          <div class="loading-spinner" aria-hidden="true"></div>
          <p>Loading items...</p>
        </div>

        <div v-else-if="errorMessage" class="error-container">
          <div class="error-box" role="alert">
            <h3>Unable to load items</h3>
            <p>{{ errorMessage }}</p>

            <button
              type="button"
              class="btn-retry"
              @click="loadItems"
            >
              Try again
            </button>
          </div>
        </div>

        <div v-else-if="items.length === 0" class="empty-state">
          <h3>Your list is empty</h3>

          <template v-if="authStore.isAdmin">
            <p>Add your first item to get started.</p>

            <RouterLink to="/items/add" class="empty-link">
              Add your first item →
            </RouterLink>
          </template>

          <p v-else>No items available yet.</p>
        </div>

        <div v-else class="table-container">
          <table class="items-table">
            <caption class="sr-only">
              Items with their quantities and unit prices
            </caption>

            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col" class="text-center">Quantity</th>
                <th scope="col" class="text-right">Unit price</th>
                <th
                  v-if="authStore.isAdmin"
                  scope="col"
                  class="actions-column"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <div class="item-info">
                    <span class="item-avatar" aria-hidden="true">
                      {{ getInitial(item.name) }}
                    </span>

                    <span class="item-name">
                      {{ item.name }}
                    </span>
                  </div>
                </td>

                <td class="text-center">
                  <span class="item-quantity">
                    {{ item.quantity }}
                  </span>
                </td>

                <td class="item-price">
                  {{ formatPrice(item.unitPrice) }}
                </td>

                <td v-if="authStore.isAdmin">
                  <div class="item-actions">
                    <button
                      :id="`actions-trigger-${item.id}`"
                      type="button"
                      class="actions-trigger"
                      :popovertarget="`actions-menu-${item.id}`"
                      :aria-label="`Actions for ${item.name}`"
                    >
                      <span aria-hidden="true">⋮</span>
                    </button>

                    <div
                      :id="`actions-menu-${item.id}`"
                      popover="auto"
                      class="actions-menu"
                      @toggle="positionMenu($event, item.id)"
                    >
                      <RouterLink
                        :to="`/items/${item.id}/edit`"
                        class="menu-option"
                        @click="closeMenu(item.id)"
                      >
                        Edit
                      </RouterLink>

                      <button
                        type="button"
                        class="menu-option menu-option-danger"
                        :disabled="deletingId !== null"
                        :aria-label="`Delete ${item.name}`"
                        @click="deleteFromMenu(item)"
                      >
                        {{
                          deletingId === item.id
                            ? "Deleting..."
                            : "Delete"
                        }}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</template>
<style scoped src="../assets/styles/items.css"></style>

<script setup>
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { useItemStore } from "../stores/itemStore.mjs";
import { onMounted, onUnmounted } from "vue";
import { toast } from "vue-sonner";
import { useAuthStore } from "../stores/authStore.mjs";

const authStore = useAuthStore();
const itemStore = useItemStore();
const { items, isLoading, errorMessage,deletingId } = storeToRefs(itemStore);
const formatPrice = (price) => Number(price).toFixed(2);
const getInitial = (name) => name.trim().charAt(0).toUpperCase();
const loadItems = () => itemStore.loadItems();

function confirmDelete(item) {
  if (deletingId.value !== null) return;

  toast("Delete this item?", {
    id: "delete-item-confirmation",
    description: `"${item.name}" will be permanently deleted. Close this message to cancel.`,
    duration: Infinity,
    closeButton: true,
    action: {
      label: "Delete",
      onClick: async () => {
        const success = await itemStore.deleteItem(item.id);

        if (!success) {
          toast.error(itemStore.deleteError);
          return;
        }

        toast.success("Item deleted successfully!", {
          description: `${item.name} has been removed from your inventory.`,
          duration: 3500,
        });
      },
    },
  });
}
function positionMenu(event, id) {
  if (event.newState !== "open") return;

  const menu = event.currentTarget;
  const trigger = document.getElementById(`actions-trigger-${id}`);

  const buttonRect = trigger.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const gap = 8;

  const left = Math.max(
    gap,
    Math.min(
      buttonRect.right - menuRect.width,
      window.innerWidth - menuRect.width - gap
    )
  );

  const fitsBelow =
    buttonRect.bottom + gap + menuRect.height <= window.innerHeight;

  const top = fitsBelow
    ? buttonRect.bottom + gap
    : buttonRect.top - menuRect.height - gap;

  menu.style.left = `${left}px`;
  menu.style.top = `${Math.max(gap, top)}px`;
}

function closeMenu(id) {
  document.getElementById(`actions-menu-${id}`)?.hidePopover();
}

function deleteFromMenu(item) {
  closeMenu(item.id);
  confirmDelete(item);
}
onUnmounted(() => {
  toast.dismiss("delete-item-confirmation");
});
onMounted(loadItems);
</script>
