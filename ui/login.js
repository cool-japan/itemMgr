const login = {
    template: `
    <div>
        <div v-if="!isAuthenticated" class="login-container">
            <h3 class="mb-4">ログイン</h3>
            <div class="alert alert-danger" v-if="error">{{ error }}</div>
            <form @submit.prevent="loginUser">
                <div class="mb-3">
                    <label for="email" class="form-label">メールアドレス</label>
                    <input type="email" class="form-control" id="email" v-model="loginForm.email" required>
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
                email: '',
                password: ''
            },
            registerForm: {
                email: '',
                username: '',
                password: '',
                password2: ''
            },
            userProfile: null,
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
            try {
                const response = await axios.post(variables.API_URL + 'auth/login/', {
                    email: this.loginForm.email,
                    password: this.loginForm.password
                });
                
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                this.isAuthenticated = true;
                this.fetchUserProfile();
                
                // ログイン後にホームページにリダイレクト
                this.$router.push('/home');
            } catch (err) {
                this.error = '認証に失敗しました。メールアドレスとパスワードを確認してください。';
                console.error(err);
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
                const response = await axios.get(variables.API_URL + 'auth/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.userProfile = response.data;
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
                if (err.response && err.response.status === 401) {
                    // トークンが無効な場合はログアウト
                    this.logout();
                }
            }
        },
        logout() {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            this.isAuthenticated = false;
            this.userProfile = null;
            this.$router.push('/login');
        }
    }
}