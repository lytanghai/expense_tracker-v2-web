<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <div class="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
        <!-- USDC → USD Card -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-3xl shadow-2xl p-6 space-y-6">
          <h2 class="text-2xl font-extrabold text-center tracking-wide">USDC → USD</h2>
          <p class="text-center text-blue-100">Quick conversion with real-time input</p>

          <div>
            <label class="block text-sm font-medium text-white mb-2">USDC Amount</label>
            <input
              type="number"
              v-model.number="usdcAmount"
              placeholder="Enter USDC"
              class="w-full p-3 rounded-xl border border-white/30 bg-white/20 placeholder-white/70 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
            />
          </div>

          <div class="bg-white/20 rounded-2xl p-5 text-center shadow-inner backdrop-blur-md">
            <p class="text-sm text-white/70 mb-1">USD Equivalent</p>
            <p class="text-3xl font-bold text-white">
              {{ usdEquivalent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }} USD
            </p>
          </div>

          <div class="text-center text-white/70 text-xs">
            Conversion rate: <span class="font-medium">100 USDC = 1 USD</span>
          </div>
        </div>

        <!-- USD → USDC Card -->
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl shadow-2xl p-6 space-y-6">
          <h2 class="text-2xl font-extrabold text-center tracking-wide">USD → USDC</h2>
          <p class="text-center text-green-100">Convert back to USDC quickly</p>

          <div>
            <label class="block text-sm font-medium text-white mb-2">USD Amount</label>
            <input
              type="number"
              v-model.number="usdAmount"
              placeholder="Enter USD"
              class="w-full p-3 rounded-xl border border-white/30 bg-white/20 placeholder-white/70 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
            />
          </div>

          <div class="bg-white/20 rounded-2xl p-5 text-center shadow-inner backdrop-blur-md">
            <p class="text-sm text-white/70 mb-1">USDC Equivalent</p>
            <p class="text-3xl font-bold text-white">
              {{ usdcFromUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }} USDC
            </p>
          </div>

          <div class="text-center text-white/70 text-xs">
            Conversion rate: <span class="font-medium">1 USD = 100 USDC</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Sidebar from "@/components/Sidebar.vue";

// Conversion logic
const usdcAmount = ref(100);
const usdAmount = ref(1);

const usdEquivalent = computed(() => usdcAmount.value / 100);
const usdcFromUsd = computed(() => usdAmount.value * 100);
</script>

<style scoped>
/* Gradient animation for cards */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientMove 8s ease infinite;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
