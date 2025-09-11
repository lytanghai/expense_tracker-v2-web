// services/auth.js
import api, { AUTH_URL, EXPENSE_URL } from "@/services/api.js"
import router from "@/router"

// ✅ Login function
export async function loginUser(credentials) {
  try {
    const response = await api.post(`${AUTH_URL}/login`, credentials)
    const result = response.data

    if (result.status !== "success") {
      throw new Error(result.message || "Invalid login")
    }

    // Save token and username locally
    const { token, username } = result.data
    localStorage.setItem("token", token)
    localStorage.setItem("username", username || credentials.username)

    return result.data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

// ✅ Register function
export async function registerUser(payload) {
  try {
    const response = await api.post(`${AUTH_URL}/register`, payload)
    const result = response.data

    if (result.status !== "success") {
      throw new Error(result.message || "Registration failed")
    }

    return result.data
  } catch (error) {
    console.error("Register error:", error)
    throw error
  }
}

export async function experimental(payload) {
  try {
    const response = await api.post(`${AUTH_URL}/experimental`, payload)
    const result = response.data

    if (result.status !== "success") {
      throw new Error(result.message || "Registration failed")
    }

    return result.data
  } catch (error) {
    console.error("Register error:", error)
    throw error
  }
}

// ✅ Logout function
export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("username")
  router.push("/login")
}

// ✅ New: Wake-up both Render servers
import axios from "axios"

export const wakeUpServers = async () => {
  try {
    console.log("Calling Guard server:", `${AUTH_URL}/wakeup`)
    console.log("Calling Expenditure server:", `${EXPENSE_URL}/public/wakeup`)

    await Promise.all([
      axios.get(`https://expense-tracker-v2-etap.onrender.com/guard/public/auth/wakeup`),
      axios.get(`https://expenditure-diary-server.onrender.com/expenditure-diary/expense_tracking/public/wakeup`)
    ])

    console.log("Both servers are awake!")
    return { guard: true, expenditure: true }
  } catch (error) {
    console.error("Failed to wake servers", error)
    throw error
  }
}
