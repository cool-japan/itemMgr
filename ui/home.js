const home = {
    template: `
    <div>
        <h3 class="mb-4">ホーム</h3>
        
        <div class="jumbotron bg-light p-5 rounded">
            <h1 class="display-6">商品管理システムへようこそ</h1>
            <p class="lead">このシステムでは商品や会社情報の管理ができます。</p>
            <hr class="my-4">
            <p v-if="!isAuthenticated">アカウントにログインして、商品や会社情報を管理しましょう。</p>
            <p v-if="isAuthenticated">ログイン済みです。商品や会社の管理が可能です。</p>
            <div v-if="!isAuthenticated" class="mt-3">
                <router-link to="/login" class="btn btn-primary">ログイン</router-link>
            </div>
        </div>
        
        <div class="mt-5">
            <h4>最新の商品一覧</h4>
            <div class="row row-cols-1 row-cols-md-3 g-4 mt-2">
                <div class="col" v-for="item in latestItems">
                    <div class="card h-100">
                        <img :src="PhotoPath + item.PhotoFileName" class="card-img-top" alt="商品画像" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">{{ item.ItemName }}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">{{ item.Company }}</h6>
                            <p class="card-text">{{ item.Abstract }}</p>
                            <p class="card-text"><strong>¥{{ item.Price }}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            latestItems: [],
            PhotoPath: variables.PHOTO_URL,
            isAuthenticated: false
        }
    },
    methods: {
        refreshData() {
            // 公開エンドポイントから商品データを取得
            axios.get(variables.API_URL + "public/items/")
                .then((response) => {
                    // 最新の5商品のみを表示
                    this.latestItems = response.data.slice(0, 6);
                })
                .catch(error => {
                    console.error("Error fetching public items:", error);
                });
        },
        checkAuth() {
            this.isAuthenticated = variables.isAuthenticated();
        }
    },
    mounted: function() {
        this.refreshData();
        this.checkAuth();
        
        // 認証状態変更イベントをリッスン
        document.addEventListener('auth:statusChanged', this.checkAuth);
    },
    beforeDestroy: function() {
        // コンポーネント破棄時にイベントリスナーを削除
        document.removeEventListener('auth:statusChanged', this.checkAuth);
    }
}