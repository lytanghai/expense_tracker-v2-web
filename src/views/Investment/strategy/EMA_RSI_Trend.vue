<template>
  <div class="flex">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-6 min-h-screen">
      <div class="bg-white rounded-2xl shadow-lg p-6 w-full space-y-6">
        <!-- Header -->
        <h2 class="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          📈 EMA-RSI Trend Analysis
        </h2>

        <!-- Input Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            v-model="pair"
            type="text"
            placeholder="Pair (e.g. XAU/USD)"
            class="border text-center rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            v-model="interval"
            class="border text-center rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="5">5 min</option>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="60">60 min</option>
          </select>
          <button
            @click="loadAnalysis"
            class="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            🔍 Analyze
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-gray-500 italic">Fetching analysis...</div>

        <!-- Result -->
        <div v-else-if="analysis" class="space-y-6">
          <!-- Pair & Date -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-blue-50 rounded-lg p-4 shadow-md">
              <p class="text-sm text-gray-600 font-medium">Pair</p>
              <p class="text-xl font-bold text-gray-900">{{ analysis.pair }}</p>
            </div>
            <div class="bg-blue-50 rounded-lg p-4 shadow-md">
              <p class="text-sm text-gray-600 font-medium">Date</p>
              <p class="text-xl font-bold text-gray-900">{{ analysis.date }}</p>
            </div>
          </div>

          <!-- 🔴 Highlight Signal -->
          <div
            class="rounded-xl p-6 shadow-md text-center"
            :class="{
              'bg-green-100 border-2 border-green-500 text-green-800': analysis.signal === 'Buy',
              'bg-red-100 border-2 border-red-500 text-red-800': analysis.signal === 'Sell',
              'bg-gray-100 border-2 border-gray-400 text-gray-800': analysis.signal === 'Neutral',
            }"
          >
            <p class="text-lg font-semibold uppercase tracking-wide">Signal</p>
            <p class="text-4xl font-extrabold mt-2">{{ analysis.signal }} 🔥</p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white border-l-4 border-blue-500 rounded-lg p-4 shadow hover:shadow-lg transition">
              <p class="text-sm text-gray-500 font-medium">Win Rate</p>
              <p class="text-lg font-semibold text-gray-900">{{ analysis.win_rate }}</p>
            </div>
            <div class="bg-white border-l-4 border-purple-500 rounded-lg p-4 shadow hover:shadow-lg transition">
              <p class="text-sm text-gray-500 font-medium">Interval</p>
              <p class="text-lg font-semibold text-gray-900">{{ analysis.interval }}</p>
            </div>
            <div class="bg-white border-l-4 border-green-500 rounded-lg p-4 shadow hover:shadow-lg transition">
              <p class="text-sm text-gray-500 font-medium">RSI</p>
              <p class="text-lg font-semibold text-gray-900">{{ analysis.rsi }}</p>
            </div>
            <div class="bg-white border-l-4 border-yellow-500 rounded-lg p-4 shadow hover:shadow-lg transition">
              <p class="text-sm text-gray-500 font-medium">ATR</p>
              <p class="text-lg font-semibold text-gray-900">{{ analysis.atr }}</p>
            </div>
          </div>

          <!-- Recent Performance -->
          <div class="bg-yellow-50 rounded-lg p-4 shadow-md border-l-4 border-yellow-500">
            <p class="text-sm text-gray-500 font-medium">Recent Performance</p>
            <p class="text-lg font-semibold text-gray-900">{{ analysis.recent_performance }}</p>
          </div>

          <!-- Action -->
          <div
            class="p-5 rounded-xl shadow-md font-medium leading-relaxed"
            :class="{
              'bg-green-50 border-l-4 border-green-500 text-green-900': analysis.signal === 'Buy',
              'bg-red-50 border-l-4 border-red-500 text-red-900': analysis.signal === 'Sell',
              'bg-gray-50 border-l-4 border-gray-400 text-gray-800': analysis.signal === 'Neutral',
            }"
          >
            <p class="font-bold text-lg mb-1">Action</p>
            <p>{{ analysis.action }}</p>
          </div>
        </div>

        <!-- Empty -->
        <div v-else class="text-gray-400 italic">
          No analysis yet. Pick pair and interval to start.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import { fetchEmaRsiAnalysis } from "@/services/investmentApi.js";

const pair = ref("XAU/USD");
const interval = ref("5");
const loading = ref(false);
const analysis = ref(null);

async function loadAnalysis() {
  try {
    loading.value = true;
    analysis.value = await fetchEmaRsiAnalysis({
      pair: pair.value,
      interval: interval.value,
    });
  } catch (err) {
    console.error("Failed to load analysis", err);
  } finally {
    loading.value = false;
  }
}
</script>
