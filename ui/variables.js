const variables = {
    API_URL: "/api/",
    PHOTO_URL: "/api/Photos/",
    
    // JWT認証用のヘルパー関数
    getAuthHeader() {
        const token = localStorage.getItem('access_token');
        console.log('Token found:', token ? 'Yes' : 'No');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },
    
    // トークン更新関数
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                console.error('リフレッシュトークンがありません');
                return false;
            }
            
            console.log('トークン更新を試行中...');
            const response = await axios.post(this.API_URL + 'auth/refresh/', {
                refresh: refreshToken
            });
            
            if (response.data && response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                console.log('アクセストークンを更新しました');
                return true;
            }
            return false;
        } catch (error) {
            console.error('トークン更新エラー:', error);
            return false;
        }
    },
    
    // APIリクエスト用のaxiosインスタンス（トークン更新機能付き）
    axiosAuth() {
        const token = localStorage.getItem('access_token');
        console.log('Creating axios instance with token:', token ? 'Yes' : 'No');
        
        const instance = axios.create({
            headers: {
                'Authorization': token ? `Bearer ${token}` : undefined
            }
        });
        
        // レスポンスインターセプターを追加
        instance.interceptors.response.use(
            response => response, 
            async error => {
                const originalRequest = error.config;
                
                // 認証エラーで、かつリトライしていない場合
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    
                    // トークンの更新を試みる
                    if (await this.refreshToken()) {
                        // 新しいトークンでリクエストを再試行
                        const token = localStorage.getItem('access_token');
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return axios(originalRequest);
                    }
                    
                    // トークン更新に失敗した場合はログアウト
                    this.logout();
                }
                
                return Promise.reject(error);
            }
        );
        
        return instance;
    },
    
    // ログアウト処理
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // イベントを発行してアプリ全体に通知
        document.dispatchEvent(new CustomEvent('auth:statusChanged'));
        // ログインページにリダイレクト
        window.location.href = '/#/login';
    },
    
    // アクセストークンの有効性をチェック
    isAuthenticated() {
        const token = localStorage.getItem('access_token');
        const isAuth = token !== null;
        console.log('Authentication check:', isAuth ? 'Authenticated' : 'Not authenticated');
        return isAuth;
    }
}
