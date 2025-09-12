import axios from "axios";
import router from "@/router";

let loadingStore = null;
export function setLoadingStore(store) {
  loadingStore = store;
}

// Base URLs from VITE
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GUARD_BASE_URL = import.meta.env.VITE_API_GUARD_BASE_URL;

export const AUTH_URL = `${GUARD_BASE_URL}${import.meta.env.VITE_AUTH_CONTEXT_PATH}`;
export const EXPENSE_URL = `${BASE_URL}${import.meta.env.VITE_EXPENSE_CONTEXT_PATH}`;

// ================== Axios Instances ==================
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
});

const guardApi = axios.create({
  baseURL: GUARD_BASE_URL,
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
});

// ================== Interceptors ==================
// Shared request interceptor
const attachInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      loadingStore?.show();

      const token = localStorage.getItem("token");

      // Attach token for non-auth requests
      if (
        token &&
        !config.url.includes("/login") &&
        !config.url.includes("/register") &&
        !config.url.includes("/change-password") &&
        !config.url.includes("/experimental")
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

  instance.interceptors.response.use(
    (response) => {
      loadingStore?.hide();
      return response;
    },
    (error) => {
      loadingStore?.hide();
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        router.push("/login");
      }
      return Promise.reject(error);
    }
  );
};

// Attach to both api & guardApi
attachInterceptors(api);
attachInterceptors(guardApi);

// ================== Auth APIs ==================
export async function loginUser(credentials) {
  try {
    const res = await guardApi.post(`${import.meta.env.VITE_AUTH_CONTEXT_PATH}/login`, credentials);

    if (res.data.status !== "success") {
      return Promise.reject(new Error(res.data.message || "Login failed"));
    } else if (res.data.detail === "Invalid Credential!") {
      alert("INVALID CREDENTIAL!");
      return Promise.reject(new Error("Invalid credentials"));
    } else {
      const { token, username } = res.data.data;

      // Store token locally
      localStorage.setItem("token", token);
      localStorage.setItem("username", username || credentials.username);

      // 🔹 Wake up second microservice
      try {
        const token = localStorage.getItem("token");
        await api.get("https://expenditure-diary-server.onrender.com/expenditure-diary/income/fetch-daily?page=0", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Expenditure diary server wake-up request sent.");
      } catch (err) {
        console.warn("Failed to wake up expenditure diary server:", err);
      }
    }

    return res.data.data;
  } catch (err) {
    console.error("Login error:", err);
    return Promise.reject(err);
  }
}

export async function experimental(payload) {
  const res = await guardApi.post(`${import.meta.env.VITE_AUTH_CONTEXT_PATH}/experimental`, payload);
  if (res.data.status !== "success") throw new Error(res.data.message || "Registration failed");
  return res
}

export async function registerUser(payload) {
  const res = await guardApi.post(`${import.meta.env.VITE_AUTH_CONTEXT_PATH}/register`, payload);
  if (res.data.status !== "success") throw new Error(res.data.message || "Registration failed");
  return res.data.data;
}

export async function changePassword(payload) {
  const res = await guardApi.post(`${import.meta.env.VITE_AUTH_CONTEXT_PATH}/change-password`, payload);
  return res.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  router.push("/login");
}

// ================== Expense APIs ==================
export async function fetchExpenses({ category = "", item = "", currency = "", page = 0, size = 10 }) {
  try {
    const res = await api.post(`${EXPENSE_URL}/filter`, { category, item, currency, page, size });
    return res.data;
  } catch (err) {
    console.error("Error fetching expenses:", err);
    throw err;
  }
}

export async function createExpense(payload) {
  try {
    const res = await api.post("/expense_tracking/create", payload)
    return res.data
  } catch (err) {
    console.error("Error creating expense:", err)
    throw err
  }
}

export async function deleteExpense(id) {
  const res = await api.post("/expense_tracking/delete", { id })
  return res.data
}

export const updateExpense = async (id, data) => {
  const res = await api.patch(`/expense_tracking/update/${id}`, data)
  return res.data
}

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


// ================== Setting APIs ==================
/**
 * Fetch all settings
 * GET /expense_tracking/setting/list
 * @returns {Promise<Object>} data.object_map
 */
export async function fetchSettings() {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("/expense_tracking/setting/list", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.data?.status === "success") {
      return res.data.data.object_map || {};
    } else {
      console.warn("API returned error:", res.data?.message);
      return {};
    }
  } catch (err) {
    console.error("Failed to fetch settings:", err);
    throw err;
  }
}

export default api;
