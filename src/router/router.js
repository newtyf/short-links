import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";
import { useDatabaseStore } from "../stores/database";

import Home from "../views/Home.vue";
import Editar from "../views/Editar.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Perfil from "../views/Perfil.vue";
import NotFound from "../views/NotFound.vue";

const requireAuth = async (to, from, next) => {
  const userStore = useUserStore();
  userStore.loadingSession = true;
  const user = await userStore.currentUser();
  if (user) {
    next();
  } else {
    next("/login");
  }
  userStore.loadingSession = false;
};

const redirectURL = async (to, from, next) => {
  const userStore = useUserStore();
  userStore.loadingSession = true;
  const databaseStore = useDatabaseStore()
  //console.log(to.params.pathMatch[0]);
  const res = await databaseStore.getURL(to.params.pathMatch[0])
  if (!res) {
    userStore.loadingSession = false;
    next();
  } else {
    userStore.loadingSession = true;
    window.location.href = res
    next()
  }

};

const routes = [
  { path: "/", component: Home, beforeEnter: requireAuth, name: "home" },
  {
    path: "/editar/:id",
    component: Editar,
    beforeEnter: requireAuth,
    name: "editar",
  },
  {
    path: "/perfil",
    component: Perfil,
    beforeEnter: requireAuth,
    name: "perfil",
  },
  { path: "/login", component: Login, name: "login" },
  { path: "/register", component: Register, name: "register" },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
    name: "404",
    beforeEnter: redirectURL,
  },
  // /:pathMatch(.*)* ----> esta expresion es para todas las paginas que no coincidan con los paths establecidos anteriormente
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
