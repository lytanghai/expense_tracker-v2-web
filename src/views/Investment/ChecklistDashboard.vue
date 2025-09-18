<template>
    <div class="flex h-screen bg-gradient-to-b from-indigo-100 to-purple-100">
        <!-- Sidebar -->
        <Sidebar />

        <!-- Main Content -->
        <main class="flex-1 p-6 overflow-y-auto">
            <div class="max-w-7xl mx-auto space-y-8">
                <br><br>
                <!-- Header -->
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-extrabold text-indigo-900 drop-shadow-lg">📈 Profit Plan Dashboard</h1>
                    <p class="text-indigo-700 text-lg">Track & manage your profit plans dynamically</p>
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

                        <!-- Create Button with centered img -->
                        <button @click="showCreateModal = true"
                            class="flex items-center justify-center px-5 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition">
                            <img src="/img/icons/create.png" alt="Create Income" class="w-5 h-5" />
                        </button>

                        <!-- Apply Button -->
                        <button @click="fetchData"
                            class="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform">
                            <img src="/img/icons/save.png" alt="Create Plan" class="w-5 h-5 mr-2" />
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
                        <p class="text-sm text-indigo-700">Target: {{ formatPrice(plan.target, "$") }} | Result: {{ formatPrice(plan.result, "$") }}</p>
                        <p class="text-sm text-indigo-500 mt-1">{{ plan.created_at }}</p>

                        <div class="flex justify-end space-x-2 mt-4">
                            <button @click="viewPlan(plan.id)"
                                class="px-3 py-1 bg-blue-500 text-white text-xs rounded-xl hover:bg-blue-600 shadow">
                                <img src="/img/icons/view.png" alt="view" class="w-5 h-5" />
                            </button>

                            <button @click="openUpdateModal(plan)"
                                class="px-3 py-1 bg-yellow-500 text-white text-xs rounded-xl hover:bg-yellow-600 shadow">
                                <img src="/img/icons/edit.png" alt="edit" class="w-5 h-5" />
                            </button>

                            <button @click="deletePlan(plan.id)"
                                class="px-3 py-1 bg-red-500 text-white text-xs rounded-xl hover:bg-red-600 shadow">
                                <img src="/img/icons/bin.png" alt="delete" class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Modal for Plan Details Checklist -->
                <div v-if="selectedPlan" class="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4">
                    <!-- backdrop -->
                    <div class="fixed inset-0 bg-black/40" @click="selectedPlan = null"></div>
                    <!-- modal -->
                    <div
                        class="bg-white rounded-3xl shadow-2xl w-full max-w-lg sm:max-w-3xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
                        <button @click="selectedPlan = null"
                            class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">
                            <br>
                            <img src="/img/icons/close.png" alt="Close" class="w-10 h-10" />

                        </button>
                        <!-- header -->
                        <div class="mb-4 sm:mb-6">
                            <br>
                            <h2
                                class="text-xl sm:text-2xl font-extrabold uppercase tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center gap-2">
                                <span>📋</span> {{ selectedPlan.type }} Plan Checklist
                            </h2>
                            <div
                                class="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div class="flex items-center gap-2 relative">
                                    <button @click="showSendOptions = !showSendOptions"
                                        class="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 shadow text-sm sm:text-base">
                                        📤 Send
                                    </button>

                                    <div v-if="showSendOptions"
                                        class="absolute right-0 top-full mt-1 bg-white border shadow-lg rounded p-2 z-50 min-w-[120px]">
                                        <button @click="sendMsg('gmail')"
                                            class="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm">Gmail</button>
                                        <button @click="sendMsg('telegram')"
                                            class="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm">Telegram</button>
                                    </div>
                                </div>
                                <p class="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-0">
                                    Year: {{ selectedPlan.year }} | Month: {{ selectedPlan.month }} | Status:
                                    <span :class="{
                                        'px-2 py-1 rounded text-xs font-semibold': true,
                                        'bg-yellow-100 text-yellow-800': selectedPlan.status === 'Pending',
                                        'bg-green-100 text-green-800': selectedPlan.status === 'Success',
                                        'bg-red-100 text-red-800': selectedPlan.status === 'Failed'
                                    }">{{ selectedPlan.status }}</span>
                                </p>
                            </div>
                        </div>

                        <!-- table -->
                        <div class="overflow-x-auto border rounded-lg">
                            <table class="w-full border-collapse text-sm">
                                <thead class="bg-gray-100 text-gray-700 uppercase">
                                    <tr>
                                        <th class="px-2 py-1">Day</th>
                                        <th class="px-2 py-1">Target</th>
                                        <th class="px-2 py-1">Result</th>
                                        <th class="px-2 py-1">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(d, idx) in editableDetails" :key="d.id"
                                        :class="['hover:bg-indigo-50', d.day < todayDay ? 'bg-red-100' : d.day === todayDay ? 'bg-green-100' : 'bg-orange-100']">
                                        <td class="px-2 py-1 text-center">{{ d.day }}</td>
                                        <td class="px-2 py-1 text-center">{{ d.target.toFixed(2) }}</td>
                                        <td class="px-2 py-1 text-center">
                                            <input type="number" v-model.number="editableDetails[idx].result"
                                                :disabled="d.day > todayDay"
                                                class="w-full sm:w-24 p-1 border rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-center" />
                                            <div v-if="d.day < todayDay" class="mt-1 text-xs font-semibold">
                                                <span v-if="d.result < d.target" class="text-red-300">
                                                    Incomplete ({{ (d.target - d.result).toFixed(2) }} $ left)
                                                </span>
                                                <span v-else-if="d.result === d.target" class="text-green-600"></span>
                                                <span v-else class="text-orange-500">🔥</span>
                                            </div>
                                        </td>
                                        <td class="px-2 py-1 text-center">
                                            <button @click="updateDetail(d.id, editableDetails[idx].result)"
                                                :disabled="d.day > todayDay"
                                                class="px-2 py-1 bg-gray-200 text-white text-xs rounded hover:bg-orange-100 disabled:opacity-50">
                                                <img src="/img/icons/edit.png" alt="edi" class="w-5 h-5" />

                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- totals -->
                        <div
                            class="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-indigo-50 p-3 rounded-lg font-semibold text-indigo-700 text-sm sm:text-base gap-2">
                            <p>Grand Total: {{ grandTotal.toFixed(2) }}</p>
                            <p>Target Amount: {{ targetTotal.toFixed(2) }}</p>
                        </div>
                    </div>
                </div>


                <!-- Update Plan Modal -->
                <div v-if="showUpdateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div class="fixed inset-0 bg-black/40" @click="showUpdateModal = false"></div>
                    <div class="bg-white rounded-3xl shadow-2xl w-full md:w-3/4 lg:w-1/2 p-6 relative">
                        <button @click="showUpdateModal = false"
                            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">✖</button>

                        <h2 class="text-2xl font-bold text-indigo-700 mb-4">Update Profit Plan</h2>

                        <div class="grid gap-4 md:grid-cols-2">
                            <input v-model="updatePayload.month" type="number" placeholder="Month"
                                class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
                            <input v-model="updatePayload.year" type="number" placeholder="Year"
                                class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
                            <input v-model.number="updatePayload.target_amount" type="number"
                                placeholder="Target Amount"
                                class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
                            <select v-model="updatePayload.type"
                                class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400">
                                <option value="crypto">Crypto</option>
                                <option value="forex">Forex</option>
                            </select>
                        </div>

                        <div class="flex justify-end mt-6">
                            <button @click="submitUpdate"
                                class="px-5 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 shadow">
                                <img src="/img/icons/edit.png" alt="edit" class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Popup Message -->
                <div v-if="showPopup"
                    class="fixed top-20 right-10 bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow animate-slide-in z-50">
                    {{ popupMessage }}
                </div>

                <!-- Create Plan Modal -->
                <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <!-- Overlay -->
                    <div class="fixed inset-0 bg-black/40" @click="showCreateModal = false"></div>

                    <!-- Modal Card -->
                    <div class="bg-white rounded-3xl shadow-2xl w-full md:w-3/4 lg:w-1/2 p-6 relative">
                        <!-- Close Button -->
                        <button @click="showCreateModal = false"
                            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">✖</button>

                        <h2 class="text-2xl font-bold text-indigo-700 mb-4">Create Profit Plan</h2>

                        <div class="grid gap-4 md:grid-cols-2">
                            <!-- Month -->
                            <div class="flex flex-col">
                                <label class="text-gray-700 font-semibold mb-1">Month</label>
                                <input v-model.number="createPayload.month" type="number" placeholder="Month"
                                    class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
                            </div>

                            <!-- Year -->
                            <div class="flex flex-col">
                                <label class="text-gray-700 font-semibold mb-1">Year</label>
                                <input v-model.number="createPayload.year" type="number" placeholder="Year"
                                    class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
                            </div>

                            <!-- Target Amount -->
                            <div class="flex flex-col">
                                <label class="text-gray-700 font-semibold mb-1">Target Amount</label>
                                <input v-model.number="createPayload.target_amount" type="number"
                                    placeholder="Target Amount"
                                    class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
                            </div>

                            <!-- Type -->
                            <div class="flex flex-col">
                                <label class="text-gray-700 font-semibold mb-1">Type</label>
                                <select v-model="createPayload.type"
                                    class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400">
                                    <option value="crypto">Crypto</option>
                                    <option value="forex">Forex</option>
                                </select>
                            </div>
                        </div>

                        <div class="flex justify-end mt-6">
                            <button @click="submitCreatePlan"
                                class="px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow">
                                Create Plan
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Create Plan Modal -->
                <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <!-- Overlay -->
                    <div class="fixed inset-0 bg-black/40" @click="showCreateModal = false"></div>

                    <!-- Modal Card -->
                    <div class="bg-white rounded-3xl shadow-2xl w-full md:w-3/4 lg:w-1/2 p-6 relative">
                        <!-- Close Button -->
                        <button @click="showCreateModal = false"
                            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">✖</button>

                        <h2 class="text-2xl font-bold text-indigo-700 mb-4">Create Profit Plan</h2>

                        <div class="grid gap-4 md:grid-cols-2">
                            <!-- Month -->
                            <div class="flex flex-col">
                                <label class="text-gray-700 font-semibold mb-1">Month</label>
                                <input v-model.number="createPayload.month" type="number" placeholder="Month"
                                    class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
                            </div>

                            <!-- Year -->
                            <div class="flex flex-col">
                                <label class="text-gray-700 font-semibold mb-1">Year</label>
                                <input v-model.number="createPayload.year" type="number" placeholder="Year"
                                    class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
                            </div>

                            <!-- Target Amount -->
                            <div class="flex flex-col">
                                <label class="text-gray-700 font-semibold mb-1">Target Amount</label>
                                <input v-model.number="createPayload.target_amount" type="number"
                                    placeholder="Target Amount"
                                    class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400" />
                            </div>

                            <!-- Type -->
                            <div class="flex flex-col">
                                <label class="text-gray-700 font-semibold mb-1">Type</label>
                                <select v-model="createPayload.type"
                                    class="w-full p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400">
                                    <option value="crypto">Crypto</option>
                                    <option value="forex">Forex</option>
                                </select>
                            </div>
                        </div>

                        <div class="flex justify-end mt-6">
                            <button @click="submitCreatePlan"
                                class="px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import { createProfitPlan, sendProfitPlanMessage, getProfitPlans, getProfitPlanById, filloutPnl, updateProfitPlan, deleteProfitPlan } from "@/services/api";
import {formatPrice} from "@/services/numeric"
import { useConfirmStore } from "@/stores/confirm";

const confirmStore = useConfirmStore();


const popupMessage = ref("");
const showPopup = ref(false);
const todayDay = new Date().getDate();

const filters = reactive({ id: null, year: null, month: null, type: "", status: "", page: 0, size: 10 });
const profitPlans = reactive({ content: [], number: 0, total_pages: 0, first: true, last: true });

const selectedPlan = ref(null);
const editableDetails = ref([]);

// Add in <script setup>
const showSendOptions = ref(false);

const sendMsg = async (type) => {
    if (!selectedPlan.value) return;
    try {
        showSendOptions.value = false;

        // Call API
        await sendProfitPlanMessage(selectedPlan.value.id, type);

        popupMessage.value = `Sent via ${type.toUpperCase()} successfully!`;
        showPopup.value = true;
        setTimeout(() => showPopup.value = false, 3000);
    } catch (err) {
        popupMessage.value = err.message || "Failed to send!";
        showPopup.value = true;
        setTimeout(() => showPopup.value = false, 3000);
    }
};

const showCreateModal = ref(false);
const createPayload = reactive({
    month: 12,
    year: new Date().getFullYear(),
    target_amount: 0,
    type: "crypto"
});

const submitCreatePlan = async () => {
    try {
        const data = await createProfitPlan(createPayload);

        showCreateModal.value = false;

        popupMessage.value = data.message || "Profit plan created successfully!";
        showPopup.value = true;
        setTimeout(() => showPopup.value = false, 3000);

        // Refresh dashboard
        fetchData();

        // Reset modal fields (optional)
        createPayload.month = 12;
        createPayload.year = new Date().getFullYear();
        createPayload.target_amount = 0;
        createPayload.type = "crypto";

    } catch (err) {
        console.error(err);
        popupMessage.value = err.message || "Failed to create plan!";
        showPopup.value = true;
        setTimeout(() => showPopup.value = false, 3000);
    }
};

// View checklist
const viewPlan = async (id) => {
    try {
        const plan = await getProfitPlanById(id);
        selectedPlan.value = plan;

        editableDetails.value = plan.details
            .map(d => ({ ...d }))
            .sort((a, b) => a.day - b.day);
    } catch (err) {
        console.error(err);
    }
};

// Update modal
const showUpdateModal = ref(false);
const updatePayload = reactive({ id: null, month: null, year: null, target_amount: null, type: "" });

const openUpdateModal = (plan) => {
    updatePayload.id = plan.id;
    updatePayload.month = plan.month;
    updatePayload.year = plan.year;
    updatePayload.target_amount = plan.target;
    updatePayload.type = plan.type;
    showUpdateModal.value = true;
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

// Delete plan
const deletePlan = (id) => {
  confirmStore.open("Are you sure you want to delete this plan?", async () => {
    try {
      const res = await deleteProfitPlan(id);

      // Remove the deleted plan from local state
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

// Update plan detail
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
        console.error(err);
        popupMessage.value = err.message || "Update failed!";
        showPopup.value = true;
        setTimeout(() => showPopup.value = false, 3000);
    }
};

// Computed totals
const grandTotal = computed(() => editableDetails.value.reduce((sum, d) => sum + d.result, 0));
const targetTotal = computed(() => editableDetails.value.reduce((sum, d) => sum + d.target, 0));

// Fetch profit plans
const fetchData = async () => {
    try {
        Object.assign(profitPlans, await getProfitPlans(filters));
    } catch (err) { console.error(err); }
};

// Pagination
const nextPage = () => { if (!profitPlans.last) { filters.page++; fetchData(); } };
const prevPage = () => { if (!profitPlans.first && filters.page > 0) { filters.page--; fetchData(); } };

onMounted(fetchData);
</script>

<style scoped>
/* Optional slide-in animation */
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
