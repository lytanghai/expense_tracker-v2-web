<template>
  <!-- Main Content -->
  <main class="flex-1 p-6 bg-gray-100 overflow-y-auto">
    <!-- Forex Session Card -->
    <div class="bg-white rounded-2xl shadow-lg p-6 max-w-md space-y-6">
      
      <!-- Current Session -->
      <div class="bg-gray-50 rounded-lg p-4 shadow-sm">
        <h3 class="text-lg font-semibold mb-1 font-bold">
          Session:
          <span class="text-gray-700 text-xl font-bold">{{ currentSession?.name || "Closed" }}</span>
        </h3>
        <p class="text-sm text-gray-500">
          {{ currentSession ? currentSession.range : "N/A" }}
        </p>
        <p v-if="currentSession" class="text-sm text-gray-600 mt-1">
          Ends in: 
          <span :class="{ 'text-red-600 font-bold': countdownSeconds <= 300, 'text-gray-600 font-bold': countdownSeconds > 300 }" class="font-mono">
            {{ countdown }}
          </span>
        </p>
      </div>

      <!-- Market Status -->
      <div class="bg-gray-50 rounded-lg p-4 shadow-sm flex justify-between items-center">
        <h3 class="text-lg font-semibold">Market Status</h3>
        <p
          class="text-xl font-bold"
          :class="{ 'text-green-600': isMarketOpen, 'text-red-600': !isMarketOpen }"
        >
          {{ isMarketOpen ? "🟢 Open" : "🔴 Closed" }}
        </p>
      </div>

      <!-- Traffic -->
      <div class="bg-gray-50 rounded-lg p-4 shadow-sm flex justify-between items-center">
        <h3 class="text-lg font-semibold">Traffic</h3>
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium"
          :class="{
            'bg-green-500': traffic === 'Low',
            'bg-yellow-500': traffic === 'Medium',
            'bg-red-500': traffic === 'High'
          }"
        >
          {{ traffic }}
        </span>
      </div>

      <!-- Times -->
      <div class="bg-gray-50 rounded-lg p-4 shadow-sm space-y-2">
        <h3 class="text-lg font-semibold mb-2">Current Time</h3>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-white rounded p-2 shadow-sm text-center">
            <p class="text-sm font-medium text-gray-500">Phnom Penh</p>
            <p class="font-mono text-lg font-bold">{{ phnomPenhTime }}</p>
          </div>
          <div class="bg-white rounded p-2 shadow-sm text-center">
            <p class="text-sm font-medium text-gray-500">New York</p>
            <p class="font-mono text-lg font-bold">{{ newYorkTime }}</p>
          </div>
          <div class="bg-white rounded p-2 shadow-sm text-center">
            <p class="text-sm font-medium text-gray-500">London</p>
            <p class="font-mono text-lg font-bold">{{ londonTime }}</p>
          </div>
          <div class="bg-white rounded p-2 shadow-sm text-center">
            <p class="text-sm font-medium text-gray-500">Tokyo</p>
            <p class="font-mono text-lg font-bold">{{ tokyoTime }}</p>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Forex sessions (Phnom Penh Time)
const sessions = [
  { name: "Tokyo", start: 5, end: 14, range: "05:00 – 14:00" },
  { name: "London", start: 14, end: 23, range: "14:00 – 23:00" },
  { name: "New York", start: 20.5, end: 29, range: "20:30 – 05:00" }, // next day 05:00
];

const phnomPenhTime = ref("");
const newYorkTime = ref("");
const londonTime = ref("");
const tokyoTime = ref("");
const currentSession = ref(null);
const traffic = ref("Low");
const isMarketOpen = ref(false);
const countdown = ref("--:--:--");
const countdownSeconds = ref(0);

function updateTime() {
  const now = new Date();

  // Format times for each city
  const formatTime = (tz) =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(now);

  phnomPenhTime.value = formatTime("Asia/Phnom_Penh");
  newYorkTime.value = formatTime("America/New_York");
  londonTime.value = formatTime("Europe/London");
  tokyoTime.value = formatTime("Asia/Tokyo");

  // Decimal hour Phnom Penh
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Phnom_Penh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(now);
  const d = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const hh = parseInt(d.hour, 10);
  const mm = parseInt(d.minute, 10);
  const ss = parseInt(d.second, 10);
  const localHourDecimal = hh + mm / 60 + ss / 3600;

  // Market open/close: Mon 05:00 → Sat 04:00
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Phnom_Penh",
    weekday: "short",
  }).format(now);

  isMarketOpen.value =
    (day === "Mon" && localHourDecimal >= 5) ||
    ["Tue", "Wed", "Thu", "Fri"].includes(day) ||
    (day === "Sat" && localHourDecimal < 4);

  // Determine current session
  currentSession.value = null;
  for (const s of sessions) {
    if (s.end <= 24) {
      if (localHourDecimal >= s.start && localHourDecimal < s.end) currentSession.value = s;
    } else {
      if (localHourDecimal >= s.start || localHourDecimal < s.end - 24) currentSession.value = s;
    }
  }

  // Traffic rules
  if (currentSession.value?.name === "Tokyo") traffic.value = "Low";
  else if (currentSession.value?.name === "London") traffic.value = "Medium";
  else if (currentSession.value?.name === "New York") traffic.value = "High";
  else traffic.value = "Low";

  // Overlaps → High
  if ((localHourDecimal >= 14 && localHourDecimal < 15.5) || (localHourDecimal >= 20.5 && localHourDecimal < 23))
    traffic.value = "High";

  // Countdown to session end
  if (currentSession.value) {
    let endHour = currentSession.value.end;
    if (endHour > 24) endHour -= 24;

    let endDate = new Date(now);
    endDate.setHours(Math.floor(endHour));
    endDate.setMinutes(Math.floor((endHour % 1) * 60));
    endDate.setSeconds(0);

    if (currentSession.value.end > 24 && localHourDecimal < currentSession.value.start) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const diff = Math.max(0, endDate - now);
    countdownSeconds.value = Math.floor(diff / 1000);

    const hours = String(Math.floor(diff / 1000 / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
    countdown.value = `${hours}:${minutes}:${seconds}`;
  } else {
    countdown.value = "--:--:--";
    countdownSeconds.value = 0;
  }
}

onMounted(() => {
  updateTime();
  const timer = setInterval(updateTime, 1000);
  onUnmounted(() => clearInterval(timer));
});
</script>
