// 本番環境用のエントリポイント
// Vue 2互換性のために従来の方法でアプリを初期化します
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.min.js';
import VueRouter from 'https://cdn.jsdelivr.net/npm/vue-router@3.5.3/dist/vue-router.esm.browser.min.js';

// コンポーネントの読み込み
import { variables } from './variables.js';

// グローバルコンポーネントの登録
Vue.use(VueRouter);

// ルーター設定
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: home },
    { path: '/company', component: company, meta: { requiresAuth: true } },
    { path: '/item', component: item, meta: { requiresAuth: true } },
    { path: '/category', component: category, meta: { requiresAuth: true } },
    { path: '/login', component: login }
  ]
});

// 認証ガード
router.beforeEach((to, from, next) => {
  const isAuthenticated = variables.isAuthenticated();
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

// アプリの初期化
new Vue({
  el: '#app',
  router,
  data: {
    isAuthenticated: variables.isAuthenticated()
  },
  methods: {
    checkAuth() {
      this.isAuthenticated = variables.isAuthenticated();
    }
  },
  created() {
    // ログイン状態変化を監視
    window.addEventListener('storage', this.checkAuth);
  },
  destroyed() {
    window.removeEventListener('storage', this.checkAuth);
  }
});