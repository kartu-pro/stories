import { defineStore } from 'pinia'
import dummyData from '@/assets/dummy-data.json'
import type { Story } from '@/types'

export const useStoryStore = defineStore('story', {
  state: () => ({
    stories: [] as Story[],
    currentStory: null as Story | null,
    settings: {
      tense: 'present',
      difficulty: 'medium',
      loadImages: true,
      loadAudio: true,
    }
  }),
  actions: {
    loadStories() {
      // Simulate API call
      this.stories = dummyData as Story[]
    },
    selectStory(id: string) {
      const story = this.stories.find(s => s.id === id)
      if (story) this.currentStory = story
    },
    updateSettings(newSettings: Partial<typeof this.settings>) {
      this.settings = { ...this.settings, ...newSettings }
    }
  }
})
