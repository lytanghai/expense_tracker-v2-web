import { createRouter, createWebHistory } from 'vue-router'

// Auth
import Login from '@/views/Auth/Login.vue'

// Main pages
import Home from '@/views/Home.vue'
import Expense from '@/views/Expense/Expense.vue'
import Balance from '@/views/Expense/Balance.vue'
import RecurringExpense from '@/views/Expense/RecurringExpense.vue'
import Notification from '@/views/Expense/Notification.vue'

import Income from '@/views/Income/Income.vue'
import NotificationIncome from '@/views/Income/Notification.vue'

import Budget from '@/views/Budget/Budget.vue'
import NotificationBudget from '@/views/Budget/Notification.vue'

import Invest from '@/views/Investment/EconomicEvent.vue'
import UsdcToUsdCalculator from '@/views/Investment/UsdcToUsdCalculator.vue'
import TradingStrategy from '@/views/Investment/TradingStrategy.vue'
import EMA_RSI_Trend from '@/views/Investment/strategy/EMA_RSI_Trend.vue'
import BreakoutScalper from '@/views/Investment/strategy/BreakoutScalper.vue'
import Alert from '@/views/Investment/Alert.vue'

import ActivityLog from '@/views/Global/ActivityLog.vue'
import Report from '@/views/Global/Report.vue'
import Category from '@/views/Global/Category.vue'

// Experimental API
import Experimental from '@/components/Experimental.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/exp', name: 'Experimental', component: Experimental },

  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },

  { path: '/expense', component: Expense, meta: { requiresAuth: true } },
  { path: '/expense/balance', component: Balance, meta: { requiresAuth: true } },
  { path: '/expense/recurring-expense', component: RecurringExpense, meta: { requiresAuth: true } },
  { path: '/expense/notification', component: Notification, meta: { requiresAuth: true } },

  { path: '/income', component: Income, meta: { requiresAuth: true } },
  { path: '/income/notification', component: NotificationIncome, meta: { requiresAuth: true } },

  { path: '/budget', component: Budget, meta: { requiresAuth: true } },
  { path: '/budget/notification', component: NotificationBudget, meta: { requiresAuth: true } },

  { path: '/economic-event', component: Invest, meta: { requiresAuth: true } },
  { path: '/usdc-calculator', component: UsdcToUsdCalculator, meta: { requiresAuth: true } },
  { path: '/trading-strategy', component: TradingStrategy, meta: { requiresAuth: true } },
  { path: '/strategy/ema-rsi', component: EMA_RSI_Trend, meta: { requiresAuth: true } },
  { path: '/strategy/breakout-scalper', component: BreakoutScalper, meta: { requiresAuth: true } },
  { path: '/alert', component: Alert, meta: { requiresAuth: true } },

  { path: '/global/activity-log', component: ActivityLog, meta: { requiresAuth: true } },
  { path: '/global/report', component: Report, meta: { requiresAuth: true } },
  { path: '/global/category', component: Category, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ✅ Global Guard
router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  if (to.path === '/login' && token) {
    return '/'
  }
})

export default router
