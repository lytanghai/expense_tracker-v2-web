<template>
  <div class="flex h-screen bg-gradient-to-b from-indigo-100 to-purple-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-extrabold text-indigo-900 drop-shadow-lg">
            📈 Profit Plan Dashboard
          </h1>
          <p class="text-indigo-700 text-lg">
            Track & manage your profit plans dynamically
          </p>
        </div>

        <!-- Filters Card -->
        <div
          class="bg-white shadow-2xl rounded-3xl border border-indigo-300 p-6 hover:shadow-indigo-400 transition-all">
          <h2 class="text-2xl font-bold text-indigo-800 mb-4">🔎 Filters</h2>
          <div class="grid gap-4 md:grid-cols-6">
            <input v-model="filters.id" type="number" placeholder="ID"
              class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
            <input v-model="filters.year" type="number" placeholder="Year"
              class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
            <input v-model="filters.month" type="number" placeholder="Month"
              class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
            <select v-model="filters.type"
              class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400">
              <option value="">All Types</option>
              <option value="crypto">Crypto</option>
              <option value="forex">Forex</option>
            </select>
            <select v-model="filters.status"
              class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>

            <!-- Create Button -->
            <button @click="showCreateModal = true"
              class="flex items-center justify-center px-5 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition">
              <img src="/img/icons/create.png" alt="Create Income" class="w-5 h-5" />
            </button>

            <!-- Apply Button -->
            <button @click="fetchData"
              class="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform">
              <img src="/img/icons/save.png" alt="Save" class="w-5 h-5 mr-2" />
            </button>
          </div>
        </div>

        <!-- Profit Plan Cards -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="plan in profitPlans.content" :key="plan.id"
            class="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-3xl shadow-xl border-l-4 border-indigo-500 hover:scale-105 transition-transform">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-bold text-lg text-indigo-800">Plan #{{ plan.id }}</h3>
              <span :class="{
                'px-2 py-1 rounded-full text-xs font-semibold': true,
                'bg-yellow-100 text-yellow-800': plan.status === 'Pending',
                'bg-green-100 text-green-800': plan.status === 'Success',
                'bg-red-100 text-red-800': plan.status === 'Failed'
              }">{{ plan.status }}</span>
            </div>
            <p class="text-sm text-indigo-700">Type: <span class="capitalize">{{ plan.type }}</span></p>
            <p class="text-sm text-indigo-700">Year: {{ plan.year }}, Month: {{ plan.month }}</p>
            <p class="text-sm text-indigo-700">Target: {{ formatPrice(plan.target, plan.currency) }}</p>
            <p class="text-sm text-indigo-500 mt-1">{{ plan.created_at }}</p>

            <div class="flex justify-end space-x-2 mt-4">
              <button @click="viewPlan(plan.id)"
                class="px-3 py-1 bg-blue-500 text-white text-xs rounded-xl hover:bg-blue-600 shadow">
                <img src="/img/icons/view.png" alt="view" class="w-5 h-5" />
              </button>

              <button @click="deletePlan(plan.id)"
                class="px-3 py-1 bg-red-500 text-white text-xs rounded-xl hover:bg-red-600 shadow">
                <img src="/img/icons/bin.png" alt="delete" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Create Plan Modal -->
        <CreatePlanModal v-if="showCreateModal" v-model:payload="createPayload" @close="showCreateModal = false"
          @submit="submitCreatePlan" />

        <!-- Update Plan Modal -->
        <UpdatePlanModal v-if="showUpdateModal" v-model:payload="updatePayload" @close="showUpdateModal = false"
          @submit="submitUpdate" />

        <!-- Plan Detail Modal -->
        <div v-if="selectedPlan" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <!-- Overlay -->
          <div class="fixed inset-0 bg-black/40" @click="selectedPlan = null"></div>

          <div
            class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative z-50">
            <button @click="selectedPlan = null"
              class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">✖</button>

            <h2 class="text-xl font-bold text-indigo-700 mb-4">Plan #{{ selectedPlan.id }} Details</h2>

            <!-- Send Dropdown -->
            <div class="relative inline-block text-left mb-4">
              <button @click="showSendOptions = !showSendOptions"
                class="inline-flex justify-center w-full px-4 py-2 bg-indigo-500 text-white font-medium rounded hover:bg-indigo-600 focus:outline-none">
                Send Message
                <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div v-if="showSendOptions"
                class="absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                  <button @click="sendMsg('telegram')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Telegram 💬
                  </button>
                  <button @click="sendMsg('gmail')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Gmail 📨
                  </button>
                </div>
              </div>
            </div>

            <!-- Editable Table -->
            <table class="w-full table-auto text-left text-sm text-indigo-700 border border-gray-200">
              <thead class="bg-indigo-50">
                <tr>
                  <th class="px-3 py-2 border">Day</th>
                  <th class="px-3 py-2 border">Target</th>
                  <th class="px-3 py-2 border">Result</th>
                  <th class="px-3 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="detail in editableDetails" :key="detail.id">
                  <td class="px-3 py-2 border">{{ detail.day }}</td>
                  <td class="px-3 py-2 border">{{ formatPrice(detail.target, selectedPlan.currency) }}</td>
                  <td class="px-3 py-2 border">
                    <input v-model.number="detail.result" type="number"
                      class="w-20 text-center p-1 border border-gray-300 rounded disabled:bg-gray-100 disabled:text-gray-400"
                      :disabled="detail.day > today" />
                  </td>
                  <td class="px-3 py-2 border">
                    <button v-if="detail.day <= today" @click="updateDetail(detail.id, detail.result)"
                      class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                      <img src="/img/icons/edit.png" alt="edit" class="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <p class="mt-4 font-semibold">💸 Grand Total: {{ grandTotal }} {{ selectedPlan.currency }}</p>
            <p class="font-semibold">💸 Target Total: {{ targetTotal }} {{ selectedPlan.currency }}</p>
          </div>
        </div>

        <!-- Popup Message -->
        <div v-if="showPopup"
          class="fixed top-20 right-10 bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow animate-slide-in z-50">
          {{ popupMessage }}
        </div>
        <!-- Create Plan Modal -->
        <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative">
            <button @click="showCreateModal = false"
              class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">
              ✖
            </button>
            <h2 class="text-xl font-bold text-indigo-700 mb-4">
              ➕ Create Profit Plan
            </h2>

            <form @submit.prevent="submitCreatePlan" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Month:</label>
                <input v-model="createPayload.month" type="number" placeholder="Month"
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Year:</label>
                <input v-model="createPayload.year" type="number" placeholder="Year"
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Target Amount:</label>
                <input v-model="createPayload.target_amount" type="number" placeholder="Target Amount"
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type:</label>
                <select v-model="createPayload.type"
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="crypto">Crypto</option>
                  <option value="forex">Forex</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Currency:</label>
                <select v-model="createPayload.currency"
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="USD">USD</option>
                  <option value="USC">USC</option>
                </select>
              </div>

              <button type="submit"
                class="w-full flex items-center justify-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                <img src="/img/icons/save.png" alt="Save" class="w-5 h-5" />
              </button>

            </form>
          </div>
        </div>


      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import { createProfitPlan, sendProfitPlanMessage, getProfitPlans, getProfitPlanById, filloutPnl, updateProfitPlan, deleteProfitPlan } from "@/services/api";
import { formatPrice } from "@/services/numeric";
import { useConfirmStore } from "@/stores/confirm";

const today = new Date().getDate();
const confirmStore = useConfirmStore();
const popupMessage = ref("");
const showPopup = ref(false);
const showSendOptions = ref(false);

const filters = reactive({ id: null, year: null, month: null, type: "", status: "", page: 0, size: 10 });
const profitPlans = reactive({ content: [], number: 0, total_pages: 0, first: true, last: true });

const selectedPlan = ref(null);
const editableDetails = ref([]);

const showCreateModal = ref(false);
const createPayload = reactive({ month: 12, year: new Date().getFullYear(), target_amount: 0, type: "crypto", currency: "USD" });

const showUpdateModal = ref(false);
const updatePayload = reactive({ id: null, month: null, year: null, target_amount: null, type: "", currency: "USD" });

const targetTotal = computed(() => Math.round(editableDetails.value.reduce((sum, d) => sum + d.target, 0) * 100) / 100);
const grandTotal = computed(() => Math.round(editableDetails.value.reduce((sum, d) => sum + d.result, 0) * 100) / 100);

const fetchData = async () => Object.assign(profitPlans, await getProfitPlans(filters));

const submitCreatePlan = async () => {
  try {
    const data = await createProfitPlan(createPayload);
    showCreateModal.value = false;
    popupMessage.value = data.message || "Profit plan created successfully!";
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 3000);
    fetchData();
  } catch (err) {
    popupMessage.value = err.message || "Failed to create plan!";
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 3000);
  }
};

const viewPlan = async (id) => {
  const plan = await getProfitPlanById(id);
  selectedPlan.value = plan;
  editableDetails.value = plan.details.map(d => ({ ...d })).sort((a, b) => a.day - b.day);
};

const submitUpdate = async () => {
  try {
    const res = await updateProfitPlan(updatePayload);
    showUpdateModal.value = false;
    popupMessage.value = res?.message || "Plan updated successfully!";
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 3000);
    fetchData();
  } catch (err) {
    popupMessage.value = err.message || "Update failed!";
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 3000);
  }
};

const deletePlan = (id) => {
  confirmStore.open("Are you sure you want to delete this plan?", async () => {
    try {
      const res = await deleteProfitPlan(id);
      const idx = profitPlans.content.findIndex(p => p.id === id);
      if (idx !== -1) profitPlans.content.splice(idx, 1);
      popupMessage.value = res?.message || "Plan deleted successfully!";
      showPopup.value = true;
      setTimeout(() => showPopup.value = false, 3000);
    } catch (err) {
      popupMessage.value = err.message || "Delete failed!";
      showPopup.value = true;
      setTimeout(() => showPopup.value = false, 3000);
    }
  });
};

const updateDetail = async (plan_detail_id, result) => {
  try {
    const token = localStorage.getItem("token");
    const payload = { plan_detail_id, result };
    const res = await filloutPnl(payload, token);

    const idx = editableDetails.value.findIndex(d => d.id === plan_detail_id);
    if (idx !== -1) editableDetails.value[idx].result = result;

    const idxPlan = selectedPlan.value.details.findIndex(d => d.id === plan_detail_id);
    if (idxPlan !== -1) selectedPlan.value.details[idxPlan].result = result;

    popupMessage.value = res.detail || "Updated successfully!";
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 3000);
  } catch (err) {
    popupMessage.value = err.message || "Update failed!";
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 3000);
  }
};

const sendMsg = async (type) => {
  if (!selectedPlan.value) return;

  try {
    await sendProfitPlanMessage(selectedPlan.value.id, type); // Pass arguments separately

    popupMessage.value = `Message sent via ${type}!`;
    showPopup.value = true;
    showSendOptions.value = false;
    setTimeout(() => (showPopup.value = false), 3000);

  } catch (err) {
    popupMessage.value = err.message || "Message failed!";
    showPopup.value = true;
    setTimeout(() => (showPopup.value = false), 3000);
  }
};

onMounted(fetchData);
</script>

<style scoped>
@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
