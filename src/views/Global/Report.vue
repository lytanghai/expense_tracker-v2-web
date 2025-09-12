<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar />

    <main class="flex-1 p-6 overflow-y-auto relative">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">📊 Report Generator</h1>

      <!-- Report Type / Period Container -->
      <div class="bg-white shadow-lg rounded-xl p-4 sm:p-6 mb-6">
        <h2 class="text-lg font-semibold mb-3 text-gray-700">Select Report Type</h2>
        <select v-model="selectedType"
          class="w-full sm:w-auto p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base">
          <option value="">-- Select Type --</option>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
          <!-- <option value="Investment">Investment</option> -->
        </select>
      </div>

      <div class="bg-white shadow-lg rounded-xl p-4 sm:p-6 mb-6">
        <h2 class="text-lg font-semibold mb-3 text-gray-700">Select Period</h2>
        <select v-model="period"
          class="w-full sm:w-64 p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base">
          <option value="">-- Select Period --</option>
          <option value="today">Today</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Customize</option>
        </select>

        <!-- Custom Dates -->
        <div v-if="period === 'custom'" class="flex flex-col sm:flex-row gap-2 mt-3">
          <div class="flex-1">
            <label class="block text-gray-600 mb-1 text-sm sm:text-base">Start Date</label>
            <input type="date" v-model="customStart"
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
          </div>
          <div class="flex-1">
            <label class="block text-gray-600 mb-1 text-sm sm:text-base">End Date</label>
            <input type="date" v-model="customEnd"
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
          </div>
        </div>

        <!-- Month Selector -->
        <div v-if="period === 'monthly'" class="mt-3 w-full sm:w-48">
          <label class="block text-gray-600 mb-1 text-sm sm:text-base">Select Month</label>
          <input type="month" v-model="selectedMonth"
            class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" />
        </div>
      </div>

      <!-- Generate Button -->
      <button :disabled="!canGenerate || loadingStore.isLoading" @click="generateReport"
        class="w-full py-3 px-6 mb-6 text-white font-semibold rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition-all flex items-center justify-center">
        <span v-if="!loadingStore.isLoading">Generate Report</span>
        <span v-else class="flex items-center gap-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          Loading...
        </span>
      </button>

      <!-- Report Results -->
      <div v-if="reportData" class="bg-white shadow-lg rounded-xl p-6 space-y-6 relative">
        <!-- Loading Overlay -->
        <div v-if="loadingStore.isLoading"
          class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
          <svg class="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>

        <h2 class="text-xl font-semibold text-gray-700">Report Result</h2>

        <!-- Bar Chart -->
        <div class="w-full h-96 bg-gray-50 rounded-xl p-4 shadow-inner">
          <Bar v-if="barChartData.labels.length" :data="barChartData" :options="barOptions" />
          <p v-else class="text-gray-400 text-center mt-20">No data to display</p>
        </div>

        <!-- Totals -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
          <div class="bg-gradient-to-r from-blue-100 to-blue-50 p-5 rounded-xl shadow flex flex-col items-center">
            <p class="text-sm text-gray-600">Total Items</p>
            <p class="text-2xl font-bold">{{ reportData.total_item ?? '-' }}</p>
          </div>
          <div class="bg-gradient-to-r from-green-100 to-green-50 p-5 rounded-xl shadow flex flex-col items-center">
            <p class="text-sm text-gray-600">Total USD</p>
            <p class="text-2xl font-bold">{{ reportData.total_amount_in_usd ?? 0 }}</p>
          </div>
          <div class="bg-gradient-to-r from-yellow-100 to-yellow-50 p-5 rounded-xl shadow flex flex-col items-center">
            <p class="text-sm text-gray-600">Total KHR</p>
            <p class="text-2xl font-bold">{{ reportData.total_amount_in_khr ?? 0 }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { useLoadingStore } from '@/stores/loading'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import {
  fetchExpenseDailyReport,
  fetchExpenseMonthlyReport,
  fetchExpenseByDateRange,
  fetchIncomeDailyReport,
  fetchIncomeMonthlyReport,
  fetchIncomeByDateRange
} from '@/services/reportApi'

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const loadingStore = useLoadingStore()
const selectedType = ref('')
const period = ref('')
const customStart = ref('')
const customEnd = ref('')
const selectedMonth = ref('')
const reportData = ref(null)
const barChartData = ref({ labels: [], datasets: [] })
const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#FFBB28']

const canGenerate = computed(() => {
  if (!selectedType.value || !period.value) return false
  if (period.value === 'custom') return customStart.value && customEnd.value
  if (period.value === 'monthly') return selectedMonth.value
  return true
})

const formatDateOnly = (d) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// const generateReport = async () => {
//   try {
//     loadingStore.show()
//     let res
//     const isExpense = selectedType.value === 'Expense'
//     const isIncome = selectedType.value === 'Income'

//     if (isExpense) {
//       if (period.value === 'today') {
//         res = isExpense ? await fetchExpenseDailyReport() : await fetchIncomeDailyReport()
//       } else if (period.value === 'weekly') {
//         const today = new Date()
//         const startDate = formatDateOnly(today)
//         const endDateObj = new Date(today)
//         endDateObj.setDate(today.getDate() + 7)
//         const endDate = formatDateOnly(endDateObj)
//         res = isExpense ? await fetchExpenseByDateRange(startDate, endDate) : await fetchIncomeByDateRange(startDate, endDate)
//       } else if (period.value === 'custom') {
//         res = isExpense ? await fetchExpenseByDateRange(customStart.value, customEnd.value) : await fetchIncomeByDateRange(customStart.value, customEnd.value)
//       } else if (period.value === 'monthly') {
//         res = isExpense ? await fetchExpenseMonthlyReport(selectedMonth.value) : await fetchIncomeMonthlyReport(selectedMonth.value)
//       }

//       if (period.value === 'monthly') {
//         const data = res?.data
//         reportData.value = {
//           total_item: 1, // or null, since no items array
//           total_amount_in_usd: data?.total_usd || 0,
//           total_amount_in_khr: data?.total_khr || 0,
//           content: [] // no individual items
//         }
//         barChartData.value = { labels: [], datasets: [] }
//       } else {
//         // daily/weekly/custom logic
//         const content = res?.data?.content || res?.data?.result || []
//         const totalUSD = content.reduce((sum, i) => sum + (i.currency === 'USD' ? i.price : 0), 0)
//         const totalKHR = content.reduce((sum, i) => sum + (i.currency === 'KHR' ? i.price : 0), 0)

//         reportData.value = {
//           total_item: content.length,
//           total_amount_in_usd: totalUSD,
//           total_amount_in_khr: totalKHR,
//           content
//         }

//         // Prepare bar chart
//         const grouped = {}
//         content.forEach(item => {
//           grouped[item.category] = (grouped[item.category] || 0) + item.price
//         })

//         barChartData.value = {
//           labels: Object.keys(grouped),
//           datasets: [
//             {
//               label: 'Amount',
//               data: Object.values(grouped),
//               backgroundColor: colors.slice(0, Object.keys(grouped).length)
//             }
//           ]
//         }
//       }
//     } else if(isIncome) {

//     }


//   } catch (err) {
//     console.error(err)
//     alert('Failed to generate report')
//   } finally {
//     loadingStore.hide()
//   }
// }

const generateReport = async () => {
  try {
    loadingStore.show()
    let res
    const isExpense = selectedType.value === 'Expense'
    const isIncome = selectedType.value === 'Income'

    // --- Fetch data ---
    if (period.value === 'today') {
      res = isExpense
        ? await fetchExpenseDailyReport()
        : await fetchIncomeDailyReport()
    } else if (period.value === 'weekly') {
      const today = new Date()
      const startDate = formatDateOnly(today)
      const endDateObj = new Date(today)
      endDateObj.setDate(today.getDate() + 7)
      const endDate = formatDateOnly(endDateObj)
      res = isExpense
        ? await fetchExpenseByDateRange(startDate, endDate)
        : await fetchIncomeByDateRange(startDate, endDate)
    } else if (period.value === 'custom') {
      res = isExpense
        ? await fetchExpenseByDateRange(customStart.value, customEnd.value)
        : await fetchIncomeByDateRange(customStart.value, customEnd.value)
    } else if (period.value === 'monthly') {
      res = isExpense
        ? await fetchExpenseMonthlyReport(selectedMonth.value)
        : await fetchIncomeMonthlyReport(selectedMonth.value)
    }

    // --- Process data ---
    if (isExpense) {
      if (period.value === 'monthly') {
        const data = res?.data
        reportData.value = {
          total_item: 1,
          total_amount_in_usd: data?.total_usd || 0,
          total_amount_in_khr: data?.total_khr || 0,
          content: []
        }
        barChartData.value = { labels: [], datasets: [] }
      } else {
        const content = res?.data?.content || res?.data?.result || []
        const totalUSD = content.reduce(
          (sum, i) => sum + (i.currency === 'USD' ? i.price : 0),
          0
        )
        const totalKHR = content.reduce(
          (sum, i) => sum + (i.currency === 'KHR' ? i.price : 0),
          0
        )
        reportData.value = {
          total_item: content.length,
          total_amount_in_usd: totalUSD,
          total_amount_in_khr: totalKHR,
          content
        }

        // Bar chart
        const grouped = {}
        content.forEach(item => {
          grouped[item.category] = (grouped[item.category] || 0) + item.price
        })
        barChartData.value = {
          labels: Object.keys(grouped),
          datasets: [
            {
              label: 'Amount',
              data: Object.values(grouped),
              backgroundColor: colors.slice(0, Object.keys(grouped).length)
            }
          ]
        }
      }
    } else if (isIncome) {
      if (period.value === 'monthly') {
        // Monthly Income: use content array if available
        const content = res?.data?.content || []
        const totalUSD = content.reduce((sum, i) => sum + (i.currency === 'USD' ? i.pnl : 0), 0)
        const totalKHR = content.reduce((sum, i) => sum + (i.converted_price ?? 0), 0)

        reportData.value = {
          total_item: content.length,
          total_amount_in_usd: totalUSD,
          total_amount_in_khr: totalKHR,
          content
        }

        // Bar chart
        const grouped = {}
        content.forEach(item => {
          grouped[item.category] = (grouped[item.category] || 0) + (item.pnl ?? 0)
        })
        barChartData.value = {
          labels: Object.keys(grouped),
          datasets: [
            {
              label: 'Amount',
              data: Object.values(grouped),
              backgroundColor: colors.slice(0, Object.keys(grouped).length)
            }
          ]
        }
      } {
        // Daily / Weekly / Custom Income (fetch-by-date returns content array)
        const content = res?.data?.content || res?.data?.result || []

        const totalUSD = content.reduce((sum, i) => sum + (i.currency === 'USD' ? i.pnl : 0), 0)
        const totalKHR = content.reduce((sum, i) => sum + (i.converted_price ?? 0), 0)

        reportData.value = {
          total_item: content.length,
          total_amount_in_usd: totalUSD,
          total_amount_in_khr: totalKHR,
          content
        }

        // Bar chart
        const grouped = {}
        content.forEach(item => {
          grouped[item.category] = (grouped[item.category] || 0) + (item.pnl ?? 0)
        })
        barChartData.value = {
          labels: Object.keys(grouped),
          datasets: [
            {
              label: 'Amount',
              data: Object.values(grouped),
              backgroundColor: colors.slice(0, Object.keys(grouped).length)
            }
          ]
        }
      }
    }
  } catch (err) {
    console.error(err)
    alert('Failed to generate report')
  } finally {
    loadingStore.hide()
  }
}


const barOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom' }, tooltip: { enabled: true } },
  maintainAspectRatio: false
}
</script>
