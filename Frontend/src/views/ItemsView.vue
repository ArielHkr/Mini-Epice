
<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { useItemStore } from "../stores/itemStore.mjs";

const itemStore = useItemStore();
const { items, isLoading, errorMessage } = storeToRefs(itemStore);

const loadItems = () => itemStore.loadItems();

const formatPrice = (price) => Number(price).toFixed(2);

const getInitial = (name) => name.trim().charAt(0).toUpperCase();

onMounted(loadItems);
</script>

<template>
  <main class="page">
    <div class="page-content">

      <header class="page-header">
        <div>
          <p class="brand">MINI-ÉPICE</p>
          <h1 class="page-title">Items</h1>
          <p class="page-description">
            Keep track of your items, quantities and prices.
          </p>
        </div>

        <RouterLink to="/items/add" class="btn-primary">
          <span aria-hidden="true">+</span>
          Add item
        </RouterLink>
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
          <p>Add your first item to get started.</p>

          <RouterLink to="/items/add" class="empty-link">
            Add your first item →
          </RouterLink>
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
                <th scope="col" class="actions-column">Actions</th>
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
                <td class="actions-column">
  <RouterLink :to="`/items/${item.id}/edit`" class="edit-link">
    Edit
    
  </RouterLink>
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
