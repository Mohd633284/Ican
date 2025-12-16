<template>
  <MainLayout>
    <router-view />
  </MainLayout>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import MainLayout from './layouts/MainLayout.vue';

export default defineComponent({
  name: 'App',
  components: {
    MainLayout,
  },
  setup() {
    // Initialize Firebase when app mounts
    onMounted(() => {
      console.log('🚀 App initialized');
      console.log('🔥 Firebase is ready (No authentication required for testing)');
      console.log('� Using Firestore with open rules for development');
    });

    return {};
  },
});
</script>

<style>
/* Global styles can be added here */
</style>