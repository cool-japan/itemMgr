const variables = {
    API_URL: "/api/",
    PHOTO_URL: "/api/Photos/",
    
    // JWT認証用のヘルパー関数
    getAuthHeader() {
        const token = localStorage.getItem('access_token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },
    
    // APIリクエスト用のaxiosインスタンス
    axiosAuth() {
        const token = localStorage.getItem('access_token');
        return axios.create({
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    
    // アクセストークンの有効性をチェック
    isAuthenticated() {
        return localStorage.getItem('access_token') !== null;
    }
}
