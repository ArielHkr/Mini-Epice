import { createRouter, createWebHistory } from "vue-router";
import ItemsView from "../views/ItemsView.vue";
import AddItemView from "../views/AddItemView.vue";
import EditItemView from "../views/EditItemView.vue";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";

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
      meta: { requiresAdmin: true }
    },
    {
    path: "/register",
    component: RegisterView,
    },
    {
    path: "/items/:id/edit",
   component: EditItemView,
       },
       {
    path: "/login",
    component: LoginView,
    },
  ],
});

export default router;