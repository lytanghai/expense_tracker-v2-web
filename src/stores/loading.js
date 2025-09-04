import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const loading = ref(false)
  const progress = ref(0)
  let intervalId = null

  function show() {
    loading.value = true
    progress.value = 0
    if (intervalId) clearInterval(intervalId)

    intervalId = setInterval(() => {
      if (progress.value < 99) progress.value += 1
    }, 10) // 1% every 10ms => 99% in ~1s
  }

  function hide() {
    if (intervalId) clearInterval(intervalId)
    progress.value = 100
    setTimeout(() => {
      loading.value = false
      progress.value = 0
    }, 200)
  }

  return { loading, progress, show, hide }
})
