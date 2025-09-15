<template>
  <div class="bg-white shadow-lg rounded-lg p-4">
    <h4 class="text-lg font-semibold mb-2">Price History (Gold)</h4>
    <div v-if="history.length === 0" class="text-gray-500 text-sm">No history available.</div>

    <div
      v-else
      class="overflow-y-auto"
      :style="{ maxHeight: history.length > 14 ? '400px' : 'auto' }"
    >
      <table class="w-full text-sm text-left text-gray-700">
        <thead>
          <tr class="border-b">
            <th class="py-1 px-2">Date</th>
            <th class="py-1 px-2">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in sortedHistory"
            :key="item.date"
            class="border-b hover:bg-gray-50"
          >
            <td class="py-1 px-2">{{ item.date }}</td>
            <td
              class="py-1 px-2 font-semibold"
              :class="{
                'text-green-600': isPriceUp(index),
                'text-red-600': !isPriceUp(index)
              }"
            >
              ${{ item.price.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  history: {
    type: Array,
    default: () => [],
  },
});


// Sort history descending by date
const sortedHistory = computed(() =>
  [...props.history].sort((a, b) => new Date(b.date) - new Date(a.date))
);

// Determine if the price increased compared to previous entry
function isPriceUp(index) {
  if (index >= sortedHistory.value.length - 1) return true; // first row, assume up
  const current = sortedHistory.value[index].price;
  const previous = sortedHistory.value[index + 1].price;
  return current >= previous;
}
</script>
