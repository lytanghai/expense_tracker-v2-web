<template>
  <div class="flex h-screen">
    <Sidebar />

    <main class="flex-1 p-6 bg-gray-100">
      <div class="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto">
        <br><br>
        <h1 class="text-2xl font-bold mb-4">Expense Balance Setting</h1>

        <div v-if="loading" class="text-center py-6 text-gray-500">Loading...</div>

        <table v-else class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-200 text-gray-700">
              <th class="px-4 py-2 text-left">Key</th>
              <th class="px-4 py-2 text-left">Value</th>
              <th class="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in filteredObjectMap" :key="key" class="border-t hover:bg-gray-50 transition">
              <td class="px-4 py-2 font-medium">
                {{ key.toLowerCase().endsWith('_upt')
                  ? key.replace(/_upt$/i, 'Upt')
                  : key }}
              </td>

              <td class="px-4 py-2 break-words flex items-center space-x-2">
                <input v-if="editKey === key" v-model="editValue" type="number" class="border p-1 rounded w-32" />

                <span v-else>
                  <span v-if="typeof value === 'object'">{{ JSON.stringify(value) }}</span>
                  <span v-else>{{ value }}</span>
                </span>

                <button v-if="/Upt$/i.test(key)" @click="editKey === key ? saveUpdate(key) : startEdit(key, value)"
                  class="text-blue-500 hover:text-blue-700" title="Edit">
                  ✏️
                </button>

                <button v-if="editKey === key" @click="cancelEdit" class="text-gray-400 hover:text-gray-600"
                  title="Cancel">
                  ❌
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import api from "@/services/api";
import { fetchSettings } from "@/services/api.js";

const loading = ref(true);
const apiData = ref({ object_map: {} });
const editKey = ref(null);
const editValue = ref("");

// Filter object_map but keep internal keys intact
const filteredObjectMap = computed(() => apiData.value.object_map || {});

// Start editing
const startEdit = (key, value) => {
  editKey.value = key;
  editValue.value = value;
};

// Cancel editing
const cancelEdit = () => {
  editKey.value = null;
  editValue.value = "";
};

const toSnakeCase = (str) => {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
};

const saveUpdate = async (key) => {
  try {
    const payloadKey = toSnakeCase(key); 
    const payload = { [payloadKey]: editValue.value };

    console.log("Payload to send:", payload);

    const token = localStorage.getItem("token");
    const res = await api.post("/expense_tracking/setting/update", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    apiData.value.object_map[key] = editValue.value;
    editKey.value = null;
    editValue.value = "";
  } catch (err) {
    console.error("Failed to update:", err);
  }
};

// Fetch settings safely inside onMounted
onMounted(async () => {
  try {
    loading.value = true;
    const settings = await fetchSettings();
    apiData.value.object_map = settings;
  } catch (err) {
    console.error("Failed to fetch settings:", err);
  } finally {
    loading.value = false;
  }
});
</script>



<style scoped>
table td {
  word-break: break-word;
}
</style>
