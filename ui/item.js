const item={template:`
<div>

<button type="button"
class="btn btn-primary m-2 fload-end"
data-bs-toggle="modal"
data-bs-target="#exampleModal"
@click="addClick()">
 商品追加
</button>

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
        PhotoFileName:"anon.png",
        PhotoPath:variables.PHOTO_URL,
        formErrors: {},
        serverMessage: ""
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
mounted:function(){
    this.refreshData();
}

}