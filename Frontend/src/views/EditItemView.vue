<template>
  <section class="edit-page">
    <div class="edit-container">
      <RouterLink to="/items" class="back-link">
        ← Back to items
      </RouterLink>

      <header class="page-header">
        <h1>Edit item</h1>
        <p>Update the item's name, quantity and unit price.</p>
      </header>

      <div class="form-card">
        <p v-if="isLoading" role="status">Loading item...</p>

        <p v-else-if="loadError" role="alert" class="error-message">
          {{ loadError }}
        </p>

        <form v-else novalidate @submit.prevent="submitItem">
          <fieldset :disabled="isSaving" class="form-fields">
            <legend class="visually-hidden">Item information</legend>

            <div class="form-field">
              <label for="name">Name</label>

              <input
                id="name"
                v-model.trim="name"
                type="text"
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

            <div class="form-field">
              <label for="quantity">Quantity</label>

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

            <div class="form-field">
              <label for="unit-price">Unit price</label>

              <input
                id="unit-price"
                v-model.number="unitPrice"
                type="number"
                step="any"
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

            <button type="submit" class="save-button">
              {{ isSaving ? "Saving..." : "Save changes" }}
            </button>
          </fieldset>

          <p v-if="saveError" role="alert" class="error-message">
            {{ saveError }}
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useItemStore } from "../stores/itemStore.mjs";

const route = useRoute();
const router = useRouter();
const itemStore = useItemStore();

const { isSaving, saveError } = storeToRefs(itemStore);

const id = Number(route.params.id);
const name = ref("");
const quantity = ref(1);
const unitPrice = ref("");
const isLoading = ref(true);
const loadError = ref("");

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

async function loadItem() {
  try {
    const item = await itemStore.getItemById(id);

    name.value = item.name;
    quantity.value = Number(item.quantity);
    unitPrice.value = Number(item.unitPrice);
  } catch (error) {
    loadError.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

async function submitItem() {
  if (isSaving.value) return;

  itemStore.saveError = "";

  if (!validateForm()) return;

  const success = await itemStore.updateItem(id, {
    name: name.value,
    quantity: quantity.value,
    unitPrice: unitPrice.value,
  });

  if (!success) return;

  await router.push("/items");

  toast.success("Item updated successfully!", {
    description: `${name.value} has been updated in your inventory.`,
    duration: 3500,
  });
}

onMounted(() => {
  itemStore.saveError = "";
  loadItem();
});
</script>

<style scoped src="../assets/styles/editItem.css"></style>