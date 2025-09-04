import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const openMenu = ref([])
  const openSubMenu = ref({})

  function toggleMenu(menu) {
    openMenu.value = openMenu.value.includes(menu) ? [] : [menu]
  }

  function toggleSubMenu(menu, sub) {
    if (!openSubMenu.value[menu]) openSubMenu.value[menu] = {}
    openSubMenu.value[menu][sub] = !openSubMenu.value[menu][sub]
  }

  return { openMenu, openSubMenu, toggleMenu, toggleSubMenu }
})
