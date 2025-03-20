const routes = [
    { path: '/', component: home },
    { path: '/home', component: home },
    { path: '/login', component: login },
    { 
        path: '/item', 
        component: item,
        meta: { requiresAuth: true }
    },
    { 
        path: '/company', 
        component: company,
        meta: { requiresAuth: true }
    }
]

const router = new VueRouter({
    routes
})

// ナビゲーションガード
router.beforeEach((to, from, next) => {
    // 認証が必要なルートかチェック
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // 認証状態をチェック
        if (!variables.isAuthenticated()) {
            // 未認証の場合はログインページにリダイレクト
            next({ path: '/login' });
        } else {
            // 認証済みの場合は次に進む
            next();
        }
    } else {
        // 認証が不要なルートの場合は次に進む
        next();
    }
});

const app = new Vue({
    router,
    data: {
        isAuthenticated: false
    },
    created() {
        this.isAuthenticated = variables.isAuthenticated();
    }
}).$mount('#app')
