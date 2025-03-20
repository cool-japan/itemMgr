const login = {
    template: `
    <div>
        <div v-if="!isAuthenticated" class="login-container">
            <h3 class="mb-4">ログイン</h3>
            <div class="alert alert-danger" v-if="error">{{ error }}</div>
            <div class="alert alert-info">
                デモアカウントを使用してログインできます：<br>
                ユーザー名: demo<br>
                パスワード: demo1234
            </div>
            <form @submit.prevent="loginUser">
                <div class="mb-3">
                    <label for="username" class="form-label">ユーザー名（demo）</label>
                    <input type="text" class="form-control" id="username" name="username" v-model="loginForm.username" required autocomplete="username">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">パスワード</label>
                    <input type="password" class="form-control" id="password" v-model="loginForm.password" required>
                </div>
                <button type="submit" class="btn btn-primary">ログイン</button>
            </form>
            <div class="mt-3">
                <a href="#" @click.prevent="showRegistrationForm = true">アカウント登録はこちら</a>
            </div>
        </div>

        <div v-if="showRegistrationForm && !isAuthenticated" class="register-container mt-4">
            <h3 class="mb-4">新規登録</h3>
            <div class="alert alert-danger" v-if="registerError">{{ registerError }}</div>
            <form @submit.prevent="registerUser">
                <div class="mb-3">
                    <label for="registerEmail" class="form-label">メールアドレス</label>
                    <input type="email" class="form-control" id="registerEmail" v-model="registerForm.email" required>
                </div>
                <div class="mb-3">
                    <label for="username" class="form-label">ユーザー名</label>
                    <input type="text" class="form-control" id="username" v-model="registerForm.username" required>
                </div>
                <div class="mb-3">
                    <label for="registerPassword" class="form-label">パスワード</label>
                    <input type="password" class="form-control" id="registerPassword" v-model="registerForm.password" required>
                </div>
                <div class="mb-3">
                    <label for="password2" class="form-label">パスワード(確認)</label>
                    <input type="password" class="form-control" id="password2" v-model="registerForm.password2" required>
                </div>
                <button type="submit" class="btn btn-success">登録</button>
                <button type="button" class="btn btn-secondary ms-2" @click="showRegistrationForm = false">キャンセル</button>
            </form>
        </div>

        <div v-if="isAuthenticated" class="profile-container">
            <h3 class="mb-4">プロフィール</h3>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">{{ userProfile.username }}</h5>
                    <p class="card-text">{{ userProfile.email }}</p>
                    <button class="btn btn-danger" @click="logout">ログアウト</button>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            isAuthenticated: false,
            loginForm: {
                username: 'demo',
                password: 'demo1234'
            },
            registerForm: {
                email: '',
                username: '',
                password: '',
                password2: ''
            },
            userProfile: { username: '', email: '' },
            error: null,
            registerError: null,
            showRegistrationForm: false
        }
    },
    created() {
        this.checkAuth();
    },
    methods: {
        checkAuth() {
            const token = localStorage.getItem('access_token');
            if (token) {
                this.isAuthenticated = true;
                this.fetchUserProfile();
            }
        },
        async loginUser() {
            this.error = null;
            console.log('ログイン試行:', this.loginForm);
            try {
                // ユーザー名とパスワードを使用
                const response = await axios.post(variables.API_URL + 'auth/login/', {
                    username: this.loginForm.username,
                    password: this.loginForm.password
                });
                
                console.log('認証成功:', response.data);
                
                if (!response.data.access) {
                    throw new Error('アクセストークンが取得できませんでした');
                }
                
                localStorage.setItem('access_token', response.data.access);
                if (response.data.refresh) {
                    localStorage.setItem('refresh_token', response.data.refresh);
                }
                
                this.isAuthenticated = true;
                
                // グローバルな認証状態の更新を通知
                document.dispatchEvent(new CustomEvent('auth:statusChanged'));
                
                try {
                    await this.fetchUserProfile();
                    // ログイン後にホームページにリダイレクト
                    this.$router.push('/home');
                } catch (profileError) {
                    console.error('プロフィール取得エラー:', profileError);
                    // プロフィール取得に失敗してもログインは成功しているので、ホームページに移動
                    this.$router.push('/home');
                }
            } catch (err) {
                console.error('認証エラー:', err.response ? err.response.data : err);
                this.error = '認証に失敗しました。メールアドレスとパスワードを確認してください。';
            }
        },
        async registerUser() {
            this.registerError = null;
            if (this.registerForm.password !== this.registerForm.password2) {
                this.registerError = 'パスワードが一致しません';
                return;
            }
            
            try {
                await axios.post(variables.API_URL + 'auth/register/', {
                    email: this.registerForm.email,
                    username: this.registerForm.username,
                    password: this.registerForm.password,
                    password2: this.registerForm.password2
                });
                
                // 登録成功後、ログインフォームに戻る
                this.showRegistrationForm = false;
                this.loginForm.email = this.registerForm.email;
                this.loginForm.password = this.registerForm.password;
                
                // フォームをリセット
                this.registerForm = {
                    email: '',
                    username: '',
                    password: '',
                    password2: ''
                };
                
                // 自動的にログインする
                await this.loginUser();
            } catch (err) {
                this.registerError = '登録に失敗しました。別のメールアドレスを試してください。';
                console.error(err);
            }
        },
        async fetchUserProfile() {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    console.error('トークンが存在しません');
                    return;
                }
                
                const response = await axios.get(variables.API_URL + 'auth/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.data && typeof response.data === 'object') {
                    this.userProfile = {
                        username: response.data.username || 'ユーザー',
                        email: response.data.email || ''
                    };
                } else {
                    console.error('プロフィールデータが不正な形式です:', response.data);
                    this.userProfile = { username: 'ユーザー', email: '' };
                }
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
                // デフォルト値を設定
                this.userProfile = { username: 'ユーザー', email: '' };
                
                if (err.response && err.response.status === 401) {
                    // トークンが無効な場合はログアウト
                    // UIエラーを避けるため、現在のページがログインページでない場合のみログアウト処理を実行
                    if (this.$route.path !== '/login') {
                        this.logout();
                    }
                }
                throw err; // 呼び出し元でエラー処理ができるようにエラーを再スロー
            }
        },
        logout() {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            this.isAuthenticated = false;
            this.userProfile = { username: '', email: '' };
            
            // グローバルな認証状態の更新を通知
            document.dispatchEvent(new CustomEvent('auth:statusChanged'));
            
            // ナビゲーションの重複を避けるために現在のルートをチェック
            if (this.$route.path !== '/login') {
                this.$router.push('/login');
            }
        }
    }
}