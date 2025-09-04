<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 text-center">
    <!-- Icon -->
    <div class="text-9xl mb-6 text-yellow-400 animate-bounce">
      ⚠️
    </div>

    <!-- Title -->
    <h1 class="text-4xl font-bold mb-4">Under Development</h1>

    <!-- Description -->
    <p class="text-gray-600 max-w-md mb-6">
      This feature is not released yet. We are working hard to bring it to you soon!
    </p>

    <!-- Back Button -->
    <button
      @click="goBack"
      class="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition"
    >
      Go Back
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back() // Navigate to previous page
}
</script>

<style scoped>
/* Optional: bounce animation for the warning icon */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.animate-bounce {
  animation: bounce 1.5s infinite;
}
</style>
