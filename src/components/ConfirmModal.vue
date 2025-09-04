<!-- src/components/ConfirmModal.vue -->
<template>
  <div v-if="confirmStore.show" class="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
    <div class="bg-white rounded-2xl w-11/12 max-w-sm p-6 shadow-2xl">
      <h3 class="text-lg font-bold text-gray-800 mb-4">Confirmation</h3>
      <p class="text-gray-600 mb-6">{{ confirmStore.message }}</p>
      <div class="flex justify-end space-x-2">
        <button @click="confirmStore.no" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">No</button>
        <button @click="confirmStore.yes" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Yes</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useConfirmStore } from '@/stores/confirm'
const confirmStore = useConfirmStore()
</script>
