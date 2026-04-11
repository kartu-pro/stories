<template>
  <div v-if="story" class="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center">
    <div class="w-full max-w-2xl">
      <button @click="router.push('/')" class="mb-8 flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back to Library
      </button>

      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border dark:border-slate-800 p-8 md:p-12">
        <header class="mb-10">
          <h1 class="text-4xl font-black text-slate-900 dark:text-white mb-2">{{ story.title }}</h1>
          <p class="text-slate-500 text-lg">Configure your practice session for this story.</p>
        </header>

        <div class="space-y-10">
          <section>
            <label class="block text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Available Tenses</label>
            <div class="grid grid-cols-2 gap-3">
              <button 
                v-for="tense in availableTenses" :key="tense"
                @click="tempTense = tense"
                :class="tempTense === tense ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'"
                class="py-4 px-6 rounded-2xl font-bold capitalize transition-all"
              >
                {{ tense }}
              </button>
            </div>
          </section>

          <section>
            <label class="block text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Difficulty Level</label>
            <div class="space-y-3">
              <button 
                v-for="(data, key) in DIFFICULTY_METADATA" :key="key"
                @click="tempDifficulty = key"
                :class="tempDifficulty === key ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-800'"
                class="w-full flex items-center justify-between p-5 border-2 rounded-2xl transition-all group"
              >
                <div class="text-left">
                  <div class="font-black text-slate-800 dark:text-slate-100">{{ data.label }}</div>
                  <div class="text-sm text-slate-500">{{ data.description }}</div>
                </div>
                <div v-if="tempDifficulty === key" class="text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
          </section>
        </div>

        <button 
          @click="handleStart"
          :disabled="!tempTense"
          class="w-full mt-12 py-5 bg-indigo-600 text-white rounded-3xl font-black text-2xl shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
        >
          Start Practice
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStoryStore } from '@/stores/useStoryStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { useConfigStore } from '@/stores/useConfigStore';
import { DIFFICULTY_METADATA } from '@/constants';
import type { Tense, Difficulty } from '@/types';

const route = useRoute();
const router = useRouter();
const storyStore = useStoryStore();
const session = useSessionStore();
const config = useConfigStore();

const story = computed(() => storyStore.currentStory);
const tempTense = ref<Tense | null>(null);
const tempDifficulty = ref<Difficulty>(config.preferredDifficulty);

const availableTenses = computed(() => {
  if (!story.value?.sentences.length) return [];
  return Object.keys(story.value.sentences[0].tenses) as Tense[];
});

onMounted(async () => {
  await storyStore.selectStory(route.params.id as string);
  // Default to preferred tense if available in this story
  if (availableTenses.value.includes(config.preferredTense)) {
    tempTense.value = config.preferredTense;
  } else {
    tempTense.value = availableTenses.value[0];
  }
});

const handleStart = () => {
  if (!tempTense.value) return;
  
  // Save preferences to config
  config.updateSetting('preferredTense', tempTense.value);
  config.updateSetting('preferredDifficulty', tempDifficulty.value);

  // Initialize and Navigate
  session.startSession(tempTense.value, tempDifficulty.value);
  router.push('/story');
};
</script>
