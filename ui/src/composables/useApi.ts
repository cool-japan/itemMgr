import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const API_URL = "/api/";
export const PHOTO_URL = "/api/Photos/";

export function useAuth() {
  const router = useRouter();
  const isAuthenticated = computed(() => {
    const token = localStorage.getItem('access_token');
    return token !== null;
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const getAuthHeaders = (): { Authorization: string } | {} => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const createAuthAxios = (): AxiosInstance => {
    const token = localStorage.getItem('access_token');
    return axios.create({
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  };

  return {
    isAuthenticated,
    logout,
    getAuthHeaders,
    createAuthAxios
  };
}

export function useApiRequest<T>(url: string, options?: AxiosRequestConfig) {
  const data = ref<T | null>(null);
  const error = ref<any>(null);
  const loading = ref<boolean>(false);
  const { createAuthAxios } = useAuth();

  const fetchData = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      const axiosAuth = createAuthAxios();
      const response: AxiosResponse<T> = await axiosAuth.get(url, options);
      data.value = response.data;
    } catch (err: any) {
      error.value = err;
      if (err.response && err.response.status === 401) {
        const router = useRouter();
        router.push('/login');
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    error,
    loading,
    fetchData
  };
}

export function useFormErrors() {
  const formErrors = ref<Record<string, string>>({});
  const serverMessage = ref<string>('');

  const clearErrors = () => {
    formErrors.value = {};
    serverMessage.value = '';
  };

  const handleApiError = (error: any, action: string) => {
    console.error(`Error ${action}:`, error);
    
    let errorMessage = `操作(${action})に失敗しました`;
    formErrors.value = {};
    
    if (error.response) {
      if (error.response.status === 401) {
        const router = useRouter();
        router.push('/login');
        return;
      }
      
      if (error.response.data) {
        if (error.response.data.errors) {
          // 新しいAPIエラー形式
          formErrors.value = error.response.data.errors;
          serverMessage.value = error.response.data.message || errorMessage;
        } else {
          // 従来のエラー形式
          for (const field in error.response.data) {
            formErrors.value[field] = Array.isArray(error.response.data[field]) 
              ? error.response.data[field].join(', ') 
              : error.response.data[field];
          }
          serverMessage.value = errorMessage;
        }
      }
    } else {
      formErrors.value['全般'] = `エラーが発生しました: ${error.message || '不明なエラー'}`;
      serverMessage.value = errorMessage;
    }
  };

  return {
    formErrors,
    serverMessage,
    clearErrors,
    handleApiError
  };
}