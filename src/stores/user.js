import { defineStore } from "pinia";

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: 'axelskam.098@gmail.com'
  })
})