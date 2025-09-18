<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />

    <main class="flex-1 p-4 md:p-6 relative">
      <!-- Header -->
      <div
        class="sticky top-0 bg-gray-100 z-30 flex flex-col md:flex-row md:items-center md:justify-between px-4 pt-16 sm:pt-4 pb-4 shadow-md">
        <h1 class="text-3xl font-bold mb-2 md:mb-0 text-gray-800 rounded">Budget Planner</h1>
        <button @click="openCreateModal"
          class="w-10 h-10 bg-green-500 hover:bg-green-600 flex items-center justify-center p-1">
          <img :src="`/img/icons/create.png`" alt="Create" class="w-5 h-5" />
        </button>
      </div>

      <!-- Desktop Cards -->
      <div class="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div v-for="plan in plans" :key="plan.id" class="bg-white rounded-xl shadow-lg p-5 transition hover:shadow-xl">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold text-lg text-gray-800">{{ plan.plan_name }}</h3>
            <div class="flex flex-col items-end">
              <span class="text-sm text-gray-500">{{ formatDate(plan.deadline) }}</span>
              <div class="flex items-center space-x-2">
                <span class="mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  :class="getDaysLeftClass(plan.deadline)">
                  {{ daysLeft(plan.deadline) }} days left
                </span>

                <div
                  v-if="daysLeft(plan.deadline) === 0 && (plan.progress ?? (plan.current_amount / plan.target_amount * 100)) < 100"
                  class="relative group">
                  <button
                    class="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                    !
                  </button>
                  <div class="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block 
                    bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg z-50 whitespace-nowrap">
                    Deadline reached — please review your plan
                  </div>
                </div>

                <div v-else-if="(plan.progress ?? (plan.current_amount / plan.target_amount * 100)) >= 100"
                  class="relative group">
                  <button
                    class="w-5 h-5 flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
                    !
                  </button>
                  <div class="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block 
                    bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg z-50 whitespace-nowrap">
                    🎉 Congratulations! You’ve completed this plan!
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-3 space-y-1">
            <div class="flex justify-between text-gray-600 text-sm">
              <span>Target:</span>
              <span>{{ formatPrice(plan.target_amount, plan.target_currency) }}</span>
            </div>
            <div class="flex justify-between text-gray-600 text-sm">
              <span>Current:</span>
              <span>{{ formatPrice(plan.current_amount, plan.current_amount_currency) }}</span>
            </div>
          </div>

          <div class="mb-3">
            <div class="w-full bg-gray-200 h-3 rounded-full">
              <div class="h-3 rounded-full transition-all"
                :style="{ width: ((plan.progress ?? (plan.current_amount / plan.target_amount * 100)) + '%'), background: 'linear-gradient(to right, #4ade80, #16a34a)' }">
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-1 text-right">
              {{ plan.progress ?? ((plan.current_amount / plan.target_amount * 100).toFixed(2)) }}%
            </div>
          </div>

          <div class="flex justify-between mt-4 space-x-2">
            <button @click="openDepositModal(plan)"
              class="flex-1 px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs">💰
              Deposit
            </button>
            <button @click="deletePlan(plan)"
              class="flex-1 px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs">🗑️
              Delete
            </button>
            <button @click="viewHistory(plan)"
              class="flex-1 px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-xs">📜
              History
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden space-y-4 mt-4">
        <div v-for="plan in plans" :key="plan.id"
          class="bg-white shadow-md rounded-xl p-4 flex flex-col space-y-2 transition hover:shadow-lg">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg text-gray-800">{{ plan.plan_name }}</h3>
            <div class="flex flex-col items-end">
              <span class="text-sm text-gray-500">{{ formatDate(plan.deadline) }}</span>
              <span class="mt-1 text-xs px-2 py-0.5 rounded-full" :class="getDaysLeftClass(plan.deadline)">
                {{ daysLeft(plan.deadline) }} days left
              </span>
            </div>
          </div>

          <div class="flex justify-between">
            <span>Target:</span>
            <span>{{ formatPrice(plan.target_amount, plan.target_currency) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Current:</span>
            <span>{{ formatPrice(plan.current_amount, plan.current_amount_currency) }}</span>
          </div>
          <div class="w-full bg-gray-200 h-3 rounded-full mt-2">
            <div class="h-3 rounded-full transition-all"
              :style="{ width: ((plan.progress ?? (plan.current_amount / plan.target_amount * 100)) + '%'), background: 'linear-gradient(to right, #4ade80, #16a34a)' }">
            </div>
          </div>
          <div class="flex justify-center items-center mt-4 gap-2">
            <!-- Deposit Button -->
            <button @click="openDepositModal(plan)"
              class="flex-1 flex items-center justify-center p-2 bg-blue-100 rounded-lg hover:bg-blue-600 transition">
              <img src="/img/icons/deposit.png" alt="Deposit" class="w-5 h-5" />
            </button>

            <!-- Delete Button -->
            <button @click="deletePlan(plan)"
              class="flex-1 flex items-center justify-center p-2 bg-red-100 rounded-lg hover:bg-red-600 transition">
              <img src="/img/icons/bin.png" alt="Delete" class="w-5 h-5" />
            </button>

            <!-- History Button -->
            <button @click="viewHistory(plan)"
              class="flex-1 flex items-center justify-center p-2 bg-green-100 rounded-lg hover:bg-green-600 transition">
              <img src="/img/icons/history.png" alt="History" class="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      <!-- Deposit History Modal -->
      <div v-if="showHistoryModal"
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div class="bg-white rounded-xl p-6 w-11/12 max-w-lg max-h-[80vh] overflow-y-auto shadow-lg">
          <h2 class="text-2xl font-bold mb-4 text-indigo-600">Deposit History for {{ selectedPlan.plan_name }}</h2>

          <div v-if="depositHistory.length === 0" class="text-center text-gray-400 mt-6">
            No deposits yet.
          </div>

          <div v-else class="space-y-4">
            <div v-for="deposit in depositHistory" :key="deposit.id"
              class="flex items-center space-x-4 p-3 border rounded-lg hover:shadow-md transition">
              <div
                class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                ❕
              </div>
              <div class="flex-1">
                <div class="text-gray-800 font-medium text-lg">{{ formatPrice(deposit.amount, deposit.currency) }}</div>
                <div class="text-gray-500 text-sm">{{ formatDate(deposit.deposited_date) }}</div>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button @click="showHistoryModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              <img src="/img/icons/close.png" alt="close" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Deposit Modal -->
      <div v-if="showDepositModal"
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div class="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Deposit to {{ selectedPlan.plan_name }}</h2>
          <form @submit.prevent="submitDeposit" class="space-y-3">
            <div>
              <label class="text-gray-700">Amount</label>
              <input v-model.number="depositAmount" type="number" required
                class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label class="text-gray-700">Currency</label>
              <select v-model="depositCurrency"
                class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="USD">USD</option>
                <option value="KHR">KHR</option>
              </select>
            </div>
            <div class="flex justify-end space-x-2 mt-2">
              <button type="button" @click="closeDepositModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                <img src="/img/icons/cancel.png" alt="Cancel" class="w-5 h-5" />
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-100 text-white rounded hover:bg-blue-600">
                <img src="/img/icons/deposit.png" alt="deposit" class="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Create Budget Modal -->
      <div v-if="showCreateModal"
        class="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 bg-opacity-70 backdrop-blur-sm">

        <div
          class="relative bg-white rounded-2xl w-11/12 max-w-md p-6 shadow-2xl overflow-hidden transform transition-all scale-95 opacity-0 animate-fade-in">

          <!-- Gradient Accent -->
          <div class="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-indigo-50 opacity-30 -z-10 rounded-2xl">
          </div>

          <!-- Modal Header -->
          <h2 class="text-2xl font-extrabold text-indigo-600 text-center mb-6">🎯 Create Budget Plan</h2>

          <!-- Modal Form -->
          <form @submit.prevent="createBudgetPlanHandler" class="space-y-4">

            <!-- Plan Name -->
            <div class="flex flex-col">
              <label class="text-gray-700 font-medium mb-1">Plan Name</label>
              <input v-model="newPlan.plan_name" type="text" required
                class="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-gray-50 shadow-inner" />
            </div>

            <!-- Target Amount + Currency -->
            <div class="flex space-x-2">
              <div class="flex-1 flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Target Amount</label>
                <div class="flex items-center space-x-2">
                  <span class="text-indigo-500 text-xl">💰</span>
                  <input v-model.number="newPlan.amount" type="number" required
                    class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 bg-gray-50 shadow-inner" />
                </div>
              </div>
              <div class="flex-1 flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Currency</label>
                <select v-model="newPlan.amount_currency"
                  class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 bg-gray-50 shadow-inner">
                  <option value="USD">USD</option>
                  <option value="KHR">KHR</option>
                </select>
              </div>
            </div>

            <!-- Initial Amount + Currency -->
            <div class="flex space-x-2">
              <div class="flex-1 flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Initial Amount</label>
                <div class="flex items-center space-x-2">
                  <span class="text-green-500 text-xl">💵</span>
                  <input v-model.number="newPlan.initial_amount" type="number" required
                    class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-400 bg-gray-50 shadow-inner" />
                </div>
              </div>
              <div class="flex-1 flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Currency</label>
                <select v-model="newPlan.initial_amount_currency"
                  class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-400 bg-gray-50 shadow-inner">
                  <option value="USD">USD</option>
                  <option value="KHR">KHR</option>
                </select>
              </div>
            </div>

            <!-- Target Date -->
            <div class="flex flex-col">
              <label class="text-gray-700 font-medium mb-1">Target Date</label>
              <input v-model="newPlan.target_date" type="date" required
                class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 bg-gray-50 shadow-inner" />
            </div>

            <!-- Buttons -->
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="closeCreateModal"
                class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                <img src="/img/icons/cancel.png" alt="Cancel" class="w-5 h-5" />

              </button>
              <button type="submit"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                <img src="/img/icons/submit.png" alt="Create Income" class="w-5 h-5" />
              </button>
            </div>

          </form>
        </div>
      </div>

    </main>
  </div>
</template>
<style>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.25s ease-out forwards;
}
</style>
<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { formatPrice } from '@/services/numeric'
import { useLoadingStore } from '@/stores/loading'
import {
  fetchAllBudgetPlans,
  createBudgetPlan,
  depositToPlan,
  deleteBudgetPlan,
  fetchDepositHistory
} from '@/services/budgetApi'

import { useNotification } from '@/stores/notification'
const { notify } = useNotification();

// Confirmation Modal
import { useConfirmStore } from '@/stores/confirm'
const confirmStore = useConfirmStore()

const showCreateModal = ref(false)
const showDepositModal = ref(false)
const showHistoryModal = ref(false)
const selectedPlan = ref({})
const depositAmount = ref(0)
const depositCurrency = ref('USD')
const depositHistory = ref([])

const newPlan = ref({
  plan_name: '',
  amount: null,               // instead of 0
  amount_currency: 'USD',
  initial_amount: 0,       // instead of 0
  initial_amount_currency: 'USD',
  target_date: ''             // must be string
})

const plans = ref([])
const page = ref(0)
const size = 10
const totalPages = ref(1)

const loadingStore = useLoadingStore()

// ---------------- MODAL HANDLERS ----------------
const openCreateModal = () => showCreateModal.value = true
const closeCreateModal = () => showCreateModal.value = false
const openDepositModal = (plan) => {
  selectedPlan.value = plan
  depositAmount.value = 0
  depositCurrency.value = plan.current_amount_currency || 'USD'
  showDepositModal.value = true
}
const closeDepositModal = () => showDepositModal.value = false

// ---------------- API FUNCTIONS ----------------
const loadPlans = async () => {
  try {
    loadingStore.show()
    const res = await fetchAllBudgetPlans(page.value, size)
    plans.value = res?.content ?? []
    totalPages.value = res?.total_pages ?? 1
  } catch (err) {
    console.error(err)
  } finally {
    loadingStore.hide()
  }
}

// ---------------- CREATE BUDGET PLAN ----------------
const createBudgetPlanHandler = async () => {
  try {
    const payload = {
      plan_name: newPlan.value.plan_name?.trim() || "",
      amount: Number(newPlan.value.amount) || 0,
      amount_currency: newPlan.value.amount_currency || "USD",
      initial_amount: Number(newPlan.value.initial_amount) || 0,
      initial_amount_currency: newPlan.value.initial_amount_currency || "USD",
      target_date: newPlan.value.target_date || ""
    };

    const action = async () => {
      const res = await createBudgetPlan(payload);
      console.log("API Response:", res);

      // Close modal
      showCreateModal.value = false;

      // Reset form
      newPlan.value = {
        plan_name: '',
        amount: null,
        amount_currency: 'USD',
        initial_amount: 0,
        initial_amount_currency: 'USD',
        target_date: ''
      };

      // Notify success
      notify("success", "Budget Plan Created!", `Plan "${payload.plan_name}" has been added.`);

      // Reload plans
      await loadPlans();
    }

    // For creation, we can skip confirmation and just save
    await action();

  } catch (err) {
    console.error(err);
    notify("error", "Creation Failed!", "Something went wrong while creating the plan.");
  }
};

// ---------------- DEPOSIT TO PLAN ----------------
const submitDeposit = async () => {
  try {
    const newTotal = selectedPlan.value.current_amount + depositAmount.value
    if (newTotal > selectedPlan.value.target_amount) {
      notify("error", "Deposit Failed!", "This deposit exceeds your target amount.")
      return
    }

    const action = async () => {
      const res = await depositToPlan(
        selectedPlan.value.id,
        depositAmount.value,
        depositCurrency.value
      )

      if (res.data?.amount != null) {
        selectedPlan.value.current_amount += res.data.amount
        selectedPlan.value.current_amount_currency = res.data.currency
        selectedPlan.value.progress = res.data.progress
      }

      closeDepositModal()
      notify("success", "Deposit Successful!", "Your deposit has been added.")
      loadPlans()
    }

    // Optional: ask confirmation before deposit
    confirmStore.open(
      `Deposit ${depositAmount.value} ${depositCurrency.value} to "${selectedPlan.value.plan_name}"?`,
      action
    )

  } catch (err) {
    console.error(err)
    notify("error", "Deposit Failed!", "Something went wrong while depositing.")
  }
}

// ---------------- DELETE PLAN ----------------
const deletePlan = async (plan) => {
  try {
    const action = async () => {
      await deleteBudgetPlan(plan.id)
      notify("delete", "Plan Deleted!", `"${plan.plan_name}" has been removed.`)
      loadPlans()
    }

    // Use confirmation modal globally
    confirmStore.open(`Are you sure you want to delete "${plan.plan_name}"?`, action)

  } catch (err) {
    console.error(err)
    notify("error", "Delete Failed!", "Something went wrong while deleting the plan.")
  }
}


const viewHistory = async (plan) => {
  selectedPlan.value = plan
  depositHistory.value = []
  showHistoryModal.value = true
  try {
    depositHistory.value = await fetchDepositHistory(plan.id)
  } catch (err) {
    console.error(err)
    alert('Failed to load deposit history')
  }
}

// ---------------- HELPERS ----------------
const daysLeft = (deadline) => {
  if (!deadline) return '-';
  const now = new Date();
  const end = new Date(deadline);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const getDaysLeftClass = (deadline) => {
  const days = daysLeft(deadline);
  if (days <= 3) return 'bg-red-200 text-red-600';
  if (days <= 7) return 'bg-yellow-200 text-yellow-600';
  return 'bg-green-200 text-green-600';
};

const formatDate = (timestamp) => {
  if (!timestamp) return "-"
  const date = new Date(timestamp)
  if (isNaN(date)) return "-"
  return date.toLocaleDateString() + " " + date.toLocaleTimeString()
}

onMounted(() => { loadPlans() })
</script>
