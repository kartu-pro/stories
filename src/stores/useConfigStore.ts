import { defineStore } from 'pinia';
import { TENSES, DIFFICULTIES } from '@/constants';
import type { Tense, Difficulty } from '@/types';

export const useConfigStore = defineStore('config', {
  state: () => ({
    // Linguistic Defaults
    preferredTense: TENSES.PRESENT as Tense,
    preferredDifficulty: DIFFICULTIES.MEDIUM as Difficulty,

    // Performance & UI Settings
    loadImages: true,
    loadAudio: true,
    isDarkMode: false,
  }),

  actions: {
    /**
     * Call this in App.vue when the app first loads.
     */
    init() {
      const saved = localStorage.getItem('ka_verb_config');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Apply saved values to state
          this.$patch(parsed);
          this.applyTheme();
        } catch (e) {
          console.error("Failed to load config", e);
        }
      }
    },

    /**
     * Updates a value and syncs to localStorage.
     */
    updateSetting<K extends keyof typeof this.$state>(key: K, value: typeof this.$state[K]) {
      this.$state[key] = value;
      localStorage.setItem('ka_verb_config', JSON.stringify(this.$state));

      if (key === 'isDarkMode') this.applyTheme();
    },

    applyTheme() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
});
