<template>
  <div class="flex h-screen">

    <!-- Left side with floating coins -->
    <div
      class="w-1/2 hidden md:flex items-center justify-center relative overflow-hidden 
             bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-400"
    >
      <img
        v-for="coin in coins"
        :key="coin.id"
        :src="`/img/block${coin.img}.png`"
        class="absolute w-12 h-12 floating-coin"
        :style="{
          left: coin.left + '%',
          bottom: coin.bottom + 'px',
          animationDuration: coin.duration + 's',
          animationDelay: coin.delay + 's'
        }"
      />
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
        <button type="submit" class="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 disabled:opacity-50">
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
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, registerUser } from '@/services/auth.js'

const router = useRouter()

// Generate random coins
function randomCoins(count = 10) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 90,        // horizontal position %
    bottom: Math.random() * 100,     // start height px
    duration: 2 + Math.random() * 3, // speed (seconds)
    delay: Math.random() * 3,        // stagger start
    img: Math.floor(Math.random() * 8) + 1 // 1 → 8
  }))
}

const coins = reactive(randomCoins(12))
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
    .catch(() => {
      alert("Invalid username or password")
    })
}

const handleRegister = async () => {
  try {
    await registerUser({ username: form.username, email: form.email, password: form.password })
    alert('Registration successful! Please login.')
    toggleForm()
  } catch (err) {
    alert(err.message || 'Registration failed')
  }
}
</script>

<style scoped>
@keyframes floatUp {
  0% {
    transform: translateY(100px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateY(-750px);
    opacity: 0;
  }
}

.floating-coin {
  position: absolute;
  animation-name: floatUp;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
</style>
