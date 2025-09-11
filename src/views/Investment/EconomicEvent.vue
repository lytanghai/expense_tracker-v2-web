<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 bg-gray-100 overflow-y-auto">
      <!-- Header -->
      <!-- <h2 class="text-3xl font-bold mb-6 text-center">Economic Dashboard</h2> -->

      <!-- Top Row: SessionTime (Left) & MarketPrice (Right) -->
      <div class="flex flex-wrap gap-6 mb-6">
        <!-- Session Time (Top Left) -->
        <div class="flex-1 min-w-[300px]">
          <SessionTime />
        </div>

        <!-- Market Price (Top Right) -->
        <div class="flex-1 min-w-[300px]">
          <MarketPrice />
        </div>
      </div>

      <!-- Bottom Row: Economic Calendar -->
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
import MarketPrice from "./MarketPrice.vue";
</script>
