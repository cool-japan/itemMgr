const company={template:`
<div>

<button type="button"
class="btn btn-primary m-2 fload-end"
data-bs-toggle="modal"
data-bs-target="#exampleModal"
@click="addClick()">
 会社マスタ追加
</button>

<table class="table table-striped">
<thead>
    <tr>
        <th>
            
            <div class="d-flex flex-row">

            <input class="form-control m-2"
                v-model="CompanyIdFilter"
                v-on:keyup="FilterFn()"
                placeholder="フィルタ">

                <button type="button" class="btn btn-light"
                @click="sortResult('CompanyId',true)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z"/>
                </svg>
                </button>

                <button type="button" class="btn btn-light"
                @click="sortResult('CompanyId',false)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z"/>
                </svg>
                </button>
            </div>
            会社ID
        </th>
        <th>

            <div class="d-flex flex-row">

            <input class="form-control m-2"
                v-model="CompanyNameFilter"
                v-on:keyup="FilterFn()"
                placeholder="フィルタ">
                
                <button type="button" class="btn btn-light"
                @click="sortResult('CompanyName',true)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z"/>
                </svg>
                </button>

                <button type="button" class="btn btn-light"
                @click="sortResult('CompanyName',false)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z"/>
                </svg>
                </button>

            </div>
            会社名
        </th>
        <th>
            オプション
        </th>
    </tr>
</thead>
<tbody>
    <tr v-for="dep in companys">
        <td>{{dep.CompanyId}}</td>
        <td>{{dep.CompanyName}}</td>
        <td>
            <button type="button"
            class="btn btn-light mr-1"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            @click="editClick(dep)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
            </button>
            <button type="button" @click="deleteClick(dep.CompanyId)"
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

        <div class="input-group mb-3">
            <span class="input-group-text">会社名</span>
            <input type="text" class="form-control" v-model="CompanyName" 
                   :class="{'is-invalid': formErrors.CompanyName}" required>
            <div class="invalid-feedback" v-if="formErrors.CompanyName">{{formErrors.CompanyName}}</div>
        </div>

        <div class="alert alert-danger" v-if="serverMessage && Object.keys(formErrors).length > 0">
            <h5>{{serverMessage}}</h5>
            <ul>
                <li v-for="(error, field) in formErrors">{{field}}: {{error}}</li>
            </ul>
        </div>

        <button type="button" @click="createClick()"
        v-if="CompanyId==0" class="btn btn-primary">
        新規作成
        </button>
        <button type="button" @click="updateClick()"
        v-if="CompanyId!=0" class="btn btn-primary">
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
        modalTitle:"",
        CompanyName:"",
        CompanyId:0,
        CompanyNameFilter:"",
        CompanyIdFilter:"",
        companysWithoutFilter:[],
        formErrors: {},
        serverMessage: ""
    }
},
methods:{
    refreshData(){
        console.log("Fetching company data from", variables.API_URL+"company");
        // JWT認証を使用
        variables.axiosAuth().get(variables.API_URL+"company")
        .then((response)=>{
            console.log("Company data received:", response.data);
            this.companys=response.data;
            this.companysWithoutFilter=response.data;
        })
        .catch(error => {
            console.error("Error fetching company data:", error);
            if (error.response && error.response.status === 401) {
                // 認証エラーの場合はログインページにリダイレクト
                this.$router.push('/login');
            }
        });
    },
    addClick(){
        this.modalTitle="会社マスタ追加";
        this.CompanyId=0;
        this.CompanyName="";
        // エラー表示をクリア
        this.clearErrors();
    },
    editClick(dep){
        this.modalTitle="会社マスタ編集";
        this.CompanyId=dep.CompanyId;
        this.CompanyName=dep.CompanyName;
        // エラー表示をクリア
        this.clearErrors();
    },
    clearErrors() {
        this.formErrors = {};
        this.serverMessage = "";
    },
    validateForm() {
        // フォームのバリデーション
        this.formErrors = {};
        
        if (!this.CompanyName || this.CompanyName.trim() === '') {
            this.formErrors.CompanyName = '会社名は必須項目です。';
        }
        
        return Object.keys(this.formErrors).length === 0;
    },
    handleApiError(error, action) {
        console.error(`Error ${action} company:`, error);
        
        let errorMessage = `会社の${action}に失敗しました`;
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
        
        variables.axiosAuth().post(variables.API_URL+"company", {
            CompanyName:this.CompanyName
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
        
        variables.axiosAuth().put(variables.API_URL+"company", {
            CompanyId:this.CompanyId,
            CompanyName:this.CompanyName
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
        
        variables.axiosAuth().delete(variables.API_URL+"company/"+id)
        .then((response)=>{
            this.refreshData();
            alert(response.data.message || response.data);
        })
        .catch(error => {
            this.handleApiError(error, "削除");
        });
    },
    FilterFn(){
        var CompanyIdFilter=this.CompanyIdFilter;
        var CompanyNameFilter=this.CompanyNameFilter;

        this.companys=this.companysWithoutFilter.filter(
            function(el){
                return el.CompanyId.toString().toLowerCase().includes(
                    CompanyIdFilter.toString().trim().toLowerCase()
                )&&
                el.CompanyName.toString().toLowerCase().includes(
                    CompanyNameFilter.toString().trim().toLowerCase()
                )
            });
    },
    sortResult(prop,asc){
        this.companys=this.companysWithoutFilter.sort(function(a,b){
            if(asc){
                return (a[prop]>b[prop])?1:((a[prop]<b[prop])?-1:0);
            }
            else{
                return (b[prop]>a[prop])?1:((b[prop]<a[prop])?-1:0);
            }
        })
    }

},
mounted:function(){
    this.refreshData();
}

}