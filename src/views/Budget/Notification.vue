<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />
    <!-- Main Content -->
    <main class="flex-1 p-6 bg-gray-100">
        <UnderDevelopment />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
import UnderDevelopment from '@/components/UnderDevelopment.vue';
</script>

<style scoped></style>
