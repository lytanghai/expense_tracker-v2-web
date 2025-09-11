<template>
  <div class="max-w-lg mx-auto space-y-6">
    <!-- Current Price Card -->
    <div class="bg-white shadow-xl rounded-2xl p-6 border-l-8 border-yellow-500 hover:shadow-2xl transition duration-300">
      <div class="flex items-center mb-4">
        <div class="bg-yellow-500 p-2 rounded-full mr-3">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-700">Gold Price (XAU)</h3>
      </div>

      <!-- <div v-if="initialLoading" class="text-gray-400 text-lg">Loading...</div> -->
      <div>
        <p class="text-3xl font-bold text-gray-900 mb-1">${{ priceData.price.toLocaleString() }}</p>
        <p class="text-sm text-gray-500">{{ priceData.updated_text }}</p>
        <p class="text-xs text-gray-400 mt-1">Symbol: {{ priceData.symbol }}</p>
      </div>
    </div>

    <!-- Price History Component -->
    <PriceHistory :history="historyList" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { fetchGoldPrice } from "@/services/investmentApi.js";
import PriceHistory from "./sub/MarketPriceHistory.vue";

const priceData = ref({
  asset_name: "",
  price: 0,
  symbol: "",
  updated_text: "",
  history: {},
});
const historyList = ref([]);
const initialLoading = ref(true);

let intervalId = null;

async function loadGoldPrice() {
  try {
    const data = await fetchGoldPrice();

    // Update current price
    priceData.value.price = data.price;
    priceData.value.updated_text = data.updated_text;

    // Append new history entries without duplicates
    if (data.history) {
      Object.entries(data.history).forEach(([date, price]) => {
        if (!historyList.value.find(item => item.date === date)) {
          historyList.value.push({ date, price });
        }
      });
      // Sort by date ascending
      historyList.value.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  } catch (err) {
    console.error("Failed to load gold price:", err);
  } finally {
  }
}

onMounted(() => {
  // Initial load
  loadGoldPrice();

  // Poll every 1 minute
  intervalId = setInterval(loadGoldPrice, 60000);
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
