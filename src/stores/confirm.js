// src/stores/confirmStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfirmStore = defineStore('confirm', () => {
  const show = ref(false)
  const message = ref('')
  const callback = ref(null)

  const open = (msg, cb) => {
    message.value = msg
    callback.value = cb
    show.value = true
  }

  const close = () => {
    show.value = false
    message.value = ''
    callback.value = null
  }

  const yes = () => {
    if (callback.value) callback.value()
    close()
  }

  const no = () => close()

  return { show, message, open, close, yes, no }
})
