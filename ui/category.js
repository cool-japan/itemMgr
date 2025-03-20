const category = {
    template: `
    <div>
        <button type="button"
        class="btn btn-primary m-2 fload-end"
        data-bs-toggle="modal"
        data-bs-target="#categoryModal"
        @click="addClick()">
         カテゴリ追加
        </button>
        
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h4>カテゴリ一覧</h4>
                    <ul class="list-group">
                        <li class="list-group-item" v-for="cat in categories">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{{ cat.CategoryName }}</strong>
                                    <p v-if="cat.Description" class="mb-0 text-muted small">{{ cat.Description }}</p>
                                </div>
                                <div>
                                    <button class="btn btn-sm btn-outline-primary me-2" @click="showSubcategories(cat.CategoryId)">
                                        サブカテゴリ
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary me-2" @click="editClick(cat)">
                                        編集
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="deleteClick(cat.CategoryId)">
                                        削除
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                
                <div class="col-md-6" v-if="selectedCategory">
                    <h4>{{ selectedCategoryName }}のサブカテゴリ</h4>
                    <button class="btn btn-sm btn-outline-primary mb-3" @click="addSubcategoryClick()">
                        サブカテゴリ追加
                    </button>
                    <ul class="list-group">
                        <li class="list-group-item" v-for="subcat in subcategories">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{{ subcat.CategoryName }}</strong>
                                    <p v-if="subcat.Description" class="mb-0 text-muted small">{{ subcat.Description }}</p>
                                </div>
                                <div>
                                    <button class="btn btn-sm btn-outline-secondary me-2" @click="editClick(subcat)">
                                        編集
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="deleteClick(subcat.CategoryId)">
                                        削除
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Category Modal -->
        <div class="modal fade" id="categoryModal" tabindex="-1"
            aria-labelledby="categoryModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="categoryModalLabel">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="input-group mb-3">
                            <span class="input-group-text">カテゴリ名</span>
                            <input type="text" class="form-control" v-model="CategoryName">
                        </div>
                        
                        <div class="input-group mb-3">
                            <span class="input-group-text">説明</span>
                            <textarea class="form-control" v-model="Description"></textarea>
                        </div>
                        
                        <div class="input-group mb-3" v-if="showParentDropdown">
                            <span class="input-group-text">親カテゴリ</span>
                            <select class="form-select" v-model="ParentCategory">
                                <option v-for="cat in allCategories" :value="cat.CategoryId">
                                    {{ cat.CategoryName }}
                                </option>
                            </select>
                        </div>
                        
                        <button type="button" @click="createClick()"
                        v-if="CategoryId==0" class="btn btn-primary">
                        新規作成
                        </button>
                        <button type="button" @click="updateClick()"
                        v-if="CategoryId!=0" class="btn btn-primary">
                        更新
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    
    data() {
        return {
            categories: [],
            subcategories: [],
            allCategories: [],
            selectedCategory: null,
            selectedCategoryName: '',
            modalTitle: "",
            CategoryId: 0,
            CategoryName: "",
            Description: "",
            ParentCategory: null,
            showParentDropdown: false
        }
    },
    
    methods: {
        refreshData() {
            // Get top-level categories
            variables.axiosAuth().get(variables.API_URL + "category")
                .then((response) => {
                    this.categories = response.data;
                })
                .catch(error => {
                    console.error("Error fetching categories:", error);
                    if (error.response && error.response.status === 401) {
                        this.$router.push('/login');
                    }
                });
            
            // Get all categories for dropdown
            variables.axiosAuth().get(variables.API_URL + "categories/all")
                .then((response) => {
                    this.allCategories = response.data;
                })
                .catch(error => {
                    console.error("Error fetching all categories:", error);
                });
        },
        
        showSubcategories(categoryId) {
            variables.axiosAuth().get(variables.API_URL + "category/" + categoryId)
                .then((response) => {
                    this.selectedCategory = categoryId;
                    this.selectedCategoryName = response.data.CategoryName;
                    this.subcategories = response.data.subcategories;
                })
                .catch(error => {
                    console.error("Error fetching subcategories:", error);
                });
        },
        
        addClick() {
            this.modalTitle = "カテゴリ追加";
            this.CategoryId = 0;
            this.CategoryName = "";
            this.Description = "";
            this.ParentCategory = null;
            this.showParentDropdown = false;
        },
        
        addSubcategoryClick() {
            this.modalTitle = "サブカテゴリ追加";
            this.CategoryId = 0;
            this.CategoryName = "";
            this.Description = "";
            this.ParentCategory = this.selectedCategory;
            this.showParentDropdown = false;
            
            // Show the modal
            let myModal = new bootstrap.Modal(document.getElementById('categoryModal'));
            myModal.show();
        },
        
        editClick(cat) {
            this.modalTitle = "カテゴリ編集";
            this.CategoryId = cat.CategoryId;
            this.CategoryName = cat.CategoryName;
            this.Description = cat.Description || "";
            this.ParentCategory = cat.ParentCategory;
            this.showParentDropdown = true;
        },
        
        createClick() {
            let data = {
                CategoryName: this.CategoryName,
                Description: this.Description
            };
            
            if (this.ParentCategory) {
                data.ParentCategory = this.ParentCategory;
            }
            
            variables.axiosAuth().post(variables.API_URL + "category", data)
                .then((response) => {
                    this.refreshData();
                    
                    // If we added a subcategory, refresh the subcategories view
                    if (this.ParentCategory && this.ParentCategory === this.selectedCategory) {
                        this.showSubcategories(this.selectedCategory);
                    }
                    
                    alert(response.data.message);
                    
                    // Close the modal
                    let myModalEl = document.getElementById('categoryModal');
                    let modal = bootstrap.Modal.getInstance(myModalEl);
                    modal.hide();
                })
                .catch(error => {
                    console.error("Error creating category:", error);
                    alert("カテゴリの作成に失敗しました。");
                });
        },
        
        updateClick() {
            let data = {
                CategoryId: this.CategoryId,
                CategoryName: this.CategoryName,
                Description: this.Description,
                ParentCategory: this.ParentCategory
            };
            
            variables.axiosAuth().put(variables.API_URL + "category", data)
                .then((response) => {
                    this.refreshData();
                    
                    // If we're editing a subcategory, refresh the subcategories view
                    if (this.selectedCategory) {
                        this.showSubcategories(this.selectedCategory);
                    }
                    
                    alert(response.data.message);
                    
                    // Close the modal
                    let myModalEl = document.getElementById('categoryModal');
                    let modal = bootstrap.Modal.getInstance(myModalEl);
                    modal.hide();
                })
                .catch(error => {
                    console.error("Error updating category:", error);
                    alert("カテゴリの更新に失敗しました。");
                });
        },
        
        deleteClick(id) {
            if (!confirm("このカテゴリを削除してもよろしいですか？")) {
                return;
            }
            
            variables.axiosAuth().delete(variables.API_URL + "category/" + id)
                .then((response) => {
                    this.refreshData();
                    
                    // If we're deleting a subcategory, refresh the subcategories view
                    if (this.selectedCategory) {
                        this.showSubcategories(this.selectedCategory);
                    }
                    
                    alert(response.data.message);
                })
                .catch(error => {
                    console.error("Error deleting category:", error);
                    if (error.response && error.response.data && error.response.data.message) {
                        alert(error.response.data.message);
                    } else {
                        alert("カテゴリの削除に失敗しました。");
                    }
                });
        }
    },
    
    mounted: function() {
        this.refreshData();
    }
}