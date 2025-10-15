<template>
  <div class="flex flex-col min-h-screen ">
    <header class=" bg-gradient-to-br from-indigo-900 via-blue-800 to-teal-700 text-white p-4">
     
      <nav>
        <router-link to="/home" class="mr-4">Home</router-link>
        <router-link to="/settings">Settings</router-link>
      </nav>
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
};
</script>

<style scoped>
</style>