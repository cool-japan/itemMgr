<template>
  <div>
    <div class="jumbotron text-center mt-5">
      <h1>商品管理システムへようこそ</h1>
      <p>商品マスタと会社マスタの管理ができます</p>
      <p v-if="isAuthenticated">
        <router-link class="btn btn-primary" to="/item">商品管理を開始</router-link>
      </p>
      <p v-else>
        <router-link class="btn btn-primary" to="/login">ログインして開始</router-link>
      </p>
    </div>

    <div class="row mt-5">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">商品マスタ管理</h5>
            <p class="card-text">商品の追加、編集、削除ができます。</p>
            <router-link to="/item" class="btn btn-outline-primary" v-if="isAuthenticated">商品マスタへ</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">会社マスタ管理</h5>
            <p class="card-text">会社情報の追加、編集、削除ができます。</p>
            <router-link to="/company" class="btn btn-outline-primary" v-if="isAuthenticated">会社マスタへ</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">カテゴリ管理</h5>
            <p class="card-text">商品カテゴリの追加、編集、削除ができます。</p>
            <router-link to="/category" class="btn btn-outline-primary" v-if="isAuthenticated">カテゴリ管理へ</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth } from '../composables/useApi';

export default defineComponent({
  name: 'Home',
  setup() {
    const { isAuthenticated } = useAuth();

    return {
      isAuthenticated
    };
  }
});
</script>