<template>
  <div class="space-y-6 w-full">
    <!-- Upcoming Event -->
    <div v-if="upcomingEvent" class="bg-blue-50 rounded-2xl shadow-lg p-6 w-full">
      <h2 class="text-xl font-bold mb-2 text-blue-800">Upcoming Event</h2>
      <p class="text-gray-700 mb-1"><strong>Title:</strong> {{ upcomingEvent.title }}</p>
      <p class="text-gray-700 mb-1"><strong>Date:</strong> {{ formatDate(upcomingEvent.date) }}</p>
      <p class="text-gray-700 mb-1">
        <strong>Impact:</strong>
        <span
          class="px-2 py-1 rounded-full text-sm font-medium"
          :class="{
            'bg-green-500 text-white': upcomingEvent.impact === 'Low',
            'bg-yellow-500 text-white': upcomingEvent.impact === 'Medium',
            'bg-red-500 text-white': upcomingEvent.impact === 'High'
          }"
        >
          {{ upcomingEvent.impact }}
        </span>
      </p>
    </div>

    <!-- Calendar with Filters -->
    <div class="bg-white rounded-2xl shadow-lg p-6 w-full">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Forex Calendar Events</h2>

      <!-- Filter Form -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
        <input v-model="filters.date" type="date" placeholder="Date" class="border rounded p-2" />
        <input v-model="filters.country" type="text" placeholder="Country" class="border rounded p-2" />
        <input v-model="filters.impact" type="text" placeholder="Impact" class="border rounded p-2" />
        <input v-model="filters.size" type="text" placeholder="Size" class="border rounded p-2" />
        <input v-model="filters.title" type="text" placeholder="Title" class="border rounded p-2" />
        <button
          @click="loadEvents"
          class="col-span-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Filter
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-gray-500">Loading events...</div>

      <!-- Event List -->
      <div v-else>
        <div v-if="sortedEvents.length === 0" class="text-gray-500">No events found.</div>

        <ul class="divide-y divide-gray-200">
          <li
            v-for="(event, index) in sortedEvents"
            :key="index"
            class="py-3 flex flex-col md:flex-row justify-between items-start md:items-center"
            :class="{
              'line-through': new Date(event.date.replace(' ICT', '')) < new Date() // expired highlight
            }"
          >
            <div class="mb-2 md:mb-0">
              <p
                class="font-semibold"
                :class="{
                  'text-gray-800': new Date(event.date.replace(' ICT', '')) >= new Date(),
                  'text-red-600': new Date(event.date.replace(' ICT', '')) < new Date()
                }"
              >
                {{ event.title }}
              </p>
              <p class="text-sm text-gray-500">
                {{ event.country }} | {{ formatDate(event.date) }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2 items-center">
              <span
                class="px-2 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-green-500 text-white': event.impact === 'Low',
                  'bg-yellow-500 text-white': event.impact === 'Medium',
                  'bg-orange-500 text-white': event.impact === 'High'
                }"
              >
                {{ event.impact === 'High' ? " 🔥 High 🔥 ": event.impact }}
              </span>
              <span class="text-sm text-gray-600">Forecast: {{ event.forecast || "-" }}</span>
              <span class="text-sm text-gray-600">Previous: {{ event.previous || "-" }}</span>
              <span class="text-sm text-gray-600">Actual: {{ event.actual || "-" }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { fetchCalendarEvents } from "@/services/investmentApi.js";

// Current date in YYYY-MM-DD
const today = new Date();
const formattedToday = today.toISOString().split("T")[0];

const events = ref([]);
const loading = ref(false);

const filters = ref({
  date: formattedToday,
  country: "",
  impact: "",
  size: "",
  title: "",
});

// Format date
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr.replace(" ICT", ""));
  return d.toLocaleString("en-GB", { timeZone: "Asia/Phnom_Penh", hour12: false });
}

// Load events
async function loadEvents() {
  try {
    loading.value = true;
    events.value = await fetchCalendarEvents(filters.value);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Compute upcoming event
const upcomingEvent = computed(() => {
  const now = new Date();
  return events.value
    .filter((e) => new Date(e.date.replace(" ICT", "")) >= now)
    .sort((a, b) => new Date(a.date.replace(" ICT", "")) - new Date(b.date.replace(" ICT", "")))[0];
});

// Sort events: upcoming first, expired later
const sortedEvents = computed(() => {
  const now = new Date();
  return [...events.value].sort((a, b) => {
    const dateA = new Date(a.date.replace(" ICT", ""));
    const dateB = new Date(b.date.replace(" ICT", ""));
    if (dateA < now && dateB >= now) return 1; // expired goes down
    if (dateA >= now && dateB < now) return -1;
    return dateA - dateB; // normal chronological
  });
});

// Initial load
loadEvents();
</script>
