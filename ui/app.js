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
    },
    {
        path: '/category',
        component: category,
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
    methods: {
        checkAuthStatus() {
            this.isAuthenticated = variables.isAuthenticated();
            console.log('Root component auth status updated:', this.isAuthenticated);
        }
    },
    created() {
        // 初期認証状態を設定
        this.checkAuthStatus();
        
        // ローカルストレージの変更を監視（他のタブでのログイン/ログアウト用）
        window.addEventListener('storage', (event) => {
            if (event.key === 'access_token') {
                this.checkAuthStatus();
            }
        });
        
        // カスタムイベントを使って認証状態の変更を監視
        document.addEventListener('auth:statusChanged', this.checkAuthStatus);
    }
}).$mount('#app')
