// src/services/budgetApi.js
import api from "@/services/api"; // Use the axios instance with interceptors

const BUDGET_URL = "/saving_plan"; // relative to BASE_URL already in api

// ---------------- CREATE PLAN ----------------
export const createBudgetPlan = async (payload) => {
  try {
    const res = await api.post(`${BUDGET_URL}/create_plan`, payload);
    return res.data;
  } catch (err) {
    console.error("Error creating budget plan:", err);
    throw err;
  }
};

// ---------------- FETCH ALL PLANS ----------------
export const fetchAllBudgetPlans = async (page = 0, size = 10) => {
  try {
    const res = await api.get(`${BUDGET_URL}/view_plans`, {
      params: { page, size },
    });
    return res.data.data; // { content, total_pages, etc. }
  } catch (err) {
    console.error("Error fetching all budget plans:", err);
    throw err;
  }
};

// ---------------- DEPOSIT ----------------
export const depositToPlan = async (plan_id, amount, currency) => {
  try {
    const res = await api.post(`${BUDGET_URL}/deposit`, {
      plan_id,
      amount,
      currency,
    });
    return res.data;
  } catch (err) {
    console.error("Error depositing to budget plan:", err);
    throw err;
  }
};

// ---------------- DELETE PLAN ----------------
export const deleteBudgetPlan = async (id) => {
  try {
    const res = await api.post(`${BUDGET_URL}/delete_plan`, { id });
    return res.data;
  } catch (err) {
    console.error("Error deleting budget plan:", err);
    throw err;
  }
};

// ---------------- DEPOSIT HISTORY ----------------
export const fetchDepositHistory = async (planId) => {
  if (!planId) return [];
  try {
    const res = await api.get(`${BUDGET_URL}/check_history`, {
      params: { planId },
    });
    return res.data?.data?.content || [];
  } catch (err) {
    console.error("Error fetching deposit history:", err);
    return [];
  }
};
