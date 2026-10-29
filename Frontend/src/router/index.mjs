import { createRouter, createWebHistory } from "vue-router";
import ItemsView from "../views/ItemsView.vue";
import AddItemView from "../views/AddItemView.vue";
import EditItemView from "../views/EditItemView.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/items",
    },
    {
      path: "/items",
      component: ItemsView,
    },
    {
      path: "/items/add",
      component: AddItemView,
    },
    {
  path: "/items/:id/edit",
  component: EditItemView,
},
  ],
});

export default router;