import { defineStore } from 'pinia';
import { supabase } from '@/supabase';
import { USER_TIERS } from '@/constants';
import type { UserTier } from '@/types';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // The raw Supabase user object
    user: null as any,

    // Default to anonymous until proven otherwise
    tier: USER_TIERS.ANONYMOUS as UserTier,

    loading: true
  }),

  actions: {
    /**
     * Fetches the user session and their associated tier from the 
     * 'user_profiles' table.
     */
    async fetchProfile() {
      this.loading = true;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        this.user = user;

        if (user) {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('tier')
            .eq('id', user.id)
            .single();

          if (!error && data) {
            this.tier = data.tier as UserTier;
          } else {
            // If user exists but profile fetch fails, default to free
            this.tier = USER_TIERS.FREE;
          }
        } else {
          this.tier = USER_TIERS.ANONYMOUS;
        }
      } catch (err) {
        console.error('Auth error:', err);
        this.tier = USER_TIERS.ANONYMOUS;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Logic to determine if a user can view a specific story.
     * Premium users bypass all checks. 
     * Free users can access Anonymous and Free content.
     */
    canAccess(requiredTier: UserTier): boolean {
      if (this.tier === USER_TIERS.PREMIUM) return true;

      if (this.tier === USER_TIERS.FREE) {
        return requiredTier !== USER_TIERS.PREMIUM;
      }

      return requiredTier === USER_TIERS.ANONYMOUS;
    }
  }
});
