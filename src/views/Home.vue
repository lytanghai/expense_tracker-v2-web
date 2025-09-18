<template>
  <div class="flex h-screen overflow-hidden bg-gradient-to-b from-indigo-50 to-purple-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <!-- Intro Section -->
       <br><br>
      <section class="text-center mb-12" ref="introSection">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          🚀 Explore Our Features
        </h1>
        <p class="text-gray-600 text-lg md:text-xl">Discover all the tools and options available</p>
      </section>

      <!-- Slideshow -->
<section class="relative w-full max-w-6xl mx-auto">
  <!-- Slides Wrapper -->
  <div class="overflow-hidden rounded-3xl relative">
    <div
      class="flex transition-transform duration-700 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="feature-card relative overflow-hidden p-8 min-w-full shadow-2xl bg-white border border-indigo-100 cursor-pointer"
      >
        <!-- Spotlight Overlay -->
        <div class="absolute inset-0 pointer-events-none spotlight"></div>

        <div class="relative z-10 text-6xl mb-6">{{ feature.icon }}</div>
        <h3 class="relative z-10 text-3xl font-bold mb-4 text-indigo-800">{{ feature.title }}</h3>
        <p class="relative z-10 text-gray-600 mb-6 text-lg">{{ feature.description }}</p>
        <a
          :href="feature.link"
          class="relative z-10 inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Explore →
        </a>
      </div>
    </div>
  </div>

  <!-- Navigation Buttons outside overflow container -->
  <button
    @click="prevSlide"
    class="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 bg-indigo-500 text-white p-3 rounded-full shadow hover:bg-indigo-600 z-20 transition"
  >
    ◀
  </button>
  <button
    @click="nextSlide"
    class="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 bg-indigo-500 text-white p-3 rounded-full shadow hover:bg-indigo-600 z-20 transition"
  >
    ▶
  </button>

  <!-- Dots -->
  <div class="flex justify-center mt-6 space-x-3">
    <span
      v-for="(feature, index) in features"
      :key="'dot-' + index"
      @click="goToSlide(index)"
      :class="{
        'w-4 h-4 rounded-full cursor-pointer': true,
        'bg-indigo-600': currentIndex === index,
        'bg-gray-400': currentIndex !== index
      }"
    ></span>
  </div>
</section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

const features = [
  { icon: '📊', title: 'Expense Tracking', description: 'Monitor daily expenses with detailed charts and trends to stay on top of your spending.', link: '/expense' },
  { icon: '👥', title: 'Income Tracking', description: 'Keep track of all income sources, categorize earnings, and analyze cash flow over time.', link: '/income' },
  { icon: '⚙️', title: 'Budget Planning', description: 'Set up monthly or yearly budgets and get alerts when you approach your limits.', link: '/economic-event' },
  { icon: '💹', title: 'Investment Tracking', description: 'Monitor your investments, get signals, track returns, manage checklist, and get insights on portfolio performance.', link: '/global/report' },
  { icon: '📈', title: 'Reports', description: 'Generate customizable financial reports to understand trends and make informed decisions.', link: '/settings' },
  { icon: '✨', title: 'More Upcoming', description: 'Stay tuned for exciting new features to make your financial management even easier.', link: '/settings' },
]

const currentIndex = ref(0)
let intervalId = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % features.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + features.length) % features.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

// Auto slide every 3 seconds
onMounted(() => {
  intervalId = setInterval(nextSlide, 3000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.feature-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.5s ease-in-out, box-shadow 0.5s ease-in-out;
}

/* Spotlight overlay on hover */
.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255, 255, 220, 0.7), transparent 70%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease-in-out;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover {
  box-shadow: 0 35px 70px rgba(0,0,0,0.35);
}
</style>
