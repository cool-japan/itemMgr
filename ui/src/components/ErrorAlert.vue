<template>
  <div v-if="message && hasErrors" class="alert alert-danger" role="alert">
    <h5>{{ message }}</h5>
    <ul v-if="!flatList">
      <li v-for="(error, field) in errors" :key="field">{{ field }}: {{ error }}</li>
    </ul>
    <ul v-else>
      <li v-for="(error, index) in Object.values(errors)" :key="index">{{ error }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';

export default defineComponent({
  name: 'ErrorAlert',
  props: {
    errors: {
      type: Object as PropType<Record<string, string>>,
      required: true
    },
    message: {
      type: String,
      default: 'エラーが発生しました'
    },
    flatList: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const hasErrors = computed(() => {
      return Object.keys(props.errors).length > 0;
    });

    return {
      hasErrors
    };
  }
});
</script>