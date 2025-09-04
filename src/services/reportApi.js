// src/services/reportApi.js
import api from "@/services/api"; // shared axios instance with interceptors

const GLOBAL_REPORT_URL = "/global/report";

// ------------------ EXPENSE REPORTS ------------------

// Expense Daily
export const fetchExpenseDailyReport = async () => {
  try {
    const res = await api.get(`${GLOBAL_REPORT_URL}/expense/fetch-daily`);
    return res.data;
  } catch (err) {
    console.error('Error fetching daily expense report:', err);
    return null;
  }
};

// Expense Monthly
export const fetchExpenseMonthlyReport = async (month) => {
  try {
    const res = await api.get(`${GLOBAL_REPORT_URL}/expense/fetch-monthly`, {
      params: { month }, // month = "2025-07"
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching monthly expense report:', err);
    return null;
  }
};

// Expense by date range
export const fetchExpenseByDateRange = async (date1, date2) => {
  try {
    const res = await api.get(`${GLOBAL_REPORT_URL}/expense/fetch-by-date`, {
      params: { date1, date2 },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching expense report by date:', err);
    return null;
  }
};

// ------------------ INCOME REPORTS ------------------

// Income Daily
export const fetchIncomeDailyReport = async () => {
  try {
    const res = await api.get(`${GLOBAL_REPORT_URL}/income/fetch-daily`);
    return res.data;
  } catch (err) {
    console.error('Error fetching daily income report:', err);
    return null;
  }
};

// Income Monthly
export const fetchIncomeMonthlyReport = async (month) => {
  try {
    const res = await api.get(`${GLOBAL_REPORT_URL}/income/fetch-monthly`, {
      params: { month },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching monthly income report:', err);
    return null;
  }
};

// Income by date range
export const fetchIncomeByDateRange = async (date1, date2) => {
  try {
    const res = await api.get(`${GLOBAL_REPORT_URL}/income/fetch-by-date`, {
      params: { date1, date2 },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching income report by date:', err);
    return null;
  }
};
