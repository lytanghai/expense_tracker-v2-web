<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-screen-md rounded-lg px-4 py-4 text-base text-white shadow-lg"
      :class="color"
    >
      <div class="absolute top-4 left-4">
        <!-- Checkmark Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53-1.624-1.624a.75.75 0 10-1.06 1.06l2.25 2.25c.28.28.73.23.94-.1l3.75-5.25z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-8 mr-12">
        <h5 class="text-xl font-semibold">{{ title }}</h5>
        <p class="mt-2 text-white">{{ message }}</p>
      </div>
      <button
        class="absolute top-3 right-3 rounded-lg p-1 hover:bg-white hover:bg-opacity-20"
        @click="show = false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { useNotification } from "@/stores/notification";

const { show, title, message, color } = useNotification();
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
