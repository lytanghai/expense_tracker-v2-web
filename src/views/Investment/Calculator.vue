<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-5xl mx-auto space-y-8">

        <!-- Spot Trade Calculator -->
        <div class="rounded-2xl shadow-xl bg-white p-6 border border-gray-200 space-y-6">
          <br><br>
          <h2 class="text-xl font-bold text-gray-800 text-center">📊 Spot Trade Calculator</h2>
          <p class="text-center text-gray-500 text-sm">Estimate your profit and loss (PnL)</p>

          <div class="grid gap-6 md:grid-cols-4">
            <!-- Coin -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Coin</label>
              <input type="text" v-model="coinSymbol" placeholder="e.g., BTC"
                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <p v-if="currentPrice" class="text-xs text-gray-500 mt-1">
                Current Price: <span class="font-medium">${{ currentPrice }}</span>
              </p>
            </div>

            <!-- Investment in USD -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Investment (USD)</label>
              <input type="number" v-model.number="amountUsd" placeholder="e.g., 1000"
                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <p v-if="coinsBought > 0" class="text-xs text-gray-500 mt-1">
                You buy ~<span class="font-medium">{{ coinsBought.toFixed(6) }}</span> {{ coinSymbol }}
              </p>
            </div>

            <!-- Buy -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Buy at</label>
              <input type="number" v-model.number="buyPrice" placeholder="Enter buy price"
                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <!-- Sell -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Sell at</label>
              <input type="number" v-model.number="sellPrice" placeholder="Enter sell price"
                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <!-- PnL Result -->
          <div class="bg-gray-50 rounded-xl p-5 text-center shadow-inner space-y-2">
            <p class="text-sm text-gray-500">Profit / Loss</p>
            <p class="text-2xl font-bold" :class="pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ pnlPercent.toFixed(2) }}%
            </p>
            <p class="text-lg font-semibold" :class="pnlUsd >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ pnlUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} USD
            </p>
          </div>
        </div>
        <!-- Conversion Cards -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- USDC → USD -->
          <div class="rounded-2xl shadow-xl bg-white p-6 space-y-6 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-800 text-center">USDC → USD</h2>
            <p class="text-center text-gray-500 text-sm">Quick conversion with real-time input</p>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">USDC Amount</label>
              <input type="number" v-model.number="usdcAmount" placeholder="Enter USDC"
                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="bg-gray-50 rounded-xl p-5 text-center shadow-inner">
              <p class="text-sm text-gray-500 mb-1">USD Equivalent</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ usdEquivalent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }} USD
              </p>
            </div>

            <p class="text-center text-xs text-gray-500">
              Conversion rate: <span class="font-medium">100 USDC = 1 USD</span>
            </p>
          </div>

          <!-- USD → USDC -->
          <div class="rounded-2xl shadow-xl bg-white p-6 space-y-6 border border-gray-200">
            <h2 class="text-xl font-bold text-gray-800 text-center">USD → USDC</h2>
            <p class="text-center text-gray-500 text-sm">Convert back to USDC quickly</p>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">USD Amount</label>
              <input type="number" v-model.number="usdAmount" placeholder="Enter USD"
                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div class="bg-gray-50 rounded-xl p-5 text-center shadow-inner">
              <p class="text-sm text-gray-500 mb-1">USDC Equivalent</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ usdcFromUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }} USDC
              </p>
            </div>

            <p class="text-center text-xs text-gray-500">
              Conversion rate: <span class="font-medium">1 USD = 100 USDC</span>
            </p>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Sidebar from "@/components/Sidebar.vue";

// Conversion logic
const usdcAmount = ref(100);
const usdAmount = ref(1);
const usdEquivalent = computed(() => usdcAmount.value / 100);
const usdcFromUsd = computed(() => usdAmount.value * 100);

// Spot Trade Calculator
const coinSymbol = ref("BTC");
const amountUsd = ref(1000); // investment in USD
const buyPrice = ref(0);
const sellPrice = ref(0);
const currentPrice = ref(null);

// Watch coin symbol change
watch(coinSymbol, (newVal) => {
  // if (newVal) fetchCoinPrice(newVal);
});

// Coins bought = investment / buy price
const coinsBought = computed(() => {
  if (buyPrice.value > 0 && amountUsd.value > 0) {
    return amountUsd.value / buyPrice.value;
  }
  return 0;
});

// Compute PnL percentage
const pnlPercent = computed(() => {
  if (buyPrice.value > 0 && sellPrice.value > 0) {
    return ((sellPrice.value - buyPrice.value) / buyPrice.value) * 100;
  }
  return 0;
});

// Compute PnL in USD
const pnlUsd = computed(() => {
  if (buyPrice.value > 0 && sellPrice.value > 0 && amountUsd.value > 0) {
    return (sellPrice.value - buyPrice.value) * (amountUsd.value / buyPrice.value);
  }
  return 0;
});

// Initial fetch
// fetchCoinPrice(coinSymbol.value);
</script>
