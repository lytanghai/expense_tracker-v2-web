<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />

    <main class="flex-1 p-4 md:p-6 relative">
      <!-- Header -->
      <div
        class="sticky top-0 bg-gray-100 z-30 flex flex-col md:flex-row md:items-center md:justify-between px-4 pt-16 sm:pt-4 pb-4 shadow-sm">
        <h1 class="text-xl md:text-2xl font-bold mb-2 md:mb-0">Expense Dashboard</h1>

        <!-- Current vs Available -->
        <div class="flex flex-col md:flex-row items-center justify-between bg-white shadow-md rounded-lg p-4 mb-4">
          <div class="flex flex-col md:flex-row md:space-x-6 items-center">
            <div class="text-gray-700 text-sm md:text-base font-medium">
              Current Spending:
              <span class="font-bold text-red-600">{{ formatPrice(currentSpending, 'USD') }} 💸</span>
            </div>
            <div class="text-gray-700 text-sm md:text-base font-medium">📍</div>
            <div class="text-gray-700 text-sm md:text-base font-medium">
              Available:
              <span class="font-bold text-green-600">{{ formatPrice(available, 'USD') }} 💰</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Toggle Button -->
      <div class="flex justify-end mb-4 space-x-2">
        <!-- Filter Toggle Button -->
        <button @click="showFilters = !showFilters"
          class="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition">
          <img :src="showFilters ? '/img/icons/hide.png' : '/img/icons/show.png'"
            :alt="showFilters ? 'Hide Filters' : 'Show Filters'" class="w-5 h-5" />
        </button>

        <!-- Create Income Button -->
        <button @click="openCreateModal"
          class="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition">
          <img src="/img/icons/create.png" alt="Create Income" class="w-5 h-5" />
        </button>
      </div>


      <!-- Filter Section -->
      <div v-if="showFilters"
        class="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-2 sm:space-y-0">
        <div class="flex-1 flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Category</label>
            <input v-model="filters.category" type="text" placeholder="Category" class="w-full border p-2 rounded" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Item</label>
            <input v-model="filters.item" type="text" placeholder="Item" class="w-full border p-2 rounded" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Currency</label>
            <select v-model="filters.currency" class="w-full border p-2 rounded">
              <option value="">All</option>
              <option value="USD">USD</option>
              <option value="KHR">KHR</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end sm:mt-0 mt-2">
          <button @click="applyFilters" class="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 sm:w-auto">
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
              <th class="px-4 py-2 text-left">Item</th>
              <th class="px-4 py-2 text-left">Category</th>
              <th class="px-4 py-2 text-left">Amount</th>
              <th class="px-4 py-2 text-left">Converted</th>
              <th class="px-4 py-2 text-left">Note</th>
              <th class="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expenses" :key="expense.id" class="border-t hover:bg-gray-50">
              <td class="px-6 py-3">{{ expense.expense_date }}</td>
              <td class="px-6 py-3">{{ expense.item }}</td>
              <td class="px-6 py-3">{{ expense.category }}</td>
              <td class="px-6 py-3">{{ formatPrice(expense.price, expense.currency) }}</td>
              <td class="px-6 py-3">{{ formatPrice(expense.converted_price, expense.converted_currency) }}</td>
              <td class="px-6 py-3">
                <span>{{ truncate(expense.note) }}</span>
                <button v-if="expense.note && expense.note.length > 30" @click="viewNote(expense.note)"
                  class="ml-2 text-blue-500 underline text-sm hover:text-blue-700">
                  View
                </button>
              </td>
              <td class="px-6 py-3 space-x-2">
                <button @click="editExpense(expense)"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">✏️</button>
                <button @click="deleteExpense(expense)"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">🗑️</button>
              </td>
            </tr>
            <tr v-if="expenses.length === 0">
              <td colspan="7" class="px-4 py-6 text-center text-gray-500">No expenses found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Grouped List -->
      <div class="md:hidden space-y-4 px-2">
        <template v-for="(group, date) in groupedExpenses" :key="date">
          <div class="text-gray-700 font-semibold text-sm mt-2 mb-1">{{ date }}</div>
          <div v-for="expense in group" :key="expense.id"
            class="bg-white rounded-xl shadow-sm p-3 flex flex-col space-y-1">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-sm">{{ expense.item }}</span>
              <span class="text-xs font-medium px-2 py-0.5 rounded-full"
                :class="expense.pnl_type === '+' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ expense.category }}
              </span>
            </div>
            <div class="flex justify-between text-xs text-gray-700">
              <span>{{ formatPrice(expense.price, expense.currency) }}</span>
              <span>{{ formatPrice(expense.converted_price, expense.converted_currency) }}</span>
            </div>
            <div v-if="expense.note" class="text-xs text-gray-600 flex justify-between items-center">
              <span>{{ truncate(expense.note) }}</span>
              <button v-if="expense.note.length > 30" @click="viewNote(expense.note)"
                class="text-blue-500 underline text-xs ml-2 hover:text-blue-700">View</button>
            </div>
            <div class="flex justify-end space-x-2 mt-1">
              <button @click="editExpense(expense)"
                class="px-3 py-1 bg-neutral-50 text-white rounded text-xs hover:bg-blue-600">
                <img src="/img/icons/edit.png" alt="edit" class="w-5 h-5" />
              </button>
              <button @click="deleteExpense(expense)"
                class="px-3 py-1 bg-transparent text-white p-2 text-white rounded text-xs hover:bg-red-50">
                <img src="/img/icons/bin.png" alt="delete" class="w-5 h-5" />
              </button>
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

      <!-- Create / Edit Expense Modal -->
      <div v-if="showCreateModal"
        class="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 bg-opacity-70 backdrop-blur-sm">
        <div class="bg-white rounded-xl p-6 w-11/12 max-w-md">
          <h2 class="text-xl font-bold mb-4">{{ editingExpense ? 'Edit Expense' : 'Create Expense' }}</h2>
          <form @submit.prevent="saveExpense" class="space-y-3">
            <div>
              <label>Item</label>
              <input v-model="newExpense.item" type="text" required class="w-full border p-2 rounded" />
            </div>
            <div>
              <label>Category</label>
              <input v-model="newExpense.category" type="text" required class="w-full border p-2 rounded" />
            </div>
            <div>
              <label>Price</label>
              <input v-model.number="newExpense.price" type="number" required class="w-full border p-2 rounded" />
            </div>
            <div>
              <label>Currency</label>
              <select v-model="newExpense.currency" class="w-full border p-2 rounded">
                <option value="USD">USD</option>
                <option value="KHR">KHR</option>
              </select>
            </div>
            <div>
              <label>Note</label>
              <input v-model="newExpense.note" type="text" class="w-full border p-2 rounded" />
            </div>
            <div class="flex justify-end space-x-2 mt-2">
              <button type="button" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" @click="closeCreateModal">
                <img src="/img/icons/cancel.png" alt="Cancel" class="w-5 h-5" />
              </button>
              <button type="submit"
                class="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center justify-center">
                <template v-if="editingExpense">
                  <img src="/img/icons/submit.png" alt="submit" class="w-5 h-5" />
                </template>
                <template v-else>
                  <img src="/img/icons/submit.png" alt="submit" class="w-5 h-5" />
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
            <button @click="showNoteModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Close
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { fetchSettings, fetchExpenses, createExpense as apiCreateExpense, deleteExpense as apiDeleteExpense, updateExpense, filterExpenses } from '@/services/api.js'
import { formatPrice, truncate } from '@/services/numeric'
import { useLoadingStore } from '@/stores/loading'
import { parse, format } from 'date-fns'

// Filters toggle
const showFilters = ref(true)

// ✅ keep only one filters object
const filters = ref({
  category: '',
  item: '',
  currency: ''
})

// Notification Alert
import { useNotification } from '@/stores/notification'
const { notify } = useNotification()

// Confirmation Modal
import { useConfirmStore } from '@/stores/confirm'
const confirmStore = useConfirmStore()

const loadingStore = useLoadingStore()
const expenses = ref([])
const page = ref(0)
const size = 10
const totalPages = ref(1)

const showNoteModal = ref(false)
const selectedNote = ref("")

const currentSpending = ref(0)
const available = ref(0)

const showCreateModal = ref(false)
const editingExpense = ref(false)
const newExpense = ref({ id: null, item: '', category: '', price: 0, currency: 'USD', note: '' })

// Load expenses
const loadExpenses = async (currentFilters = null) => {
  try {
    loadingStore.show()
    let response
    if (currentFilters) {
      response = await filterExpenses({ ...currentFilters, page: page.value, size })
    } else {
      response = await fetchExpenses({ page: page.value, size })
    }
    expenses.value = response.content
    totalPages.value = response.total_pages
  } catch (err) {
    console.error('Error loading expenses:', err)
  } finally {
    loadingStore.hide()
  }
}

// Refresh both settings + expenses
const refreshExpenses = async () => {
  try {
    const settings = await fetchSettings()
    currentSpending.value = settings.metadata.current_spending || 0
    available.value = settings.metadata.available_spending || 0
    await loadExpenses()
  } catch (err) {
    console.error("Failed to refresh:", err)
  }
}

const nextPage = async () => {
  if (page.value + 1 < totalPages.value) {
    page.value++
    await loadExpenses(filters.value)
  }
}
const previousPage = async () => {
  if (page.value > 0) {
    page.value--
    await loadExpenses(filters.value)
  }
}

// ------------------ EDIT EXPENSE ------------------
const editExpense = (expense) => {
  editingExpense.value = true
  newExpense.value = { ...expense } // populate modal with selected expense
  showCreateModal.value = true
}

// ------------------ DELETE EXPENSE ------------------
const deleteExpense = async (expense) => {
  try {
    const action = async () => {
      await apiDeleteExpense(expense.id)
      notify("success", "Expense deleted!", "Your record has been removed.")
      await loadExpenses(filters.value) // refresh list
    }
    confirmStore.open(`Are you sure you want to delete "${expense.item}"?`, action)
  } catch (err) {
    console.error(err)
    notify("error", "Delete Failed!", "Something went wrong while deleting the expense.")
  }
}

// ------------------ SAVE EXPENSE ------------------
const saveExpense = async () => {
  try {
    const payload = { ...newExpense.value }
    if (editingExpense.value) {
      await updateExpense(payload.id, payload)
      notify("success", "Expense updated!", "Your record has been updated.")
    } else {
      await apiCreateExpense(payload)
      notify("success", "Expense created!", "Your record has been saved.")
    }
    closeCreateModal()
    await loadExpenses(filters.value)
  } catch (err) {
    console.error(err)
    notify("error", "Save Failed!", "Something went wrong while saving the expense.")
  }
}

// ------------------ VIEW NOTE ------------------
const viewNote = (note) => {
  selectedNote.value = note
  showNoteModal.value = true
}


// ✅ keep only one applyFilters
const applyFilters = async () => {
  page.value = 0
  await loadExpenses(filters.value)
}

const openCreateModal = () => {
  editingExpense.value = false
  newExpense.value = { id: null, item: '', category: '', price: 0, currency: 'USD', note: '' }
  showCreateModal.value = true
}
const closeCreateModal = () => { showCreateModal.value = false }

// ... rest of your saveExpense, deleteExpense, editExpense, viewNote unchanged

const groupedExpenses = computed(() => {
  const groups = {}
  expenses.value.forEach(exp => {
    const d = parse(exp.expense_date, 'dd-MM-yyyy HH:mm:ss', new Date())
    const dateStr = format(d, 'EEEE MMM dd, yyyy')
    if (!groups[dateStr]) groups[dateStr] = []
    groups[dateStr].push(exp)
  })
  return groups
})

onMounted(async () => {
  await refreshExpenses()
})
</script>
