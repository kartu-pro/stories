import { defineStore } from 'pinia';
import { supabase } from '@/supabase'; // Assume you've initialized this
import type { UserTier } from '@/types';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    tier: 'anonymous' as UserTier,
    loading: true
  }),
  actions: {
    async fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      this.user = user;
      
      if (user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('tier')
          .eq('id', user.id)
          .single();
        this.tier = data?.tier || 'free';
      }
      this.loading = false;
    },
    canAccess(requiredTier: UserTier): boolean {
      if (this.tier === 'premium') return true;
      if (this.tier === 'free' && requiredTier !== 'premium') return true;
      return requiredTier === 'anonymous';
    }
  }
});
