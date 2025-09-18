<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />

    <main class="flex-1 p-4 md:p-6 relative">

      <!-- Header -->
      <div
        class="sticky top-0 bg-gray-100 z-30 flex flex-col md:flex-row md:items-center md:justify-between px-4 pt-16 sm:pt-4 pb-4 shadow-sm">
        <h1 class="text-xl md:text-2xl font-bold mb-2 md:mb-0">Income Dashboard</h1>
        <div class="flex space-x-2">
          <!-- Toggle Filters Button -->
          <button @click="showFilters = !showFilters"
            class="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center justify-center">
            <template v-if="showFilters">
              <img :src="`/img/icons/show.png`" alt="Show Filters" class="w-5 h-5" />
            </template>
            <template v-else>
              <img :src="`/img/icons/hide.png`" alt="Show Filters" class="w-5 h-5" />
            </template>
          </button>

          <!-- Create Income Button -->
          <button @click="openCreateModal"
            class="w-10 h-10 bg-green-500 hover:bg-green-600 flex items-center justify-center p-1">
            <img :src="`/img/icons/create.png`" alt="Create" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Filter Section -->
      <div v-if="showFilters"
        class="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-2 sm:space-y-0">

        <!-- Category -->
        <div class="flex-1">
          <label class="block text-sm font-medium mb-1">Category</label>
          <div class="flex flex-col space-y-2">
            <select v-model="filters.category" class="w-full border p-2 rounded">
              <option value="">All</option>
              <option value="Crypto">Crypto</option>
              <option value="Forex">Forex</option>
              <option value="Interest Rate">Interest Rate</option>
              <option value="Airdrop">Airdrop</option>
              <option value="__custom__">User Input</option>
            </select>
            <input v-if="filters.category === '__custom__'" v-model="filters.customCategory" type="text"
              placeholder="Enter custom category" class="w-full border p-2 rounded" />
          </div>
        </div>

        <!-- Type -->
        <div class="flex-1">
          <label class="block text-sm font-medium mb-1">Type</label>
          <select v-model="filters.pnl_type" class="w-full border p-2 rounded">
            <option value="">All</option>
            <option value="+">+</option>
            <option value="-">-</option>
          </select>
        </div>

        <!-- Currency -->
        <div class="flex-1">
          <label class="block text-sm font-medium mb-1">Currency</label>
          <select v-model="filters.currency" class="w-full border p-2 rounded">
            <option value="">All</option>
            <option value="USD">USD</option>
            <option value="KHR">KHR</option>
          </select>
        </div>

        <!-- Filter Button -->
        <div class="flex justify-end sm:mt-0 mt-2">
          <button @click="applyFilters" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            <img src="/img/icons/submit.png" alt="Create Income" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block bg-white shadow-md rounded-lg overflow-auto max-h-[550px]">
        <table class="min-w-full border-collapse">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-2 text-left">Date</th>
              <th class="px-4 py-2 text-left">Category</th>
              <th class="px-4 py-2 text-left">Amount</th>
              <th class="px-4 py-2 text-left">Type</th>
              <th class="px-4 py-2 text-left">Note</th>
              <th class="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="income in incomes" :key="income.id" class="border-t hover:bg-gray-50">
              <td class="px-6 py-3">{{ income.date.substring(0, 10) }}</td>
              <td class="px-6 py-3">{{ income.category }}</td>
              <td class="px-6 py-3">{{ formatPrice(income.pnl, income.currency) }}</td>
              <td>{{ income.pnl_type === '+' ? '📈' : '📉' }}</td>
              <td class="px-6 py-3">
                <span>{{ truncateNote(income.note) }}</span>
                <button v-if="income.note && income.note.length > 30" @click="viewNote(income.note)"
                  class="ml-2 text-blue-500 underline text-sm hover:text-blue-700">
                  View
                </button>
              </td>
              <td class="px-6 py-3 space-x-2">
                <button @click="editIncome(income)"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">✏️</button>
                <button @click="deleteIncome(income)"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">🗑️</button>
              </td>
            </tr>
            <tr v-if="incomes.length === 0">
              <td colspan="6" class="px-4 py-6 text-center text-gray-500">No incomes found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card -->
      <div class="md:hidden space-y-4">
        <template v-for="income in incomes" :key="income.id">
          <div class="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
            <div class="flex flex-col text-sm">
              <span class="font-semibold">{{ income.category }}</span>
              <span>{{ formatPrice(income.pnl, income.currency) }}</span>
              <span>{{ income.pnl_type === '+' ? '📈' : '📉' }}</span>
              <span v-if="income.note">{{ truncateNote(income.note) }}</span>
              <button v-if="income.note && income.note.length > 30" @click="viewNote(income.note)"
                class="text-blue-500 underline text-xs mt-1">
                View
              </button>
            </div>
            <div class="flex justify-end space-x-2 mt-1">
              <button @click="editIncome(income)"
                class="px-3 py-1 bg-neutral-50 text-white rounded text-xs hover:bg-blue-600">
                <img src="/img/icons/edit.png" alt="Cancel" class="w-5 h-5" /></button>
              <button @click="deleteIncome(income)"
                class="px-3 py-1 bg-transparent text-white p-2 text-white rounded text-xs hover:bg-red-50">
                <img src="/img/icons/bin.png" alt="Cancel" class="w-5 h-5" /></button>
            </div>
          </div>
        </template>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <button class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50" :disabled="page === 0" @click="previousPage">
          <img src="/img/icons/arrow_left.png" alt="arrow-left" class="w-5 h-5" />

        </button>
        <span>Page {{ page + 1 }} of {{ totalPages }}</span>
        <button class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50" :disabled="page + 1 >= totalPages"
          @click="nextPage">
          <img src="/img/icons/arrow_right.png" alt="arrow-right" class="w-5 h-5" />
        </button>
      </div>

      <!-- Create/Edit Income Modal -->
      <div v-if="showCreateModal"
        class="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 bg-opacity-70 backdrop-blur-sm">
        <div class="bg-white rounded-xl p-6 w-11/12 max-w-md">
          <h2 class="text-xl font-bold mb-4">{{ editingIncome ? 'Edit Income' : 'Create Income' }}</h2>
          <form @submit.prevent="saveIncome" class="space-y-3">
            <div>
              <label>Category</label>
              <div class="flex flex-col space-y-2">
                <select v-model="newIncome.category" class="w-full border p-2 rounded" required>
                  <option value="">Select Category</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Forex">Forex</option>
                  <option value="Interest Rate">Interest Rate</option>
                  <option value="Airdrop">Airdrop</option>
                  <option value="__custom__">Other</option>
                </select>
                <input v-if="newIncome.category === '__custom__'" v-model="newIncome.customCategory" type="text"
                  placeholder="Enter custom category" class="w-full border p-2 rounded" required />
              </div>
            </div>
            <div>
              <label>Amount (PNL)</label>
              <input v-model.number="newIncome.pnl" required class="w-full border p-2 rounded" />
            </div>
            <div>
              <label>Currency</label>
              <select v-model="newIncome.currency" class="w-full border p-2 rounded">
                <option value="USD">USD</option>
                <option value="KHR">KHR</option>
              </select>
            </div>
            <div>
              <label>Type (+ / -)</label>
              <select v-model="newIncome.pnl_type" class="w-full border p-2 rounded">
                <option value="+">+</option>
                <option value="-">-</option>
              </select>
            </div>
            <div>
              <label>Date</label>
              <input v-model="newIncome.date" type="date" required class="w-full border p-2 rounded" />
            </div>
            <div>
              <label>Note</label>
              <input v-model="newIncome.note" type="text" class="w-full border p-2 rounded" />
            </div>
            <div class="flex justify-end space-x-2 mt-2">
              <button type="button" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" @click="closeCreateModal">
                <img src="/img/icons/cancel.png" alt="Cancel" class="w-5 h-5" />
              </button>
              <button type="submit" class="px-4 py-2 bg-gray-300 text-white rounded hover:bg-green-600">
                <template v-if="editIncome">
                  <img src="/img/icons/save.png" alt="save" class="w-5 h-5" />
                </template>
                <template v-else>
                  <img src="/img/icons/cancel.png" alt="cancel" class="w-5 h-5" />
                </template>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- View Note Modal -->
      <div v-if="showNoteModal"
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div class="bg-white rounded-xl p-6 w-11/12 max-w-md">
          <h2 class="text-xl font-bold mb-4">Note</h2>
          <p class="whitespace-pre-wrap text-gray-700">{{ selectedNote }}</p>
          <div class="flex justify-end mt-4">
            <button @click="showNoteModal = false"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { formatPrice } from '@/services/numeric'
import { useLoadingStore } from '@/stores/loading'
import { fetchIncomes, createIncome, updateIncome, deleteIncomeApi, filterIncomes } from '@/services/incomeApi'

// Notification Alert
import { useNotification } from '@/stores/notification'
const { notify } = useNotification();

// Confirmation Modal
import { useConfirmStore } from '@/stores/confirm'
const confirmStore = useConfirmStore()

const loadingStore = useLoadingStore()
const incomes = ref([])
const page = ref(0)
const size = 10
const totalPages = ref(1)

// Toggle Filters
const showFilters = ref(true)

// CRUD Modal
const showCreateModal = ref(false)
const editingIncome = ref(false)
const newIncome = ref({ id: null, pnl: 0, currency: 'USD', category: '', customCategory: '', pnl_type: '+', note: '', date: '' })

// Note modal
const showNoteModal = ref(false)
const selectedNote = ref("")

// Filters
const filters = ref({
  category: '',
  customCategory: '',
  pnl_type: '',
  currency: ''
})

const truncateNote = (note, length = 30) => {
  if (!note) return "-"
  return note.length > length ? note.substring(0, length) + "..." : note
}
const viewNote = (note) => {
  selectedNote.value = note
  showNoteModal.value = true
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString
  const d = new Date(dateString)
  return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : ""
}

const loadIncomes = async (currentFilters = null) => {
  try {
    loadingStore.show()
    let response
    if (currentFilters) {
      response = await filterIncomes({ ...currentFilters, page: page.value, size })
    } else {
      response = await fetchIncomes({ page: page.value, size })
    }
    incomes.value = response.content
    totalPages.value = response.total_pages
  } catch (err) {
    console.error('Error loading incomes:', err)
  } finally {
    loadingStore.hide()
  }
}

const nextPage = async () => {
  if (page.value + 1 < totalPages.value) {
    page.value++
    await loadIncomes(applyCategoryFilter(filters.value))
  }
}
const previousPage = async () => {
  if (page.value > 0) {
    page.value--
    await loadIncomes(applyCategoryFilter(filters.value))
  }
}

const openCreateModal = () => {
  editingIncome.value = false
  newIncome.value = { id: null, pnl: 0, currency: 'USD', category: '', customCategory: '', pnl_type: '+', note: '', date: '' }
  showCreateModal.value = true
}
const closeCreateModal = () => { showCreateModal.value = false }

const normalizeIncomeCategory = (income) => {
  return {
    ...income,
    category: income.category === '__custom__' ? income.customCategory : income.category
  }
}

const saveIncome = async () => {
  try {
    const payload = normalizeIncomeCategory(newIncome.value)
    const action = async () => {
      if (editingIncome.value) {
        await updateIncome(payload.id, payload)
      } else {
        await createIncome(payload)
      }
      notify("success", "Income saved!", "Your record has been saved!");
      closeCreateModal();
      loadIncomes();
    }
    await action()
  } catch (err) {
    console.error(err)
    notify("error", "Save Failed!", "Something went wrong while saving the income.")
  }
}

const editIncome = (income) => {
  editingIncome.value = true
  newIncome.value = {
    ...income,
    customCategory: '',
    date: formatDateForInput(income.date)
  }
  showCreateModal.value = true
}

const deleteIncome = async (income) => {
  try {
    const action = async () => {
      await deleteIncomeApi(income.id)
      notify("success", "Income deleted!", "Your record has been removed.")
      loadIncomes()
    }
    confirmStore.open(`Are you sure you want to delete "${income.category}" income?`, action)
  } catch (err) {
    console.error(err)
    notify("error", "Delete Failed!", "Something went wrong while deleting the income.")
  }
}

const applyCategoryFilter = (filtersObj) => {
  return {
    ...filtersObj,
    category: filtersObj.category === '__custom__'
      ? filtersObj.customCategory
      : filtersObj.category
  }
}

const applyFilters = async () => {
  try {
    page.value = 0
    const applied = applyCategoryFilter(filters.value)
    await loadIncomes(applied)
  } catch (err) {
    console.error('Filter error:', err)
    notify("error", "Filter Failed", "Could not load filtered incomes.")
  }
}

onMounted(() => { loadIncomes() })
</script>
