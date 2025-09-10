<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 bg-gray-100 overflow-y-auto">
      <!-- Header -->
      <h2 class="text-3xl font-bold mb-6 text-center">Economic Dashboard</h2>

      <!-- Top Row: Forex Session (centered) -->
      <div class="flex justify-center mb-6">
        <div class="w-full md:w-2/3 lg:w-1/2">
          <SessionTime />
        </div>
      </div>

      <!-- Second Row: Economic Calendar (full width) -->
      <div>
        <CalendarEvent />
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
import SessionTime from "./SessionTime.vue";
import CalendarEvent from "./CalendarEvent.vue";
</script>
