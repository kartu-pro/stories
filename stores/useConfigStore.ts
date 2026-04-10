import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    darkMode: false,
    dataSaver: false,
  }),
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
    },
    toggleDataSaver() {
      this.dataSaver = !this.dataSaver
    },
  },
})
