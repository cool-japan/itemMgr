<template>
  <div class="container">
    <h3 class="d-flex justify-content-center">
      商品管理システム
    </h3>
    <h5 class="d-flex justify-content-center">
      商品管理ポータル
    </h5>

    <nav class="navbar navbar-expand-sm bg-light navbar-dark">
      <ul class="navbar-nav">
        <li class="nav-item m-1">
          <router-link class="btn btn-light btn-outline-primary"
          to="/home">ホーム</router-link>
        </li>
        <li class="nav-item m-1" v-if="isAuthenticated">
          <router-link class="btn btn-light btn-outline-primary"
          to="/company">会社マスタ</router-link>
        </li>
        <li class="nav-item m-1" v-if="isAuthenticated">
          <router-link class="btn btn-light btn-outline-primary"
          to="/item">商品マスタ</router-link>
        </li>
        <li class="nav-item m-1" v-if="isAuthenticated">
          <router-link class="btn btn-light btn-outline-primary"
          to="/category">カテゴリ管理</router-link>
        </li>
        <li class="nav-item m-1" v-if="!isAuthenticated">
          <router-link class="btn btn-light btn-outline-primary"
          to="/login">ログイン</router-link>
        </li>
        <li class="nav-item m-1" v-if="isAuthenticated">
          <a class="btn btn-light btn-outline-primary" 
             href="#" @click.prevent="logout">ログアウト</a>
        </li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth } from './composables/useApi';

export default defineComponent({
  name: 'App',
  setup() {
    const { isAuthenticated, logout } = useAuth();

    return {
      isAuthenticated,
      logout
    };
  }
});
</script>

<style>
/* グローバルスタイル */
.invalid-feedback {
  display: block;
}
</style>