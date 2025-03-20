const item={template:`
<div>

<!-- 在庫ダッシュボード -->
<div class="card mb-4">
    <div class="card-header bg-primary text-white">
        <h5 class="mb-0">在庫状況ダッシュボード</h5>
    </div>
    <div class="card-body">
        <div class="row">
            <div class="col-md-3">
                <div class="card bg-light">
                    <div class="card-body text-center">
                        <h2>{{stockStatusSummary.total_items}}</h2>
                        <p class="mb-0">商品総数</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white">
                    <div class="card-body text-center">
                        <h2>{{stockStatusSummary.in_stock}}</h2>
                        <p class="mb-0">在庫あり</p>
                        <small>{{stockStatusSummary.in_stock_percentage}}%</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning">
                    <div class="card-body text-center">
                        <h2>{{stockStatusSummary.low_stock}}</h2>
                        <p class="mb-0">在庫僅少</p>
                        <small>{{stockStatusSummary.low_stock_percentage}}%</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-danger text-white">
                    <div class="card-body text-center">
                        <h2>{{stockStatusSummary.out_of_stock}}</h2>
                        <p class="mb-0">在庫切れ</p>
                        <small>{{stockStatusSummary.out_of_stock_percentage}}%</small>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3">
            <button type="button" class="btn btn-warning" @click="loadLowStockItems">
                在庫僅少・切れ商品を表示
            </button>
            <button type="button" class="btn btn-info ms-2" @click="refreshData">
                全商品を表示
            </button>
        </div>
    </div>
</div>

<div class="card mb-4">
    <div class="card-header bg-info text-white">
        <h5 class="mb-0">高度な検索</h5>
    </div>
    <div class="card-body">
        <div class="row g-3">
            <div class="col-md-6">
                <div class="input-group mb-3">
                    <span class="input-group-text">キーワード</span>
                    <input type="text" class="form-control" v-model="searchQuery" 
                           placeholder="商品名、説明、会社名で検索">
                    <button class="btn btn-primary" type="button" @click="performSearch">
                        <i class="bi bi-search"></i> 検索
                    </button>
                </div>
            </div>
            <div class="col-md-6">
                <div class="input-group mb-3">
                    <span class="input-group-text">カテゴリ</span>
                    <select class="form-select" v-model="searchCategory">
                        <option value="">すべてのカテゴリ</option>
                        <option v-for="cat in categories" :value="cat.CategoryId">
                            {{cat.CategoryName}}
                        </option>
                    </select>
                </div>
            </div>
            <div class="col-md-6">
                <div class="input-group mb-3">
                    <span class="input-group-text">価格範囲</span>
                    <input type="number" class="form-control" v-model="searchMinPrice" 
                           placeholder="最小" min="0">
                    <span class="input-group-text">〜</span>
                    <input type="number" class="form-control" v-model="searchMaxPrice" 
                           placeholder="最大" min="0">
                </div>
            </div>
            <div class="col-md-6">
                <div class="input-group mb-3">
                    <span class="input-group-text">在庫状態</span>
                    <select class="form-select" v-model="searchStockStatus">
                        <option value="">すべての状態</option>
                        <option value="in_stock">在庫あり</option>
                        <option value="low_stock">在庫僅少</option>
                        <option value="out_of_stock">在庫切れ</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-between">
            <button class="btn btn-secondary" @click="resetSearch">
                検索条件をリセット
            </button>
            <span v-if="searchPerformed" class="text-muted align-self-center">
                {{ searchResultCount }}件の検索結果
            </span>
        </div>
    </div>
</div>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h3>商品一覧</h3>
    <button type="button"
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    @click="addClick()">
     商品追加
    </button>
</div>

<table class="table table-striped">
<thead>
    <tr>
        <th>
            商品ID
        </th>
        <th>
            商品名
        </th>
        <th>
            会社名
        </th>
<!--        <th>
            登録日
        </th> -->
        <th>
            概要
        </th>
        <th>
            価格
        </th>
        <th>
            在庫
        </th>
        <th>
            オプション
        </th>
    </tr>
</thead>
<tbody>
    <tr v-for="emp in items">
        <td>{{emp.ItemId}}</td>
        <td>{{emp.ItemName}}</td>
        <td>{{emp.Company}}</td>
<!--        <td>{{emp.DateOfJoining}}</td> -->
        <td>
            {{emp.Abstract}}
            <span v-if="emp.category_name" class="badge bg-info">{{emp.category_name}}</span>
        </td>
        <td>{{emp.Price}}</td>
        <td>
            <span :class="getStockStatusClass(emp)">{{emp.stock_status}}</span>
            <span class="badge bg-secondary">{{emp.StockQuantity}}個</span>
            <button type="button" class="btn btn-sm btn-outline-success mx-1" @click="showStockModal(emp)">
                在庫管理
            </button>
        </td>
        <td>
            <button type="button"
            class="btn btn-light mr-1"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            @click="editClick(emp)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
            </button>
            <button type="button" @click="deleteClick(emp.ItemId)"
            class="btn btn-light mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                </svg>
            </button>

        </td>
    </tr>
</tbody>
</table>

<div class="modal fade" id="exampleModal" tabindex="-1"
    aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog modal-lg modal-dialog-centered">
<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">{{modalTitle}}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"
        aria-label="Close"></button>
    </div>

    <div class="modal-body">
    <div class="d-flex flex-row bd-highlight mb-3">
        <div class="p-2 w-50 bd-highlight">
            <div class="input-group mb-3">
                <span class="input-group-text">商品名</span>
                <input type="text" class="form-control" v-model="ItemName" 
                       :class="{'is-invalid': formErrors.ItemName}" required>
                <div class="invalid-feedback" v-if="formErrors.ItemName">{{formErrors.ItemName}}</div>
            </div>

            <div class="input-group mb-3">
                <span class="input-group-text">会社名</span>
                <select class="form-select" v-model="Company" 
                        :class="{'is-invalid': formErrors.Company}" required>
                    <option value="">会社を選択してください</option>
                    <option v-for="dep in companys">
                    {{dep.CompanyName}}
                    </option>
                </select>
                <div class="invalid-feedback" v-if="formErrors.Company">{{formErrors.Company}}</div>
            </div>
            
            <div class="input-group mb-3">
                <span class="input-group-text">カテゴリ</span>
                <select class="form-select" v-model="CategoryId">
                    <option value="" selected>カテゴリなし</option>
                    <option v-for="cat in categories" :value="cat.CategoryId">
                    {{cat.CategoryName}}
                    </option>
                </select>
            </div>

            <div class="input-group mb-3">
                <span class="input-group-text">登録日</span>
                <input type="date" class="form-control" v-model="DateOfJoining" 
                       :class="{'is-invalid': formErrors.DateOfJoining}" required>
                <div class="invalid-feedback" v-if="formErrors.DateOfJoining">{{formErrors.DateOfJoining}}</div>
            </div>

            <div class="input-group mb-3">
                <span class="input-group-text">概要</span>
                <input type="text" class="form-control" v-model="Abstract" 
                       :class="{'is-invalid': formErrors.Abstract}" required>
                <div class="invalid-feedback" v-if="formErrors.Abstract">{{formErrors.Abstract}}</div>
            </div>

            <div class="input-group mb-3">
                <span class="input-group-text">価格</span>
                <input type="number" min="1" class="form-control" v-model="Price" 
                       :class="{'is-invalid': formErrors.Price}" required>
                <div class="invalid-feedback" v-if="formErrors.Price">{{formErrors.Price}}</div>
            </div>
            
            <div class="input-group mb-3">
                <span class="input-group-text">在庫数</span>
                <input type="number" min="0" class="form-control" v-model="StockQuantity" 
                       :class="{'is-invalid': formErrors.StockQuantity}" required>
                <div class="invalid-feedback" v-if="formErrors.StockQuantity">{{formErrors.StockQuantity}}</div>
            </div>
            
            <div class="input-group mb-3">
                <span class="input-group-text">在庫僅少閾値</span>
                <input type="number" min="1" class="form-control" v-model="LowStockThreshold" 
                       :class="{'is-invalid': formErrors.LowStockThreshold}" required>
                <div class="invalid-feedback" v-if="formErrors.LowStockThreshold">{{formErrors.LowStockThreshold}}</div>
            </div>


        </div>
        <div class="p-2 w-50 bd-highlight">
            <img width="300px" height="300px"
                :src="PhotoPath+PhotoFileName"/>
            <input class="m-2" type="file" @change="imageUpload">
        </div>
    </div>
        <div class="alert alert-danger" v-if="serverMessage && Object.keys(formErrors).length > 0">
            <h5>{{serverMessage}}</h5>
            <ul>
                <li v-for="(error, field) in formErrors">{{field}}: {{error}}</li>
            </ul>
        </div>
        
        <button type="button" @click="createClick()"
        v-if="ItemId==0" class="btn btn-primary">
        追加
        </button>
        <button type="button" @click="updateClick()"
        v-if="ItemId!=0" class="btn btn-primary">
        更新
        </button>

    </div>

</div>
</div>
</div>

<!-- 在庫管理モーダル -->
<div class="modal fade" id="stockModal" tabindex="-1"
    aria-labelledby="stockModalLabel" aria-hidden="true">
<div class="modal-dialog modal-md modal-dialog-centered">
<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="stockModalLabel">在庫管理: {{currentStockItem.ItemName}}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"
        aria-label="Close"></button>
    </div>

    <div class="modal-body">
        <div class="card mb-3">
            <div class="card-header">現在の在庫情報</div>
            <div class="card-body">
                <p class="card-text">
                    <strong>在庫状況:</strong> 
                    <span :class="getStockStatusClass(currentStockItem)">{{currentStockItem.stock_status}}</span>
                </p>
                <p class="card-text">
                    <strong>在庫数:</strong> {{currentStockItem.StockQuantity}}個
                </p>
                <p class="card-text">
                    <strong>在庫僅少閾値:</strong> {{currentStockItem.LowStockThreshold}}個
                </p>
            </div>
        </div>
        
        <div class="card mb-3">
            <div class="card-header">在庫数変更</div>
            <div class="card-body">
                <div class="input-group mb-3">
                    <span class="input-group-text">変更数</span>
                    <input type="number" class="form-control" v-model="stockChangeAmount"
                           :class="{'is-invalid': stockChangeError}">
                    <div class="invalid-feedback" v-if="stockChangeError">{{stockChangeError}}</div>
                </div>
                <div class="alert alert-info">
                    <small>※ 入荷の場合はプラスの値、出荷の場合はマイナスの値を入力してください。</small>
                </div>
                <div class="d-grid gap-2">
                    <button class="btn btn-success" @click="updateStockQuantity">在庫数を更新</button>
                </div>
            </div>
        </div>
        
        <div class="alert alert-danger" v-if="stockUpdateError">
            {{stockUpdateError}}
        </div>
        <div class="alert alert-success" v-if="stockUpdateSuccess">
            {{stockUpdateSuccess}}
        </div>
    </div>
</div>
</div>
</div>

</div>


`,

data(){
    return{
        companys:[],
        items:[],
        categories:[],
        modalTitle:"",
        ItemId:0,
        ItemName:"",
        Company:"",
        CategoryId:"",
        DateOfJoining:"",
        Abstract:"",
        Price:"",
        StockQuantity: 0,
        LowStockThreshold: 5,
        PhotoFileName:"anon.png",
        PhotoPath:variables.PHOTO_URL,
        formErrors: {},
        serverMessage: "",
        // 在庫管理用
        currentStockItem: {},
        stockChangeAmount: 0,
        stockChangeError: "",
        stockUpdateError: "",
        stockUpdateSuccess: "",
        stockStatusSummary: {
            total_items: 0,
            out_of_stock: 0,
            low_stock: 0,
            in_stock: 0
        },
        // 検索関連
        searchQuery: '',
        searchCategory: '',
        searchMinPrice: '',
        searchMaxPrice: '',
        searchStockStatus: '',
        searchPerformed: false,
        searchResultCount: 0
    }
},
methods:{
    refreshData(){
        console.log("Fetching item data from", variables.API_URL+"item");
        // JWT認証を使用
        variables.axiosAuth().get(variables.API_URL+"item")
        .then((response)=>{
            console.log("Item data received:", response.data);
            this.items=response.data;
        })
        .catch(error => {
            console.error("Error fetching item data:", error);
            if (error.response && error.response.status === 401) {
                // 認証エラーの場合はログインページにリダイレクト
                this.$router.push('/login');
            }
        });
        
        // 在庫ステータスのサマリーを取得
        variables.axiosAuth().get(variables.API_URL+"stock/status")
        .then((response)=>{
            console.log("Stock status summary received:", response.data);
            this.stockStatusSummary = response.data;
        })
        .catch(error => {
            console.error("Error fetching stock status summary:", error);
        });

        console.log("Fetching company data from", variables.API_URL+"company");
        // JWT認証を使用
        variables.axiosAuth().get(variables.API_URL+"company")
        .then((response)=>{
            console.log("Company data received for items:", response.data);
            this.companys=response.data;
        })
        .catch(error => {
            console.error("Error fetching company data for items:", error);
            if (error.response && error.response.status === 401) {
                this.$router.push('/login');
            }
        });
        
        // Get all categories for dropdown
        variables.axiosAuth().get(variables.API_URL + "categories/all")
        .then((response) => {
            this.categories = response.data;
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
        });
    },
    addClick(){
        this.modalTitle="商品追加";
        this.ItemId=0;
        this.ItemName="";
        this.Company="",
        this.CategoryId="",
        this.DateOfJoining="",
        this.Abstract="",
        this.Price="",
        this.StockQuantity = 0,
        this.LowStockThreshold = 5,
        this.PhotoFileName="anon.png";
        
        // エラー表示をクリア
        this.clearErrors();
        
        // 現在の日付を設定
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        this.DateOfJoining = `${year}-${month}-${day}`;
    },
    editClick(emp){
        this.modalTitle="商品編集";
        this.ItemId=emp.ItemId;
        this.ItemName=emp.ItemName;
        this.Company=emp.Company,
        this.CategoryId=emp.Category || "",
        this.DateOfJoining=emp.DateOfJoining,
        this.Abstract=emp.Abstract;
        this.Price=emp.Price;
        this.StockQuantity=emp.StockQuantity;
        this.LowStockThreshold=emp.LowStockThreshold;
        this.PhotoFileName=emp.PhotoFileName;
        
        // エラー表示をクリア
        this.clearErrors();
    },
    validateForm() {
        // フォームのバリデーション
        this.formErrors = {};
        
        if (!this.ItemName || this.ItemName.trim() === '') {
            this.formErrors.ItemName = '商品名は必須です';
        }
        
        if (!this.Company || this.Company.trim() === '') {
            this.formErrors.Company = '会社は必須です';
        }
        
        if (!this.DateOfJoining) {
            this.formErrors.DateOfJoining = '登録日は必須です';
        }
        
        if (!this.Abstract || this.Abstract.trim() === '') {
            this.formErrors.Abstract = '概要は必須項目です。商品の説明を入力してください。';
        }
        
        if (!this.Price) {
            this.formErrors.Price = '価格は必須です';
        } else if (isNaN(this.Price) || Number(this.Price) <= 0) {
            this.formErrors.Price = '価格は正の数値を入力してください';
        }
        
        if (this.StockQuantity === null || this.StockQuantity === undefined) {
            this.formErrors.StockQuantity = '在庫数は必須です';
        } else if (isNaN(this.StockQuantity) || Number(this.StockQuantity) < 0) {
            this.formErrors.StockQuantity = '在庫数は0以上の数値を入力してください';
        }
        
        if (this.LowStockThreshold === null || this.LowStockThreshold === undefined) {
            this.formErrors.LowStockThreshold = '在庫僅少閾値は必須です';
        } else if (isNaN(this.LowStockThreshold) || Number(this.LowStockThreshold) < 1) {
            this.formErrors.LowStockThreshold = '在庫僅少閾値は1以上の数値を入力してください';
        }
        
        if (!this.PhotoFileName) {
            this.formErrors.PhotoFileName = '写真ファイル名は必須です';
        }
        
        return Object.keys(this.formErrors).length === 0;
    },
    
    clearErrors() {
        this.formErrors = {};
        this.serverMessage = "";
    },
    
    handleApiError(error, action) {
        console.error(`Error ${action} item:`, error);
        
        let errorMessage = `商品の${action}に失敗しました`;
        this.formErrors = {};
        
        if (error.response) {
            if (error.response.status === 401) {
                this.$router.push('/login');
                return;
            }
            
            if (error.response.data) {
                if (error.response.data.errors) {
                    // 新しいAPIエラー形式
                    this.formErrors = error.response.data.errors;
                    this.serverMessage = error.response.data.message || errorMessage;
                } else {
                    // 従来のエラー形式
                    for (const field in error.response.data) {
                        this.formErrors[field] = Array.isArray(error.response.data[field]) 
                            ? error.response.data[field].join(', ') 
                            : error.response.data[field];
                    }
                    this.serverMessage = errorMessage;
                }
            }
        } else {
            this.formErrors.全般 = `エラーが発生しました: ${error.message || '不明なエラー'}`;
            this.serverMessage = errorMessage;
        }
    },
    
    createClick(){
        // エラー表示をクリア
        this.clearErrors();
        
        // フォームのバリデーション
        if (!this.validateForm()) {
            this.serverMessage = "入力内容を確認してください";
            return;
        }
        
        // 日付が文字列の場合はフォーマットを確認
        let dateOfJoining = this.DateOfJoining;
        if (typeof dateOfJoining === 'string') {
            // yyyy-MM-dd形式であることを確認
            if (!dateOfJoining.match(/^\d{4}-\d{2}-\d{2}$/)) {
                // 日付フォーマットが不正な場合は現在の日付をセット
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                dateOfJoining = `${year}-${month}-${day}`;
            }
        }
        
        console.log("送信データ:", {
            ItemName: this.ItemName,
            Company: this.Company,
            Category: this.CategoryId || null,
            DateOfJoining: dateOfJoining,
            Abstract: this.Abstract,
            Price: this.Price,
            PhotoFileName: this.PhotoFileName
        });
        
        variables.axiosAuth().post(variables.API_URL+"item", {
            ItemName: this.ItemName,
            Company: this.Company,
            Category: this.CategoryId || null,
            DateOfJoining: dateOfJoining,
            Abstract: this.Abstract,
            Price: this.Price,
            StockQuantity: this.StockQuantity,
            LowStockThreshold: this.LowStockThreshold,
            PhotoFileName: this.PhotoFileName
        })
        .then((response)=>{
            this.refreshData();
            alert(response.data.message || response.data);
            // モーダルを閉じる
            const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
            if (modal) {
                modal.hide();
            }
        })
        .catch(error => {
            this.handleApiError(error, "追加");
        });
    },
    updateClick(){
        // エラー表示をクリア
        this.clearErrors();
        
        // フォームのバリデーション
        if (!this.validateForm()) {
            this.serverMessage = "入力内容を確認してください";
            return;
        }
        
        // 日付が文字列の場合はフォーマットを確認
        let dateOfJoining = this.DateOfJoining;
        if (typeof dateOfJoining === 'string') {
            // yyyy-MM-dd形式であることを確認
            if (!dateOfJoining.match(/^\d{4}-\d{2}-\d{2}$/)) {
                // 日付フォーマットが不正な場合は現在の日付をセット
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                dateOfJoining = `${year}-${month}-${day}`;
            }
        }
        
        variables.axiosAuth().put(variables.API_URL+"item", {
            ItemId:this.ItemId,
            ItemName:this.ItemName,
            Company:this.Company,
            Category:this.CategoryId || null,
            DateOfJoining:dateOfJoining,
            Abstract:this.Abstract,
            Price:this.Price,
            StockQuantity:this.StockQuantity,
            LowStockThreshold:this.LowStockThreshold,
            PhotoFileName:this.PhotoFileName
        })
        .then((response)=>{
            this.refreshData();
            alert(response.data.message || response.data);
            // モーダルを閉じる
            const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
            if (modal) {
                modal.hide();
            }
        })
        .catch(error => {
            this.handleApiError(error, "更新");
        });
    },
    deleteClick(id){
        if(!confirm("削除してもよろしいですか？")){
            return;
        }
        
        variables.axiosAuth().delete(variables.API_URL+"item/"+id)
        .then((response)=>{
            this.refreshData();
            alert(response.data.message || response.data);
        })
        .catch(error => {
            this.handleApiError(error, "削除");
        });
    },
    imageUpload(event){
        if (!event.target.files || !event.target.files[0]) {
            return;
        }
        
        // エラーをクリア
        this.formErrors.PhotoFileName = null;
        
        let formData=new FormData();
        formData.append('file',event.target.files[0]);
        // JWT認証を使用
        const token = localStorage.getItem('access_token');
        axios.post(
            variables.API_URL+"item/savefile",
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response)=>{
                this.PhotoFileName=response.data;
            })
            .catch(error => {
                console.error("Error uploading image:", error);
                if (error.response && error.response.status === 401) {
                    this.$router.push('/login');
                    return;
                }
                
                this.formErrors.PhotoFileName = '画像のアップロードに失敗しました';
                this.serverMessage = '画像のアップロードエラー';
                
                if (error.response && error.response.data && error.response.data.message) {
                    this.formErrors.PhotoFileName = error.response.data.message;
                }
            });
    }

},
    // 在庫管理用メソッド
    getStockStatusClass(item) {
        if (!item || !item.stock_status) return '';
        
        switch(item.stock_status) {
            case '在庫切れ':
                return 'badge bg-danger';
            case '在庫僅少':
                return 'badge bg-warning text-dark';
            case '在庫あり':
                return 'badge bg-success';
            default:
                return 'badge bg-secondary';
        }
    },
    
    showStockModal(item) {
        this.currentStockItem = {...item};
        this.stockChangeAmount = 0;
        this.stockChangeError = '';
        this.stockUpdateError = '';
        this.stockUpdateSuccess = '';
        
        // モーダルを表示
        const stockModal = new bootstrap.Modal(document.getElementById('stockModal'));
        stockModal.show();
    },
    
    updateStockQuantity() {
        // 入力チェック
        if (this.stockChangeAmount === 0) {
            this.stockChangeError = '変更数を入力してください';
            return;
        }
        
        if (!Number.isInteger(Number(this.stockChangeAmount))) {
            this.stockChangeError = '整数で入力してください';
            return;
        }
        
        this.stockChangeError = '';
        this.stockUpdateError = '';
        this.stockUpdateSuccess = '';
        
        // 在庫数更新API呼び出し
        variables.axiosAuth().post(variables.API_URL + `stock/update/${this.currentStockItem.ItemId}`, {
            quantity_change: this.stockChangeAmount
        })
        .then(response => {
            console.log('Stock update response:', response.data);
            this.stockUpdateSuccess = response.data.message;
            this.currentStockItem = response.data.item;
            
            // 商品一覧を更新
            this.refreshData();
            
            // 変更数フィールドをリセット
            this.stockChangeAmount = 0;
        })
        .catch(error => {
            console.error('Stock update error:', error);
            this.stockUpdateError = '';
            
            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    this.stockUpdateError = error.response.data.message;
                } else if (error.response.data && error.response.data.errors) {
                    const errorMessages = [];
                    for (const field in error.response.data.errors) {
                        errorMessages.push(`${field}: ${error.response.data.errors[field]}`);
                    }
                    this.stockUpdateError = errorMessages.join(', ');
                } else {
                    this.stockUpdateError = `エラーが発生しました (${error.response.status})`;
                }
            } else {
                this.stockUpdateError = `エラーが発生しました: ${error.message || '不明なエラー'}`;
            }
        });
    },
    
    loadLowStockItems() {
        variables.axiosAuth().get(variables.API_URL + "stock/low")
        .then(response => {
            console.log('Low stock items:', response.data);
            this.items = response.data;
        })
        .catch(error => {
            console.error('Error fetching low stock items:', error);
            if (error.response && error.response.status === 401) {
                this.$router.push('/login');
            }
        });
    },
    
    // 検索関連メソッド
    performSearch() {
        // 検索パラメータの構築
        const params = new URLSearchParams();
        
        if (this.searchQuery) {
            params.append('q', this.searchQuery);
        }
        
        if (this.searchCategory) {
            params.append('category', this.searchCategory);
        }
        
        if (this.searchMinPrice) {
            params.append('min_price', this.searchMinPrice);
        }
        
        if (this.searchMaxPrice) {
            params.append('max_price', this.searchMaxPrice);
        }
        
        if (this.searchStockStatus) {
            params.append('stock_status', this.searchStockStatus);
        }
        
        // 検索APIを呼び出し
        variables.axiosAuth().get(`${variables.API_URL}search?${params.toString()}`)
        .then(response => {
            console.log('Search results:', response.data);
            this.items = response.data.results;
            this.searchResultCount = response.data.count;
            this.searchPerformed = true;
        })
        .catch(error => {
            console.error('Search error:', error);
            if (error.response && error.response.status === 401) {
                this.$router.push('/login');
            }
        });
    },
    
    resetSearch() {
        // 検索パラメータをリセット
        this.searchQuery = '';
        this.searchCategory = '';
        this.searchMinPrice = '';
        this.searchMaxPrice = '';
        this.searchStockStatus = '';
        this.searchPerformed = false;
        
        // 全データを再取得
        this.refreshData();
    },

mounted:function(){
    this.refreshData();
}

}