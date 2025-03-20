<template>
  <div>
    <button 
      type="button"
      class="btn btn-primary m-2 fload-end"
      data-bs-toggle="modal"
      data-bs-target="#itemModal"
      @click="addClick"
    >
      商品追加
    </button>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>商品ID</th>
          <th>商品名</th>
          <th>会社名</th>
          <th>概要</th>
          <th>価格</th>
          <th>オプション</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.ItemId">
          <td>{{ item.ItemId }}</td>
          <td>{{ item.ItemName }}</td>
          <td>{{ item.Company }}</td>
          <td>
            {{ item.Abstract }}
            <span v-if="item.category_name" class="badge bg-info">{{ item.category_name }}</span>
          </td>
          <td>{{ item.Price }}</td>
          <td>
            <button 
              type="button"
              class="btn btn-light mr-1"
              data-bs-toggle="modal"
              data-bs-target="#itemModal"
              @click="editClick(item)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
              </svg>
            </button>
            <button 
              type="button" 
              class="btn btn-light mr-1"
              @click="deleteClick(item.ItemId)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 商品追加・編集モーダル -->
    <div class="modal fade" id="itemModal" tabindex="-1" aria-labelledby="itemModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="itemModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex flex-row bd-highlight mb-3">
              <div class="p-2 w-50 bd-highlight">
                <div class="input-group mb-3">
                  <span class="input-group-text">商品名</span>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="ItemName"
                    :class="{'is-invalid': formErrors.ItemName}"
                    required
                  />
                  <div class="invalid-feedback" v-if="formErrors.ItemName">{{ formErrors.ItemName }}</div>
                </div>

                <div class="input-group mb-3">
                  <span class="input-group-text">会社名</span>
                  <select 
                    class="form-select" 
                    v-model="Company"
                    :class="{'is-invalid': formErrors.Company}"
                    required
                  >
                    <option value="">会社を選択してください</option>
                    <option v-for="dep in companies" :key="dep.CompanyId">
                      {{ dep.CompanyName }}
                    </option>
                  </select>
                  <div class="invalid-feedback" v-if="formErrors.Company">{{ formErrors.Company }}</div>
                </div>
                
                <div class="input-group mb-3">
                  <span class="input-group-text">カテゴリ</span>
                  <select class="form-select" v-model="CategoryId">
                    <option value="" selected>カテゴリなし</option>
                    <option v-for="cat in categories" :key="cat.CategoryId" :value="cat.CategoryId">
                      {{ cat.CategoryName }}
                    </option>
                  </select>
                </div>

                <div class="input-group mb-3">
                  <span class="input-group-text">登録日</span>
                  <input 
                    type="date" 
                    class="form-control" 
                    v-model="DateOfJoining"
                    :class="{'is-invalid': formErrors.DateOfJoining}"
                    required
                  />
                  <div class="invalid-feedback" v-if="formErrors.DateOfJoining">{{ formErrors.DateOfJoining }}</div>
                </div>

                <div class="input-group mb-3">
                  <span class="input-group-text">概要</span>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="Abstract"
                    :class="{'is-invalid': formErrors.Abstract}"
                    required
                  />
                  <div class="invalid-feedback" v-if="formErrors.Abstract">{{ formErrors.Abstract }}</div>
                </div>

                <div class="input-group mb-3">
                  <span class="input-group-text">価格</span>
                  <input 
                    type="number" 
                    min="1" 
                    class="form-control" 
                    v-model.number="Price"
                    :class="{'is-invalid': formErrors.Price}"
                    required
                  />
                  <div class="invalid-feedback" v-if="formErrors.Price">{{ formErrors.Price }}</div>
                </div>
              </div>
              <div class="p-2 w-50 bd-highlight">
                <img 
                  width="300px" 
                  height="300px"
                  :src="photoPath + PhotoFileName"
                />
                <input class="m-2" type="file" @change="imageUpload" />
              </div>
            </div>
            
            <div class="alert alert-danger" v-if="serverMessage && Object.keys(formErrors).length > 0">
              <h5>{{ serverMessage }}</h5>
              <ul>
                <li v-for="(error, field) in formErrors" :key="field">{{ field }}: {{ error }}</li>
              </ul>
            </div>

            <button 
              type="button" 
              class="btn btn-primary"
              v-if="ItemId === 0" 
              @click="createClick"
            >
              追加
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              v-if="ItemId !== 0" 
              @click="updateClick"
            >
              更新
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { API_URL, PHOTO_URL, useFormErrors } from '../composables/useApi';
import axios from 'axios';
import type { Item, Company, Category } from '../types';

declare global {
  interface Window {
    bootstrap: any;
  }
}

export default defineComponent({
  name: 'ItemView',
  setup() {
    const router = useRouter();
    const items = ref<Item[]>([]);
    const companies = ref<Company[]>([]);
    const categories = ref<Category[]>([]);
    const modalTitle = ref('商品追加');
    const ItemId = ref(0);
    const ItemName = ref('');
    const Company = ref('');
    const CategoryId = ref<number | string>('');
    const DateOfJoining = ref('');
    const Abstract = ref('');
    const Price = ref<number | string>('');
    const PhotoFileName = ref('anon.png');
    const photoPath = PHOTO_URL;
    
    const { formErrors, serverMessage, clearErrors, handleApiError } = useFormErrors();

    const refreshData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        // 商品データの取得
        const itemResponse = await axios.get(`${API_URL}item`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        items.value = itemResponse.data;

        // 会社データの取得
        const companyResponse = await axios.get(`${API_URL}company`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        companies.value = companyResponse.data;

        // カテゴリデータの取得
        const categoryResponse = await axios.get(`${API_URL}categories/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        categories.value = categoryResponse.data;
      } catch (error: any) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          router.push('/login');
        }
      }
    };

    const addClick = () => {
      modalTitle.value = '商品追加';
      ItemId.value = 0;
      ItemName.value = '';
      Company.value = '';
      CategoryId.value = '';
      DateOfJoining.value = '';
      Abstract.value = '';
      Price.value = '';
      PhotoFileName.value = 'anon.png';
      
      // エラー表示をクリア
      clearErrors();
      
      // 現在の日付を設定
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      DateOfJoining.value = `${year}-${month}-${day}`;
    };

    const editClick = (item: Item) => {
      modalTitle.value = '商品編集';
      ItemId.value = item.ItemId;
      ItemName.value = item.ItemName;
      Company.value = item.Company;
      CategoryId.value = item.Category || '';
      DateOfJoining.value = item.DateOfJoining;
      Abstract.value = item.Abstract;
      Price.value = item.Price;
      PhotoFileName.value = item.PhotoFileName;
      
      // エラー表示をクリア
      clearErrors();
    };

    const validateForm = (): boolean => {
      // フォームのバリデーション
      clearErrors();
      
      if (!ItemName.value || String(ItemName.value).trim() === '') {
        formErrors.value.ItemName = '商品名は必須です';
      }
      
      if (!Company.value || String(Company.value).trim() === '') {
        formErrors.value.Company = '会社は必須です';
      }
      
      if (!DateOfJoining.value) {
        formErrors.value.DateOfJoining = '登録日は必須です';
      }
      
      if (!Abstract.value || String(Abstract.value).trim() === '') {
        formErrors.value.Abstract = '概要は必須項目です。商品の説明を入力してください。';
      }
      
      if (!Price.value) {
        formErrors.value.Price = '価格は必須です';
      } else if (isNaN(Number(Price.value)) || Number(Price.value) <= 0) {
        formErrors.value.Price = '価格は正の数値を入力してください';
      }
      
      if (!PhotoFileName.value) {
        formErrors.value.PhotoFileName = '写真ファイル名は必須です';
      }
      
      return Object.keys(formErrors.value).length === 0;
    };

    const formatDate = (dateString: string): string => {
      // 日付が文字列の場合はフォーマットを確認
      if (typeof dateString === 'string') {
        // yyyy-MM-dd形式であることを確認
        if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // 日付フォーマットが不正な場合は現在の日付をセット
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
      }
      return dateString;
    };

    const createClick = async () => {
      // エラー表示をクリア
      clearErrors();
      
      // フォームのバリデーション
      if (!validateForm()) {
        serverMessage.value = "入力内容を確認してください";
        return;
      }
      
      const dateOfJoining = formatDate(DateOfJoining.value);
      
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(
          `${API_URL}item`, 
          {
            ItemName: ItemName.value,
            Company: Company.value,
            Category: CategoryId.value || null,
            DateOfJoining: dateOfJoining,
            Abstract: Abstract.value,
            Price: Price.value,
            PhotoFileName: PhotoFileName.value
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        await refreshData();
        alert(response.data.message || response.data);
        
        // モーダルを閉じる
        const modalEl = document.getElementById('itemModal');
        if (modalEl) {
          const modal = window.bootstrap.Modal.getInstance(modalEl);
          if (modal) {
            modal.hide();
          }
        }
      } catch (error: any) {
        handleApiError(error, '追加');
      }
    };

    const updateClick = async () => {
      // エラー表示をクリア
      clearErrors();
      
      // フォームのバリデーション
      if (!validateForm()) {
        serverMessage.value = "入力内容を確認してください";
        return;
      }
      
      const dateOfJoining = formatDate(DateOfJoining.value);
      
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.put(
          `${API_URL}item`, 
          {
            ItemId: ItemId.value,
            ItemName: ItemName.value,
            Company: Company.value,
            Category: CategoryId.value || null,
            DateOfJoining: dateOfJoining,
            Abstract: Abstract.value,
            Price: Price.value,
            PhotoFileName: PhotoFileName.value
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        await refreshData();
        alert(response.data.message || response.data);
        
        // モーダルを閉じる
        const modalEl = document.getElementById('itemModal');
        if (modalEl) {
          const modal = window.bootstrap.Modal.getInstance(modalEl);
          if (modal) {
            modal.hide();
          }
        }
      } catch (error: any) {
        handleApiError(error, '更新');
      }
    };

    const deleteClick = async (id: number) => {
      if (!confirm('削除してもよろしいですか？')) {
        return;
      }
      
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.delete(`${API_URL}item/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        await refreshData();
        alert(response.data.message || response.data);
      } catch (error: any) {
        handleApiError(error, '削除');
      }
    };

    const imageUpload = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (!target.files || !target.files[0]) {
        return;
      }
      
      // エラーをクリア
      if (formErrors.value.PhotoFileName) {
        delete formErrors.value.PhotoFileName;
      }
      
      const formData = new FormData();
      formData.append('file', target.files[0]);
      
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(
          `${API_URL}item/savefile`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        PhotoFileName.value = response.data;
      } catch (error: any) {
        console.error("Error uploading image:", error);
        if (error.response && error.response.status === 401) {
          router.push('/login');
          return;
        }
        
        formErrors.value.PhotoFileName = '画像のアップロードに失敗しました';
        serverMessage.value = '画像のアップロードエラー';
        
        if (error.response && error.response.data && error.response.data.message) {
          formErrors.value.PhotoFileName = error.response.data.message;
        }
      }
    };

    onMounted(() => {
      refreshData();
    });

    return {
      items,
      companies,
      categories,
      modalTitle,
      ItemId,
      ItemName,
      Company,
      CategoryId,
      DateOfJoining,
      Abstract,
      Price,
      PhotoFileName,
      photoPath,
      formErrors,
      serverMessage,
      addClick,
      editClick,
      createClick,
      updateClick,
      deleteClick,
      imageUpload
    };
  }
});
</script>