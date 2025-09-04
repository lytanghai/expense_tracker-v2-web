// src/services/incomeApi.js
import api from "@/services/api"; // shared axios instance with interceptors

const INCOME_URL = "/income"; // relative path, api already has BASE_URL

// ---------------- CREATE INCOME ----------------
export const createIncome = async (income) => {
  try {
    const res = await api.post(`${INCOME_URL}/create`, income);
    return res.data;
  } catch (err) {
    console.error("Error creating income:", err);
    throw err;
  }
};

// ---------------- FETCH INCOMES ----------------
export const fetchIncomes = async ({ page = 0, size = 10, category = '', pnl_type = '', currency = '' }) => {
  try {
    const body = { page, size, category, pnl_type, currency };
    const res = await api.post(`${INCOME_URL}/filter`, body);
    return res.data;
  } catch (err) {
    console.error("Error fetching incomes:", err);
    throw err;
  }
};

// ---------------- UPDATE INCOME ----------------
export const updateIncome = async (id, income) => {
  try {
    const res = await api.patch(`${INCOME_URL}/update/${id}`, income);
    return res.data;
  } catch (err) {
    console.error("Error updating income:", err);
    throw err;
  }
};

// ---------------- DELETE INCOME ----------------
export const deleteIncomeApi = async (id) => {
  try {
    const res = await api.post(`${INCOME_URL}/delete`, { id });
    return res.data;
  } catch (err) {
    console.error("Error deleting income:", err);
    throw err;
  }
};

// Filter incomes
export async function filterIncomes({ category = '', pnl_type = '', currency = '', page = 0, size = 10 }) {
  try {
    const res = await api.post(`${INCOME_URL}/filter`, { category, pnl_type, currency, page, size })
    return res.data
  } catch (err) {
    console.error('Error filtering incomes:', err)
    throw err
  }
}