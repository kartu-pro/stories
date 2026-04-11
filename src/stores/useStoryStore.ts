import { defineStore } from 'pinia';
import dummyData from '@/assets/dummy-data.json';
import { TENSES, DIFFICULTIES } from '@/constants';
import type { Story, Tense, Difficulty } from '@/types';

export const useStoryStore = defineStore('story', {
  state: () => ({
    // All stories available in the library
    stories: [] as Story[],

    // The story currently being played or viewed
    currentStory: null as Story | null,
  }),

  actions: {
    /**
     * Simulates fetching story metadata and content.
     * In production, this will call useApi.ts to hit Supabase.
     */
    loadStories() {
      // Cast dummyData to Story[] to ensure it matches our interface
      this.stories = dummyData as Story[];
    },

    /**
     * Sets the active story based on a UUID.
     * Resets currentStory to null if not found.
     */
    selectStory(id: string) {
      const story = this.stories.find(s => s.id === id);
      this.currentStory = story || null;
    },
  }
});
