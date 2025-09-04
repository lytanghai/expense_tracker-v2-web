import axios from "axios";
import router from "@/router";

let loadingStore = null;
export function setLoadingStore(store) {
  loadingStore = store;
}

// Base URLs from VITE
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GUARD_BASE_URL = import.meta.env.VITE_API_GUARD_BASE_URL;
export const AUTH_URL = `${BASE_URL}${import.meta.env.VITE_AUTH_CONTEXT_PATH}`;
export const EXPENSE_URL = `${BASE_URL}${import.meta.env.VITE_EXPENSE_CONTEXT_PATH}`;

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" ,  "Accept": "application/json"},
});

// Request interceptor: attach token & show loader
api.interceptors.request.use(
  (config) => {
    loadingStore?.show();

    const token = localStorage.getItem("token");

    // Don't attach token to login/register
    if (
      token &&
      !config.url.startsWith(`${AUTH_URL}/login`) &&
      !config.url.startsWith(`${AUTH_URL}/register`)
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    loadingStore?.hide();
    return Promise.reject(error);
  }
);

// Response interceptor: hide loader
api.interceptors.response.use(
  (response) => {
    loadingStore?.hide();
    return response;
  },
  (error) => {
    loadingStore?.hide();
    // If 401/403, redirect to login
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export async function loginUser(credentials) {
  return api.post("/api/auth/login", credentials)
    .then(res => {
      console.log(res)
      if (res.data.status !== "success") {
        return Promise.reject(new Error(res.data.message || "Login failed"))
      } else if(res.data.detail === 'Invalid Credential!') {
        alert("INVALID CREDENTIAL!")
      }else {
        const { token, username } = res.data.data
        // Store token
        localStorage.setItem("token", token)
        localStorage.setItem("username", username || credentials.username)
      }
      return res.data.data
    })
    .catch(err => {
      console.error("Login error:", err)
      return Promise.reject(err)
    })
}

export async function registerUser(payload) {
  const res = await api.post(`${AUTH_URL}/register`, payload);
  if (res.data.status !== "success") throw new Error(res.data.message || "Registration failed");
  return res.data.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  router.push("/login");
}

// Expense APIs
export async function fetchExpenses({ category = "", item = "", currency = "", page = 0, size = 10 }) {
  try {
    const res = await api.post(`${EXPENSE_URL}/filter`, { category, item, currency, page, size });
    return res.data;
  } catch (err) {
    console.error("Error fetching expenses:", err);
    throw err;
  }
}

// api.js
export async function createExpense(payload) {
  try {
    const res = await api.post("/expense_tracking/create", payload)
    return res.data
  } catch (err) {
    console.error("Error creating expense:", err)
    throw err
  }
}

export async function deleteExpense (id) {
  const res = await api.post('/expense_tracking/delete', { id })
  return res.data
}

export const updateExpense = async (id, data) => {
  const res = await api.patch(`/expense_tracking/update/${id}`, data)
  return res.data
}

// Filter Expenses API
export async function filterExpenses({ category = "", item = "", currency = "", page = 0, size = 10 }) {
  try {
    const res = await api.post(`${EXPENSE_URL}/filter`, {
      category,
      item,
      currency,
      page,
      size
    })
    return res.data
  } catch (err) {
    console.error("Error filtering expenses:", err)
    throw err
  }
}


export default api;
