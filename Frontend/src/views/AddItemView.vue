

<template>
  <main class="page">
    <div class="form-container">
      <header class="page-header">
        <RouterLink to="/items" class="back-link">
          ← Back to items
        </RouterLink>

        <p class="brand">MINI-ÉPICE</p>
        <h1 class="page-title">Add an item</h1>
        <p class="page-description">
          Enter the details of your new inventory item.
        </p>
      </header>

      <form class="item-form" @submit.prevent="submitItem">
        <fieldset :disabled="isSaving" class="form-fieldset">
          <legend class="form-title">Item information</legend>

          <div class="form-content">
            <div class="form-group">
              <label for="name">
                Name <span class="required">*</span>
              </label>

              <input
                id="name"
                v-model.trim="name"
                type="text"
                placeholder="e.g. Rice, Sugar, Flour..."
                autocomplete="off"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="quantity">
                  Quantity <span class="required">*</span>
                </label>

                <input
                  id="quantity"
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  step="any"
                  required
                />
              </div>

              <div class="form-group">
                <label for="unit-price">
                  Unit price <span class="required">*</span>
                </label>

                <input
                  id="unit-price"
                  v-model.number="unitPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div class="form-actions">
              <RouterLink to="/items" class="btn-cancel">
                Cancel
              </RouterLink>

              <button type="submit" class="btn-submit">
                {{ isSaving ? "Saving..." : "+ Add item" }}
              </button>
            </div>
          </div>
        </fieldset>

        <p v-if="saveError" class="error-message" role="alert">
          {{ saveError }}
        </p>
      </form>
    </div>
  </main>
</template>

<style scoped src="../assets/styles/addItem.css"></style>


<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useItemStore } from "../stores/itemStore.mjs";

const router = useRouter();
const itemStore = useItemStore();

const { isSaving, saveError } = storeToRefs(itemStore);

const name = ref("");
const quantity = ref(1);
const unitPrice = ref("");

async function submitItem() {
  const success = await itemStore.addItem({
    name: name.value,
    quantity: quantity.value,
    unitPrice: unitPrice.value,
  });

  if (!success) return;

  await router.push("/items");

  toast.success("Item added successfully!", {
    description: `${name.value} has been added to your inventory.`,
    duration: 3500,
  });
}

onMounted(() => {
  itemStore.saveError = "";
});
</script>
