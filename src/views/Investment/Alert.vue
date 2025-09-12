<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-auto">
      <div class="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h2 class="text-2xl font-bold mb-6">Price Alerts (Batch Create)</h2>

        <!-- Table of alerts -->
        <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">Type</th>
              <th class="px-4 py-2 text-left">Price</th>
              <th class="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(alert, index) in alerts" :key="index" class="border-t hover:bg-gray-50">
              <td class="px-4 py-2">
                <select v-model="alert.type" class="w-full border rounded px-2 py-1">
                  <option value="">Select Type</option>
                  <option value="Below">Below</option>
                  <option value="Above">Above</option>
                  <option value="Reach">Reach</option>
                </select>
              </td>
              <td class="px-4 py-2">
                <input type="number" v-model.number="alert.price" placeholder="Price" class="w-full border rounded px-2 py-1" />
              </td>
              <td class="px-4 py-2 text-center">
                <button
                  class="text-red-500 hover:text-red-700"
                  @click="removeAlert(index)"
                  v-if="alerts.length > 1"
                >
                  ❌
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Controls -->
        <div class="mt-4 flex justify-end space-x-2">
          <button
            class="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
            @click="addAlert"
          >
            ➕ Add Row
          </button>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            @click="submitBatch"
          >
            🚀 Submit Batch
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from "@/components/Sidebar.vue";
import api from '@/services/api' // Make sure your batch API is here

import { useNotification } from '@/stores/notification'
const { notify } = useNotification()

const alerts = ref([
  { type: '', price: null }
])

// Add a new row
const addAlert = () => {
  alerts.value.push({ type: '', price: null })
}

// Remove a row
const removeAlert = (index) => {
  alerts.value.splice(index, 1)
}

// Submit batch
const submitBatch = async () => {
  try {
    // Validate
    const invalid = alerts.value.some(a => !a.type || a.price == null)
    if (invalid) {
      notify('error', 'Validation Error', 'Please fill all alert rows before submitting.')
      return
    }

    // Call API
    const payload = {
      alerts: alerts.value.map(a => ({
        type: a.type,
        price: a.price
      }))
    }

    const res = await api.post('/price_alert/batch/create', payload) // Replace with your endpoint

    notify('success', 'Batch Created', 'All alerts have been successfully created.')
    alerts.value = [{ type: '', price: null }] // reset table
  } catch (err) {
    console.error(err)
    notify('error', 'Error', 'Could not create alerts.')
  }
}
</script>

<style scoped>
/* Optional styling */
</style>
