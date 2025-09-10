<template>
    <div class="flex h-screen">
        <!-- Left: video -->
        <div class="w-1/2 hidden md:flex items-center justify-center bg-black">
            <video autoplay loop muted class="h-full w-full object-cover"></video>
        </div>

        <!-- Right: login / signup form -->
        <div class="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8">
            <h2 class="text-2xl font-bold mb-6">{{ isRegister ? 'Sign Up' : 'Login' }}</h2>

            <form @submit.prevent="isRegister ? handleRegister() : handleLogin()" class="w-full max-w-sm">
                <!-- Username -->
                <div class="mb-4">
                    <label>Username</label>
                    <input v-model="form.username" type="text" class="w-full border p-2 rounded" required />
                </div>

                <!-- Email (only for register) -->
                <div v-if="isRegister" class="mb-4">
                    <label>Email</label>
                    <input v-model="form.email" type="email" class="w-full border p-2 rounded" required />
                </div>

                <!-- Password -->
                <div class="mb-4">
                    <label>Password</label>
                    <input v-model="form.password" type="password" class="w-full border p-2 rounded" required />
                </div>

                <!-- Submit button -->
                <button type="submit" class="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600">
                    {{ isRegister ? 'Sign Up' : 'Login' }}
                </button>

                <!-- Switch between login / register -->
                <p class="mt-4 text-center">
                    <span v-if="isRegister">Already have an account? </span>
                    <span v-else>Don’t have an account? </span>
                    <a href="#" @click.prevent="toggleForm" class="text-teal-600">
                        {{ isRegister ? 'Login' : 'Register' }}
                    </a>
                </p>

                <!-- Hidden Wakeup Button -->
                <button type="button" @click="wakeUpServers" style="display: none;"  ref="wakeButton"></button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, registerUser } from '@/services/auth.js'
import axios from 'axios'

const router = useRouter()

const isRegister = ref(false)
const form = reactive({ username: '', email: '', password: '' })

const toggleForm = () => {
    isRegister.value = !isRegister.value
    form.username = ''
    form.email = ''
    form.password = ''
}

const handleLogin = () => {
  loginUser({ username: form.username, password: form.password })
    .then(data => {
      if (!data.token) {
        alert("No token received from server")
        return
      }
      router.push("/") // redirect only after success
    })
    .catch(err => {
      alert("Invalid username or password")
    })
}

const handleRegister = async () => {
    try {
        const data = await registerUser({ username: form.username, email: form.email, password: form.password })
        alert('Registration successful! Please login.')
        toggleForm() // switch back to login
    } catch (err) {
        console.error(err)
        alert(err.message || 'Registration failed')
    }
}

// ✅ Wake up both servers
const wakeUpServers = async () => {
    try {
        const guard = axios.get('https://your-guard-server.onrender.com/wakeup')
        const expenditure = axios.get('https://your-expenditure-server.onrender.com/wakeup')
        await Promise.all([guard, expenditure])
        console.log('Both servers are awake!')
    } catch (err) {
        console.error('Failed to wake servers', err)
    }
}

// Optional: call automatically on page load
onMounted(() => {
    // Uncomment if you want to wake servers automatically
    wakeUpServers()
})
</script>
