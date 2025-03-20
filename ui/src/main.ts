import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Company from './views/Company.vue';
import Item from './views/Item.vue';
import Category from './views/Category.vue';
import { useAuth } from './composables/useApi';

// ルート定義
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/login', component: Login },
  { 
    path: '/company', 
    component: Company,
    meta: { requiresAuth: true }
  },
  { 
    path: '/item', 
    component: Item,
    meta: { requiresAuth: true }
  },
  { 
    path: '/category', 
    component: Category,
    meta: { requiresAuth: true }
  }
];

// ルーターの作成
const router = createRouter({
  history: createWebHistory(),
  routes
});

// ナビゲーションガード
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login');
  } else {
    next();
  }
});

// Vueアプリケーションの作成とマウント
const app = createApp(App);
app.use(router);
app.mount('#app');