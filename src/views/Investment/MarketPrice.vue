<template>
  <div class="max-w-lg mx-auto space-y-6">
    <!-- Input controls -->
    <div class="bg-white p-4 rounded-xl shadow-md flex gap-3">
      <input
        v-model="fromSymbol"
        placeholder="From Symbol (e.g. XAUT)"
        class="flex-1 border rounded-lg p-2 text-sm"
      />
      <input
        v-model="toSymbol"
        placeholder="To Symbol (e.g. USD)"
        class="flex-1 border rounded-lg p-2 text-sm"
      />
      <button
        @click="loadPrice"
        class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
      >
        Fetch
      </button>
    </div>

    <!-- Current Price Card -->
    <div class="bg-white shadow-xl rounded-2xl p-6 border-l-8 border-yellow-500 hover:shadow-2xl transition duration-300">
      <div class="flex items-center mb-4">
        <div class="bg-yellow-500 p-2 rounded-full mr-3">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-700">{{ priceData.name }} Price</h3>
      </div>

      <div>
        <p class="text-3xl font-bold text-gray-900 mb-1">
          ${{ priceData.price.toLocaleString() }}
        </p>
        <p class="text-sm text-gray-500">Updated: {{ priceData.last_updated }}</p>
        <p class="text-xs text-gray-400 mt-1">Pair: {{ priceData.from_symbol }}/{{ priceData.to_symbol }}</p>
      </div>
    </div>

    <!-- Price History Component -->
    <PriceHistory :history="historyList" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { fetchCmcPrice } from "@/services/investmentApi.js";
import PriceHistory from "./sub/MarketPriceHistory.vue";

const priceData = ref({
  name: "",
  from_symbol: "",
  to_symbol: "",
  price: 0,
  last_updated: ""
});

const historyList = ref([]);
const fromSymbol = ref("XAUT"); // default input
const toSymbol = ref("USD");    // default input
let intervalId = null;

async function loadPrice() {
  try {
    const data = await fetchCmcPrice(fromSymbol.value, toSymbol.value);
    priceData.value = data;

    // Add to history
    const date = new Date(data.last_updated).toISOString().slice(0, 16); // minute precision
    if (!historyList.value.find(item => item.date === date)) {
      historyList.value.push({ date, price: data.price });
    }
    historyList.value.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (err) {
    console.error("Failed to load price:", err);
  }
}

onMounted(() => {
  loadPrice();
  intervalId = setInterval(loadPrice, 60000 * 5); // poll every 5 minute
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
