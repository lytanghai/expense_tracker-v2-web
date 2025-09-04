<template>
  <router-view />

  <!-- Transparent loading overlay -->
  <div v-if="loadingStore.loading"
    class="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
    <!-- Top linear bar with gradient animation -->
    <div class="fixed top-0 left-0 w-full h-1 bg-gray-300 overflow-hidden">
      <div class="h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 transition-all duration-100"
        :style="{ width: loadingStore.progress + '%' }"></div>
    </div>

    <!-- Center loader circle -->
    <div class="flex flex-col items-center justify-center space-y-4">
      <div class="w-16 h-16 border-4 border-t-teal-500 border-gray-200 rounded-full animate-spin"></div>
      <div class="text-2xl font-bold text-white drop-shadow-lg">
        {{ loadingStore.progress }}%
      </div>
    </div>
  </div>

  <SuccessAlert />
  <ConfirmModal />
</template>

<script setup>
import { useLoadingStore } from '@/stores/loading'
import SuccessAlert from './components/SuccessAlert.vue';
import ConfirmModal from './components/ConfirmModal.vue';
const loadingStore = useLoadingStore()
</script>

<style scoped>
@keyframes loading-bar {
  0% {
    width: 0%;
  }

  100% {
    width: 100%;
  }
}

.animate-loading-bar {
  animation: loading-bar 1s linear infinite;
}
</style>
