<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />

    <main class="flex-1 p-4 md:p-6 relative">

      <!-- Header -->
      <div
        class="sticky top-0 bg-gray-100 z-30 flex flex-col md:flex-row md:items-center md:justify-between px-4 pt-16 sm:pt-4 pb-4 shadow-sm">
        <h1 class="text-xl md:text-2xl font-bold mb-2 md:mb-0">Income Dashboard</h1>
        <button @click="openCreateModal"
          class="w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-center">
          + Create Income
        </button>
      </div>
      <!-- Filter Section -->
      <div
        class="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-2 sm:space-y-0">
        <div class="flex-1">
          <label class="block text-sm font-medium mb-1">Category</label>
          <input v-model="filters.category" type="text" placeholder="Category" class="w-full border p-2 rounded" />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium mb-1">Type</label>
          <select v-model="filters.pnl_type" class="w-full border p-2 rounded">
            <option value="">All</option>
            <option value="+">+</option>
            <option value="-">-</option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium mb-1">Currency</label>
          <select v-model="filters.currency" class="w-full border p-2 rounded">
            <option value="">All</option>
            <option value="USD">USD</option>
            <option value="KHR">KHR</option>
          </select>
        </div>
        <div class="flex justify-end sm:mt-0 mt-2">
          <button @click="applyFilters"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Filter</button>
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
              <td>{{ income.pnl_type === '+' ? '📈' : '📉' }}</td>
              <span v-if="income.note">{{ truncateNote(income.note) }}</span>
              <button v-if="income.note && income.note.length > 30" @click="viewNote(income.note)"
                class="text-blue-500 underline text-xs mt-1">View</button>
            </div>
            <div class="flex flex-col space-y-1 ml-2">
              <button @click="editIncome(income)"
                class="px-2 py-1 text-white rounded bg-blue-500 hover:bg-blue-600 text-sm">Edit</button>
              <button @click="deleteIncome(income)"
                class="px-2 py-1 text-white rounded bg-red-500 hover:bg-red-600 text-sm">Delete</button>
            </div>
          </div>
        </template>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <button class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50" :disabled="page === 0"
          @click="previousPage">Prev</button>
        <span>Page {{ page + 1 }} of {{ totalPages }}</span>
        <button class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50" :disabled="page + 1 >= totalPages"
          @click="nextPage">Next</button>
      </div>

      <!-- Create/Edit Income Modal -->
      <div v-if="showCreateModal"
        class="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 bg-opacity-70 backdrop-blur-sm">
        <div class="bg-white rounded-xl p-6 w-11/12 max-w-md">
          <h2 class="text-xl font-bold mb-4">{{ editingIncome ? 'Edit Income' : 'Create Income' }}</h2>
          <form @submit.prevent="saveIncome" class="space-y-3">
            <div>
              <label>Category</label>
              <input v-model="newIncome.category" type="text" required class="w-full border p-2 rounded" />
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
              <button type="button" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                @click="closeCreateModal">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                {{ editingIncome ? 'Save' : 'Create' }}
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
import { fetchIncomes, createIncome, updateIncome, deleteIncomeApi,filterIncomes } from '@/services/incomeApi'

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

// CRUD Modal
const showCreateModal = ref(false)
const editingIncome = ref(false)
const newIncome = ref({ id: null, pnl: 0, currency: 'USD', category: '', pnl_type: '+', note: '', date: '' })

// Note modal
const showNoteModal = ref(false)
const selectedNote = ref("")

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

  // Case 1: already in YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }

  // Case 2: full ISO or other valid date string
  const d = new Date(dateString)
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0] // → YYYY-MM-DD
  }

  // Case 3: unknown/invalid format
  return ""
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
// Update pagination
const nextPage = async () => {
  if (page.value + 1 < totalPages.value) {
    page.value++
    await loadIncomes(filters.value.category || filters.value.pnl_type || filters.value.currency ? { ...filters.value } : null)
  }
}

const previousPage = async () => {
  if (page.value > 0) {
    page.value--
    await loadIncomes(filters.value.category || filters.value.pnl_type || filters.value.currency ? { ...filters.value } : null)
  }
}

const openCreateModal = () => {
  editingIncome.value = false
  newIncome.value = { id: null, pnl: 0, currency: 'USD', category: '', pnl_type: '+', note: '', date: '' }
  showCreateModal.value = true
}
const closeCreateModal = () => { showCreateModal.value = false }

// ---------------- SAVE INCOME ----------------
const saveIncome = async () => {
  try {
    const action = async () => {
      if (editingIncome.value) {
        await updateIncome(newIncome.value.id, { ...newIncome.value })
      } else {
        await createIncome(newIncome.value)
      }

      notify("success", "Income saved!", "Your record has been saved!");
      closeCreateModal();
      loadIncomes();
    }

    await action();

  } catch (err) {
    console.error(err)
    notify("error", "Save Failed!", "Something went wrong while saving the income.")
  }
}

// ---------------- EDIT INCOME ----------------
const editIncome = (income) => {
  editingIncome.value = true
  newIncome.value = {
    ...income,
    date: formatDateForInput(income.date) // format for input type="date"
  }
  showCreateModal.value = true
}

// ---------------- DELETE INCOME ----------------
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

const filters = ref({
  category: '',
  pnl_type: '',
  currency: ''
})

const applyFilters = async () => {
  try {
    page.value = 0 // reset to first page
    await loadIncomes({ ...filters.value })
  } catch (err) {
    console.error('Filter error:', err)
    notify("error", "Filter Failed", "Could not load filtered incomes.")
  }
}

onMounted(() => { loadIncomes() })
</script>
