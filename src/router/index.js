// index.js

import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import AuthView from "@/views/AuthView.vue";
import FullLayout from "@/layouts/full/FullLayout.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    { path: "/", name: "Login", component: LoginView },
    { path: "/register", name: "Register", component: AuthView },
    {
      path: "/",
      component: FullLayout,
      children: [
        {
          name: "Dashboard",
          path: "dashboard",
          component: Dashboard,
        },
        // Additional routes...
        {
          name: "Alerts",
          path: "ui-components/alert",
          component: () => import("@/views/ui-components/Alerts.vue"),
        },
        {
          name: "Buttons",
          path: "ui-components/buttons",
          component: () => import("@/views/ui-components/Buttons.vue"),
        },
        {
          name: "Cards",
          path: "ui-components/cards",
          component: () => import("@/views/ui-components/Cards.vue"),
        },
        {
          name: "Menus",
          path: "ui-components/menus",
          component: () => import("@/views/ui-components/Menus.vue"),
        },
        {
          name: "Tables",
          path: "ui-components/tables",
          component: () => import("@/views/ui-components/Tables.vue"),
        },
      ],
    },
  ],
});

export default router;
