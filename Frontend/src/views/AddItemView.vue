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

      <form class="item-form" novalidate @submit.prevent="submitItem">
        <fieldset :disabled="isSaving" class="form-fieldset">
          <legend class="form-title">Item information</legend>

          <div class="form-content">
            <div class="form-group">
              <label for="name">
                Name <span class="required" aria-hidden="true">*</span>
              </label>

              <input
                id="name"
                v-model.trim="name"
                type="text"
                placeholder="e.g. Rice, Sugar, Flour..."
                autocomplete="off"
                aria-required="true"
                :class="{ 'input-error': errors.name }"
                :aria-invalid="Boolean(errors.name)"
                :aria-describedby="errors.name ? 'name-error' : undefined"
                @input="errors.name = ''"
              />

              <p
                v-if="errors.name"
                id="name-error"
                class="field-error"
                role="alert"
              >
                {{ errors.name }}
              </p>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="quantity">
                  Quantity <span class="required" aria-hidden="true">*</span>
                </label>

                <input
                  id="quantity"
                  v-model.number="quantity"
                  type="number"
                  step="any"
                  aria-required="true"
                  :class="{ 'input-error': errors.quantity }"
                  :aria-invalid="Boolean(errors.quantity)"
                  :aria-describedby="errors.quantity ? 'quantity-error' : undefined"
                  @input="errors.quantity = ''"
                />

                <p
                  v-if="errors.quantity"
                  id="quantity-error"
                  class="field-error"
                  role="alert"
                >
                  {{ errors.quantity }}
                </p>
              </div>

              <div class="form-group">
                <label for="unit-price">
                  Unit price <span class="required" aria-hidden="true">*</span>
                </label>

                <input
                  id="unit-price"
                  v-model.number="unitPrice"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  aria-required="true"
                  :class="{ 'input-error': errors.unitPrice }"
                  :aria-invalid="Boolean(errors.unitPrice)"
                  :aria-describedby="errors.unitPrice ? 'price-error' : undefined"
                  @input="errors.unitPrice = ''"
                />

                <p
                  v-if="errors.unitPrice"
                  id="price-error"
                  class="field-error"
                  role="alert"
                >
                  {{ errors.unitPrice }}
                </p>
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

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useItemStore } from "../stores/itemStore.mjs";

const router = useRouter();
const itemStore = useItemStore();

const { isSaving, saveError } = storeToRefs(itemStore);

const name = ref("");
const quantity = ref(1);
const unitPrice = ref("");

const errors = ref({
  name: "",
  quantity: "",
  unitPrice: "",
});

function validateForm() {
  errors.value = {
    name: "",
    quantity: "",
    unitPrice: "",
  };

  if (name.value.trim() === "") {
    errors.value.name = "Name must not be empty.";
  }

  if (!Number.isFinite(quantity.value) || quantity.value < 1) {
    errors.value.quantity = "Quantity must be a number greater than or equal to 1.";
  }

  if (!Number.isFinite(unitPrice.value) || unitPrice.value <= 0) {
    errors.value.unitPrice = "Unit price must be a number greater than 0.";
  }

  return (
    errors.value.name === "" &&
    errors.value.quantity === "" &&
    errors.value.unitPrice === ""
  );
}

async function submitItem() {
  if (isSaving.value) return;

  itemStore.saveError = "";

  if (!validateForm()) return;

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

<style scoped src="../assets/styles/addItem.css"></style>