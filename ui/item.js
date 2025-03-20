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
        <td>{{emp.Abstract}}</td>
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
</thead>
<tbody>
    <tr v-for="emp in items">
        <td>{{emp.ItemId}}</td>
        <td>{{emp.ItemName}}</td>
        <td>{{emp.Company}}</td>
<!--        <td>{{emp.DateOfJoining}}</td> -->
        <td>{{emp.Abstract}}</td>
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
                <input type="text" class="form-control" v-model="ItemName">
            </div>

            <div class="input-group mb-3">
                <span class="input-group-text">会社名</span>
                <select class="form-select" v-model="Company">
                    <option v-for="dep in companys">
                    {{dep.CompanyName}}
                    </option>
                </select>
            </div>

            <div class="input-group mb-3">
                <span class="input-group-text">登録日</span>
                <input type="date" class="form-control" v-model="DateOfJoining">
            </div>

            <div class="input-group mb-3">
                <span class="input-group-text">概要</span>
                <input type="text" class="form-control" v-model="Abstract">
            </div>

            <div class="input-group mb-3">
                <span class="input-group-text">価格</span>
                <input type="text" class="form-control" v-model="Price">
            </div>


        </div>
        <div class="p-2 w-50 bd-highlight">
            <img width="300px" height="300px"
                :src="PhotoPath+PhotoFileName"/>
            <input class="m-2" type="file" @change="imageUpload">
        </div>
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
        modalTitle:"",
        ItemId:0,
        ItemName:"",
        Company:"",
        DateOfJoining:"",
        Abstract:"",
        Price:"",
        PhotoFileName:"anon.png",
        PhotoPath:variables.PHOTO_URL
    }
},
methods:{
    refreshData(){
        console.log("Fetching item data from", variables.API_URL+"item");
        axios.get(variables.API_URL+"item")
        .then((response)=>{
            console.log("Item data received:", response.data);
            this.items=response.data;
        })
        .catch(error => {
            console.error("Error fetching item data:", error);
        });

        console.log("Fetching company data from", variables.API_URL+"company");
        axios.get(variables.API_URL+"company")
        .then((response)=>{
            console.log("Company data received for items:", response.data);
            this.companys=response.data;
        })
        .catch(error => {
            console.error("Error fetching company data for items:", error);
        });
    },
    addClick(){
        this.modalTitle="商品追加";
        this.ItemId=0;
        this.ItemName="";
        this.Company="",
        this.DateOfJoining="",
        this.Abstract="",
        this.Price="",
        this.PhotoFileName="anon.png"
    },
    editClick(emp){
        this.modalTitle="商品編集";
        this.ItemId=emp.ItemId;
        this.ItemName=emp.ItemName;
        this.Company=emp.Company,
        this.DateOfJoining=emp.DateOfJoining,
        this.Abstract=emp.Abstract;
        this.Price=emp.Price;
        this.PhotoFileName=emp.PhotoFileName
    },
    createClick(){
        axios.post(variables.API_URL+"item",{
            ItemName:this.ItemName,
            Company:this.Company,
            DateOfJoining:this.DateOfJoining,
            Abstract:this.Abstract,
            Price:this.Price,
            PhotoFileName:this.PhotoFileName
        })
        .then((response)=>{
            this.refreshData();
            alert(response.data);
        });
    },
    updateClick(){
        axios.put(variables.API_URL+"item",{
            ItemId:this.ItemId,
            ItemName:this.ItemName,
            Company:this.Company,
            DateOfJoining:this.DateOfJoining,
            Abstract:this.Abstract,
            Price:this.Price,
            PhotoFileName:this.PhotoFileName
        })
        .then((response)=>{
            this.refreshData();
            alert(response.data);
        });
    },
    deleteClick(id){
        if(!confirm("削除してもよろしいですか？")){
            return;
        }
        axios.delete(variables.API_URL+"item/"+id)
        .then((response)=>{
            this.refreshData();
            alert(response.data);
        });

    },
    imageUpload(event){
        let formData=new FormData();
        formData.append('file',event.target.files[0]);
        axios.post(
            variables.API_URL+"item/savefile",
            formData)
            .then((response)=>{
                this.PhotoFileName=response.data;
            });
    }

},
mounted:function(){
    this.refreshData();
}

}