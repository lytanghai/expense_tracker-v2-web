<template>
  <transition name="fade">
    <div v-if="show" class="fixed bottom-6 right-6 max-w-sm p-4 rounded-xl shadow-lg bg-white border-l-4" :class="{
      'border-green-500': type === 'create',
      'border-blue-500': type === 'update',
      'border-red-500': type === 'delete'
    }">
      <h2 class="font-semibold text-lg mb-1" :class="titleColor">{{ title }}</h2>
      <p class="text-gray-600">{{ message }}</p>
    </div>
  </transition>
</template>

<script setup>
import { computed } from "vue";

const { show, title, message, type } = useNotification();

const titleColor = computed(() => {
  if (type === "success" || type === "create") {
    color.value = "bg-green-500"
  } else if (type === "update") {
    color.value = "bg-blue-500"
  } else if (type === "delete") {
    color.value = "bg-red-500"
  } else if (type === "error") {
    color.value = "bg-red-500" // or "bg-red-600" if you prefer
  }
  return "text-gray-800";
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
