// services/auth.js
import api, { AUTH_URL } from "@/services/api.js"
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

// ✅ Logout function
export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("username")
  router.push("/login")
}
