<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Header -->
        <h1 class="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          🚀 Breakout Scalper Analysis
        </h1>

        <!-- Input Section -->
        <div class="bg-white rounded-2xl shadow p-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-600 mb-1">Pair</label>
            <input v-model="pair" type="text" placeholder="e.g. XAU/USD"
              class="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-600 mb-1">Interval</label>
            <select v-model="interval"
              class="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="1">1 min</option>
              <option value="5">5 min</option>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">1 h</option>
              <option value="120">2 h</option>
              <option value="240">4 h</option>
              <option value="480">8 h</option>
              <option value="1440">1 day</option>
              <option value="10080">1 week</option>
              <option value="43200">1 month</option>
            </select>
          </div>

          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-600 mb-1">Output Size</label>
            <input v-model.number="outputSize" type="number" placeholder="e.g. 100"
              class="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <button @click="loadAnalysis"
            class="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition-colors">
            🔍 Analyze
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-gray-500 italic text-center">Fetching analysis...</div>

        <!-- Analysis Result -->
        <div v-else-if="analysis" class="space-y-6">
          <!-- Signal Highlight -->
          <div class="rounded-2xl p-6 text-center shadow-md border-2" :class="{
            'bg-green-50 border-green-500 text-green-800': analysis.signal === 'Buy',
            'bg-red-50 border-red-500 text-red-800': analysis.signal === 'Sell',
            'bg-gray-50 border-gray-400 text-gray-800': analysis.signal === 'Neutral',
          }">
            <p class="text-lg font-semibold tracking-wide">Signal</p>
            <p class="text-5xl font-extrabold mt-2">{{ analysis.signal }} 🔥</p>
          </div>

          <!-- Basic Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard title="Pair" :value="analysis.pair" />
            <InfoCard title="Date" :value="analysis.date" />
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InfoCard title="ATR" :value="analysis.atr" />
            <InfoCard title="Last Close" :value="analysis.lastClose" />
            <InfoCard title="Range High" :value="analysis.rangeHigh" />
            <InfoCard title="Range Low" :value="analysis.rangeLow" />
            <InfoCard title="Take Profit" :value="analysis.takeProfit" />
            <InfoCard title="Stop Loss" :value="analysis.stopLoss" />
          </div>

          <!-- Action -->
          <!-- <div class="p-6 rounded-2xl shadow-md font-medium leading-relaxed text-center" :class="{
            'bg-green-50 border-green-500 text-green-800': analysis.signal === 'Buy',
            'bg-red-50 border-red-500 text-red-800': analysis.signal === 'Sell',
            'bg-gray-50 border-gray-400 text-gray-800': analysis.signal === 'Neutral',
          }">
            <p class="text-lg font-bold mb-2">Action</p>
            <p>{{ analysis.action }}</p>
          </div> -->
        </div>

        <div v-else class="text-gray-400 italic text-center">
          No analysis yet. Pick pair, interval, and output size to start.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import { fetchBreakoutScalper } from "@/services/investmentApi.js";

// Reusable Info Card component
const InfoCard = {
  props: ["title", "value"],
  template: `
    <div class="bg-white border rounded-xl p-4 shadow hover:shadow-lg transition">
      <p class="text-sm text-gray-500">{{ title }}</p>
      <p class="font-semibold text-gray-900 text-lg mt-1">{{ value }}</p>
    </div>
  `
};

const pair = ref("XAU/USD");
const interval = ref("5");
const outputSize = ref(100);
const loading = ref(false);
const analysis = ref(null);

async function loadAnalysis() {
  try {
    loading.value = true;
    analysis.value = await fetchBreakoutScalper({
      pair: pair.value,
      interval: interval.value,
      outputSize: outputSize.value,
    });
  } catch (err) {
    console.error("Failed to load analysis", err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Optional: smooth transition for hover effects */
</style>
