

<template>
  <main>
    <h1>Items</h1>

    <p v-if="isLoading">Loading items...</p>

    <p v-else-if="errorMessage" role="alert">
      {{ errorMessage }}
    </p>

    <p v-else-if="items.length === 0">No items found.</p>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Unit price</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ Number(item.unitPrice).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useItemStore } from "./stores/itemStore.mjs";

const itemStore = useItemStore();

const { items, errorMessage, isLoading } = storeToRefs(itemStore);

onMounted(() => {
  itemStore.loadItems();
});
</script>
