import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient' // Assuming supabase client is set up elsewhere

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
  }),
  actions: {
    async fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      this.user = user
      this.loading = false
    },
    async signIn() {
      // Placeholder for actual sign-in logic
      console.log('Sign in logic needs to be implemented')
    },
    async signOut() {
      await supabase.auth.signOut()
      this.user = null
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
})
