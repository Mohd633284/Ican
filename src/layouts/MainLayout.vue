<template>
  <div class="flex flex-col min-h-screen ">
    <header class="bg-gradient-to-br from-indigo-900 via-blue-800 to-teal-700 text-white p-4">
      <div class="flex items-center justify-between">
        <!-- Back Button (Mobile Only) -->
        <button 
          @click="goBack"
          class="md:hidden flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-sm font-medium">Back</span>
        </button>

        <!-- Spacer for desktop (keeps nav centered when back button is hidden) -->
        <div class="hidden md:block"></div>

        <!-- Navigation Links -->
        <nav class="flex items-center gap-4">
          <router-link to="/home" class="hover:text-gray-200 transition-colors font-medium">Home</router-link>
          <router-link to="/settings" class="hover:text-gray-200 transition-colors font-medium">Settings</router-link>
        </nav>
      </div>
    </header>
    
    <main class="flex-grow ">
      <slot />
    </main>
    
    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>&copy; Institute of Chartered Accountants of Nigeria</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  methods: {
    goBack() {
      // Go back in browser history, or to home if no history
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push('/home');
      }
    }
  }
};
</script>

<style scoped>
</style>