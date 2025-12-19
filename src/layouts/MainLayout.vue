<template>
  <div class="flex flex-col min-h-screen ">
    <header class="bg-transparent backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm p-4">
      <div class="flex items-center justify-between">
        <!-- Back Button (Mobile Only) -->
        <button 
          @click="goBack"
          class="md:hidden flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-sm font-medium">Back</span>
        </button>

        <!-- Spacer for desktop (keeps nav centered when back button is hidden) -->
        <div class="hidden md:block"></div>

       
      </div>
    </header>
    
    <main class="flex-grow ">
      <slot />
    </main>
    
    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>&copy; The Institute of Chartered Accountants of Nigeria</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  methods: {
    goBack() {
      try {
        // Check if we can go back in router history
        if (this.$router.options.history.state && this.$router.options.history.state.back) {
          this.$router.go(-1);
        } else {
          // Fallback to home page if no router history
          this.$router.push({ name: 'Home' });
        }
      } catch (error) {
        console.warn('Router navigation failed, using fallback:', error);
        // Final fallback: try to go back, or go to root
        if (window.history.length > 1) {
          this.$router.go(-1);
        } else {
          this.$router.push('/');
        }
      }
    }
  }
};
</script>

<style scoped>
</style>