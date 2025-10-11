<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4">
     
      <nav>
        <router-link to="/" class="mr-4">Home</router-link>
        <router-link to="/settings">Settings</router-link>
      </nav>
    </header>
    
    <main class="flex-grow p-4">
      <slot />
    </main>
    
    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>&copy; 2023 My Ionic Vue App</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
};
</script>

<style scoped>
</style>