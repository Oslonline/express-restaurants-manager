import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";

import App from "./App.vue";
import Dashboard from "./views/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Dashboard, meta: { title: "Dashboard - Restaurant Manager" } },
    { 
      path: "/restaurants/:id", 
      component: () => import('./views/Restaurant.vue'), 
    },
    { 
      path: "/restaurants/:rid/employees/:id", 
      component: () => import('./views/Employee.vue'), 
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

const app = createApp(App);

app.use(router);

app.mount("#app");
