<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Mobile Topbar -->
    <header v-if="!isOpen"
      class="sm:hidden fixed top-0 left-0 w-full bg-teal-500 text-white p-4 flex justify-between items-center z-50 shadow-md">
      <span @click="goHome" class="font-bold cursor-pointer">{{ projectName }}</span>
      <button @click="isOpen = true" class="text-2xl">☰</button>
    </header>

    <!-- Sidebar -->
    <transition name="slide">
      <aside v-show="!isMobile || isOpen" :class="[
        'fixed sm:static h-full flex flex-col justify-between bg-white shadow-lg z-50 overflow-y-auto',
        isMobile ? 'w-full top-0' : 'w-80 top-0'
      ]">
        <!-- Mobile Header -->
        <div v-if="isMobile" class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span class="font-bold text-lg">{{ projectName }}</span>
          <button @click="isOpen = false" class="text-2xl">✕</button>
        </div>

        <!-- Desktop Header -->
        <div class="hidden sm:block p-6 text-2xl font-bold border-b border-gray-200">
          <a href="/">{{ projectName }}</a>
        </div>

        <!-- Sidebar Menu -->
        <nav class="flex-1 px-4 py-6 space-y-4">
          <div v-for="menu in menus" :key="menu.name">
            <!-- Main Menu Button -->
            <button :class="[
              'w-full flex justify-between items-center px-4 py-2 font-semibold rounded-lg shadow-sm transition-all duration-200',
              menu.color,
              sidebarStore.openMenu.includes(menu.name) ? 'bg-opacity-25' : 'bg-opacity-10',
              'hover:scale-105'
            ]" @click="sidebarStore.toggleMenu(menu.name)">
              <span>{{ menu.label }}</span>
              <span class="text-lg font-bold">
                {{ sidebarStore.openMenu.includes(menu.name) ? '−' : '+' }}
              </span>
            </button>

            <!-- Submenus -->
            <transition @enter="enter" @leave="leave">
              <ul v-show="sidebarStore.openMenu.includes(menu.name)" class="pl-6 mt-2 space-y-1 overflow-hidden">
                <li v-for="item in menu.items" :key="item.label">
                  <!-- Item without subItems -->
                  <div v-if="!item.subItems" class="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
                    @click="navigate(item.path)">
                    {{ item.label }}
                  </div>

                  <!-- Item with subItems -->
                  <template v-else>
                    <div v-if="item.label === 'Setting'" class="px-3 py-2 font-semibold">
                      {{ item.label }}
                    </div>
                    <ul v-if="item.label === 'Setting'" class="pl-5 mt-1 space-y-1">
                      <li v-for="sub in item.subItems" :key="sub.label"
                        class="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer" @click="navigate(sub.path)">
                        {{ sub.label }}
                      </li>
                    </ul>
                  </template>
                </li>
              </ul>
            </transition>
          </div>
        </nav>

        <!-- Footer -->
        <div class="border-t border-gray-200 p-4 pb-20 sm:pb-4">
          <button @click="logout"
            class="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Logout
          </button>
          <p class="text-xs text-gray-500 text-center mt-2">Version: {{ version }}</p>
        </div>
      </aside>
    </transition>

    <!-- Overlay -->
    <div v-show="isOpen && isMobile" class="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
      @click="isOpen = false">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'
import { logout } from '@/services/auth'

const router = useRouter()
const sidebarStore = useSidebarStore()

const projectName = "Expenditure Diary"
const isOpen = ref(false)
const isMobile = ref(false)
const version = "1.0.0"

// 1️⃣2️⃣3️⃣ 4️⃣
const menus = [
  {
    name: 'expense',
    label: 'Expense Tracking',
    color: 'bg-teal-100 text-teal-800',
    items: [
      { label: '✨ Expense', path: '/expense' },
      {
        label: 'Setting',
        subItems: [
          { label: '1️⃣ Balance', path: '/expense/balance' },
          { label: '2️⃣ Recurring Expenses', path: '/expense/recurring-expense' },
          { label: '3️⃣ Notification', path: '/expense/notification' },
          // { label: '4️⃣ Analysis', path: '/expense/category' }
        ]
      }
    ]
  },
  {
    name: 'income',
    label: 'Income Tracking',
    color: 'bg-green-100 text-green-800',
    items: [
      { label: '✨ Income', path: '/income' },
      {
        label: 'Setting',
        subItems: [
          { label: '1️⃣ Notification', path: '/income/notification' }
        ]
      }
    ]
  },
  {
    name: 'budget',
    label: 'Budget Planner',
    color: 'bg-sky-100 text-teal-800',
    items: [
      { label: '✨ Budget', path: '/budget' },
      {
        label: 'Setting',
        subItems: [
          // { label: '1️⃣ Category', path: '/budget/category' },
          { label: '1️⃣ Notification', path: '/budget/notification' }
        ]
      }
    ]
  },
  {
    name: 'investment',
    label: 'Investment Tracking',
    color: 'bg-sky-100 text-teal-800',
    items: [
      { label: '🔥Economic Event', path: '/economic-event' },
      { label: '🔥Signal', path: '/trading-strategy' },
      // { label: '✨Alert', path: '/alert' },
      { label: '✨Calculator', path: '/usdc-calculator' },
      { label: '💸Checklist', path: '/checklist' },
    ]
  },
  {
    name: 'global',
    label: 'Global',
    color: 'bg-indigo-100 text-indigo-800',
    items: [
      { label: '1️⃣ Activity Log', path: '/global/activity-log' },
      { label: '2️⃣ Category', path: '/global/category' },
      { label: '3️⃣ Report', path: '/global/report' }
    ]
  }
]

function navigate(path) {
  if (path) {
    router.push(path)
    if (isMobile.value) isOpen.value = false
  }
}

// NEW: Go to home route
function goHome() {
  router.push('/')
  if (isMobile.value) isOpen.value = false
}

function enter(el) {
  el.style.height = '0'
  el.style.opacity = 0
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.3s ease, opacity 0.3s ease'
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = 1
  })
}
function leave(el) {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = 1
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.3s ease, opacity 0.3s ease'
    el.style.height = '0'
    el.style.opacity = 0
  })
}

function checkMobile() {
  isMobile.value = window.innerWidth < 640
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onBeforeUnmount(() => window.removeEventListener('resize', checkMobile))
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>