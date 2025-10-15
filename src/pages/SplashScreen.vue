<template>
  <div class="fixed inset-0 bg-gradient-to-br from-indigo-900 via-blue-800 to-teal-700 flex items-center justify-center z-50 overflow-hidden">
    <!-- Animated Background Pattern -->
    <div class="fixed inset-0 opacity-20 pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(16,185,129,0.4),_transparent_50%)] animate-pulse-slow"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(6,182,212,0.3),_transparent_50%)] animate-pulse-slow" style="animation-delay: 1s"></div>
    </div>

    <!-- Floating Particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div v-for="i in 20" :key="i" 
           class="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
           :style="{
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 5}s`,
             animationDuration: `${5 + Math.random() * 10}s`
           }">
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative text-center px-6 animate-fade-in-up">
      <!-- Logo Container with Glow Effect -->
      <div class="mb-8 relative">
        <!-- Glow Effect -->
        <div class="absolute inset-0 blur-3xl bg-emerald-400/30 rounded-full animate-pulse-glow"></div>
        
        <!-- Logo -->
        <div class="relative">
          <div class="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl animate-scale-in">
            <img
              src="/images/ican-web-logo.png"
              alt="ICAN Logo"
              class="w-32 h-32 md:w-48 md:h-48 mx-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      <!-- Brand Name with Elegant Typography -->
      <div class="mb-6 space-y-3">
        <h1 class="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight animate-slide-in-left">
          Institute of Chartered
        </h1>
        <h1 class="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight animate-slide-in-right">
          Accountants of Nigeria
        </h1>
        
        <!-- Abbreviation Badge -->
        <div class="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full animate-fade-in" style="animation-delay: 0.5s">
          <span class="text-2xl md:text-3xl font-black text-emerald-300 tracking-wider">ICAN</span>
        </div>
      </div>

      <!-- Tagline -->
      <p class="text-emerald-100 text-base md:text-lg mb-8 font-light tracking-wide animate-fade-in" style="animation-delay: 0.7s">
        Professional Excellence in Accounting
      </p>

      <!-- Modern Loading Bar -->
      <div class="max-w-xs mx-auto animate-fade-in" style="animation-delay: 1s">
        <!-- Loading Bar Background -->
        <div class="relative h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <!-- Animated Loading Progress -->
          <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 rounded-full animate-loading-bar shadow-lg shadow-emerald-500/50"></div>
        </div>
        
        <!-- Loading Text -->
        <div class="flex items-center justify-center gap-2 mt-4">
          <div class="flex gap-1">
            <div class="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
          <span class="text-emerald-200 text-sm font-medium">Loading your workspace</span>
        </div>
      </div>

      <!-- Version Badge -->
      <div class="mt-12 animate-fade-in" style="animation-delay: 1.5s">
        <span class="inline-block px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs text-white/60 font-medium">
          Version 1.0 • {{ new Date().getFullYear() }}
        </span>
      </div>
    </div>

    <!-- Bottom Decoration -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SplashScreen',
  setup() {
    const router = useRouter();

    onMounted(() => {
      // Show splash screen for 3 seconds, then redirect to HomePage
      setTimeout(() => {
        router.replace({ name: 'Home' });
      }, 3000);
    });

    return {};
  }
});
</script>

<style scoped>
/* Fade In Up Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

/* Scale In Animation */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Slide In Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slideInLeft 0.8s ease-out 0.2s both;
}

.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out 0.3s both;
}

/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out both;
}

/* Pulse Slow Animation */
@keyframes pulseSlow {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.05);
  }
}

.animate-pulse-slow {
  animation: pulseSlow 4s ease-in-out infinite;
}

/* Pulse Glow Animation */
@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.4;
    transform: scale(1);
  }
}

.animate-pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

/* Loading Bar Animation */
@keyframes loadingBar {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

.animate-loading-bar {
  animation: loadingBar 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Float Animation for Particles */
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.2;
  }
  50% {
    transform: translateY(-100px) translateX(50px);
    opacity: 0.3;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    transform: translateY(-200px) translateX(-50px);
    opacity: 0;
  }
}

.animate-float {
  animation: float linear infinite;
}
</style>