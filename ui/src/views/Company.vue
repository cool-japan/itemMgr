<template>
  <div>
    <button 
      type="button"
      class="btn btn-primary m-2 fload-end"
      data-bs-toggle="modal"
      data-bs-target="#companyModal"
      @click="addClick"
    >
      会社追加
    </button>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>会社ID</th>
          <th>会社名</th>
          <th>オプション</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dep in companies" :key="dep.CompanyId">
          <td>{{ dep.CompanyId }}</td>
          <td>{{ dep.CompanyName }}</td>
          <td>
            <button 
              type="button"
              class="btn btn-light mr-1"
              data-bs-toggle="modal"
              data-bs-target="#companyModal"
              @click="editClick(dep)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
              </svg>
            </button>
            <button 
              type="button" 
              class="btn btn-light mr-1"
              @click="deleteClick(dep.CompanyId)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 会社追加・編集モーダル -->
    <div class="modal fade" id="companyModal" tabindex="-1" aria-labelledby="companyModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="companyModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="input-group mb-3">
              <span class="input-group-text">会社名</span>
              <input 
                type="text" 
                class="form-control" 
                v-model="CompanyName"
                :class="{'is-invalid': formErrors.CompanyName}"
              />
              <div class="invalid-feedback" v-if="formErrors.CompanyName">{{ formErrors.CompanyName }}</div>
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
              v-if="CompanyId === 0" 
              @click="createClick"
            >
              追加
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              v-if="CompanyId !== 0" 
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
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { API_URL, useFormErrors } from '../composables/useApi';
import axios from 'axios';
import type { Company } from '../types';

declare global {
  interface Window {
    bootstrap: any;
  }
}

export default defineComponent({
  name: 'CompanyView',
  setup() {
    const router = useRouter();
    const companies = ref<Company[]>([]);
    const modalTitle = ref('会社追加');
    const CompanyId = ref(0);
    const CompanyName = ref('');
    const { formErrors, serverMessage, clearErrors, handleApiError } = useFormErrors();

    const refreshData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(`${API_URL}company`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        companies.value = response.data;
      } catch (error: any) {
        console.error('Error fetching companies:', error);
        if (error.response && error.response.status === 401) {
          router.push('/login');
        }
      }
    };

    const addClick = () => {
      modalTitle.value = '会社追加';
      CompanyId.value = 0;
      CompanyName.value = '';
      clearErrors();
    };

    const editClick = (dep: Company) => {
      modalTitle.value = '会社編集';
      CompanyId.value = dep.CompanyId;
      CompanyName.value = dep.CompanyName;
      clearErrors();
    };

    const validateForm = (): boolean => {
      clearErrors();
      
      if (!CompanyName.value || CompanyName.value.trim() === '') {
        formErrors.value.CompanyName = '会社名は必須です';
      }
      
      return Object.keys(formErrors.value).length === 0;
    };

    const createClick = async () => {
      if (!validateForm()) {
        serverMessage.value = '入力内容を確認してください';
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(
          `${API_URL}company`, 
          {
            CompanyName: CompanyName.value
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
        const modalEl = document.getElementById('companyModal');
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
      if (!validateForm()) {
        serverMessage.value = '入力内容を確認してください';
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.put(
          `${API_URL}company`, 
          {
            CompanyId: CompanyId.value,
            CompanyName: CompanyName.value
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
        const modalEl = document.getElementById('companyModal');
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
        const response = await axios.delete(`${API_URL}company/${id}`, {
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

    onMounted(() => {
      refreshData();
    });

    return {
      companies,
      modalTitle,
      CompanyId,
      CompanyName,
      formErrors,
      serverMessage,
      addClick,
      editClick,
      createClick,
      updateClick,
      deleteClick
    };
  }
});
</script>