<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">{{ isRegistering ? '新規ユーザー登録' : 'ログイン' }}</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="isRegistering ? register() : login()">
              <div class="mb-3">
                <label for="username" class="form-label">ユーザー名</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="username"
                  :class="{'is-invalid': formErrors.username}"
                  required
                />
                <div class="invalid-feedback" v-if="formErrors.username">{{ formErrors.username }}</div>
              </div>
              
              <div class="mb-3" v-if="isRegistering">
                <label for="email" class="form-label">メールアドレス</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  :class="{'is-invalid': formErrors.email}"
                />
                <div class="invalid-feedback" v-if="formErrors.email">{{ formErrors.email }}</div>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">パスワード</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  :class="{'is-invalid': formErrors.password}"
                  required
                />
                <div class="invalid-feedback" v-if="formErrors.password">{{ formErrors.password }}</div>
              </div>
              
              <div class="mb-3" v-if="isRegistering">
                <label for="password2" class="form-label">パスワード(確認)</label>
                <input
                  type="password"
                  class="form-control"
                  id="password2"
                  v-model="password2"
                  :class="{'is-invalid': formErrors.password2}"
                  required
                />
                <div class="invalid-feedback" v-if="formErrors.password2">{{ formErrors.password2 }}</div>
              </div>
              
              <div class="alert alert-danger" v-if="serverMessage">
                {{ serverMessage }}
              </div>
              
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">
                  {{ isRegistering ? '登録' : 'ログイン' }}
                </button>
              </div>
            </form>
            
            <div class="text-center mt-3">
              <a href="#" @click.prevent="toggleMode">
                {{ isRegistering ? 'アカウントをお持ちの方はこちら' : '新規ユーザー登録はこちら' }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_URL, useFormErrors } from '../composables/useApi';
import type { User } from '../types';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const isRegistering = ref(false);
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const password2 = ref('');
    
    const { formErrors, serverMessage, clearErrors, handleApiError } = useFormErrors();
    
    const toggleMode = () => {
      isRegistering.value = !isRegistering.value;
      clearErrors();
    };
    
    const validateForm = (): boolean => {
      clearErrors();
      
      if (!username.value.trim()) {
        formErrors.value.username = 'ユーザー名は必須です';
      }
      
      if (!password.value) {
        formErrors.value.password = 'パスワードは必須です';
      }
      
      if (isRegistering.value) {
        if (email.value && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          formErrors.value.email = 'メールアドレスの形式が正しくありません';
        }
        
        if (password.value.length < 8) {
          formErrors.value.password = 'パスワードは8文字以上である必要があります';
        }
        
        if (password.value !== password2.value) {
          formErrors.value.password2 = 'パスワードが一致しません';
        }
      }
      
      return Object.keys(formErrors.value).length === 0;
    };
    
    const login = async () => {
      if (!validateForm()) return;
      
      try {
        const response = await axios.post(`${API_URL}auth/login/`, {
          username: username.value,
          password: password.value
        });
        
        // JWTトークンをローカルストレージに保存
        localStorage.setItem('access_token', response.data.access);
        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
        }
        
        // ホームページにリダイレクト
        router.push('/');
      } catch (error: any) {
        handleApiError(error, 'ログイン');
        
        if (error.response && error.response.status === 401) {
          serverMessage.value = 'ユーザー名またはパスワードが正しくありません';
        }
      }
    };
    
    const register = async () => {
      if (!validateForm()) return;
      
      try {
        const userData: User = {
          username: username.value,
          password: password.value
        };
        
        if (email.value) {
          userData.email = email.value;
        }
        
        const response = await axios.post(`${API_URL}auth/register/`, userData);
        
        // 登録成功
        alert('ユーザー登録が完了しました。ログインしてください。');
        
        // ログインモードに切り替え
        isRegistering.value = false;
        password.value = '';
        
      } catch (error: any) {
        handleApiError(error, '登録');
      }
    };
    
    return {
      isRegistering,
      username,
      email,
      password,
      password2,
      formErrors,
      serverMessage,
      toggleMode,
      login,
      register
    };
  }
});
</script>