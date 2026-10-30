import { createRouter, createWebHistory } from "vue-router";
import ItemsView from "../views/ItemsView.vue";
import AddItemView from "../views/AddItemView.vue";
import EditItemView from "../views/EditItemView.vue";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import ErrorView from "../views/ErrorView.vue";
import { useAuthStore } from "../stores/authStore.mjs";
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
    {
  path: "/forbidden",
  name: "forbidden",
  component: ErrorView,
  props: {
    code: "403",
    title: "Access denied",
    message: "You do not have permission to access this page.",
  },
},
  {
  path: "/:pathMatch(.*)*",
  name: "not-found",
  component: ErrorView,
  props: {
    code: "404",
    title: "Page not found",
    message: "The page you are looking for does not exist.",
  },
},
  ],
});
router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (
    (to.meta.requiresAuth || to.meta.requiresAdmin) &&
    !authStore.isAuthenticated
  ) {
    return "/login";
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: "forbidden" };
  }
});
export default router;