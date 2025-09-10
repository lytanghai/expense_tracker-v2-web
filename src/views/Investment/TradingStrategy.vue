<template>
  <div class="flex">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 bg-gray-100 min-h-screen">
      <h2 class="text-3xl font-bold mb-6">Available Strategies</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Strategy Card -->
        <div
          v-for="(strategy, index) in strategies"
          :key="index"
          class="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Title -->
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            {{ strategy.title }}
          </h3>

          <!-- Description -->
          <p class="text-gray-600 mb-4 flex-1">
            {{ strategy.description }}
          </p>

          <!-- Pick Button -->
          <button
            @click="pickStrategy(strategy.route)"
            class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Pick
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";

const router = useRouter();

const strategies = [
  {
    title: "EMA-RSI Trend Filter",
    description:
      "Uses EMA crossover and RSI confirmation with volatility and performance filters.",
    route: "/strategy/ema-rsi",
  },
  {
    title: "Breakout Scalper",
    description:
      "Focuses on high-volatility breakout patterns with strict risk management.",
    route: "/strategy/breakout-scalper",
  },
  {
    title: "Range Reversal",
    description:
      "Identifies support/resistance zones and trades reversals with tight stops.",
    route: "/strategy/range",
  },
];

function pickStrategy(route) {
  router.push(route);
}
</script>
