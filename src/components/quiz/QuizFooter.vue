<template>
  <footer class="w-full max-w-4xl mx-auto p-6 flex items-center justify-between gap-4">
    
    <button 
      @click="session.previousSentence"
      :disabled="session.currentSentenceIndex === 0"
      class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 disabled:opacity-30 transition-all hover:bg-slate-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button 
      @click="handleMainAction"
      class="flex-grow max-w-md py-5 rounded-3xl bg-slate-900 dark:bg-indigo-600 text-white font-black text-xl shadow-xl active:scale-95 transition-all"
    >
      {{ session.isSubmitted ? 'Continue' : 'Check' }}
    </button>

    <button 
      @click="session.nextSentence"
      :disabled="isAtEnd"
      class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 disabled:opacity-30 transition-all hover:bg-slate-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
      </svg>
    </button>

  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSessionStore } from '@/stores/useSessionStore';

const session = useSessionStore();

const isAtEnd = computed(() => {
  return session.currentSentenceIndex === (session.currentStory?.sentences.length || 1) - 1;
});

const handleMainAction = () => {
  if (session.isSubmitted) {
    session.nextSentence();
  } else {
    // This triggers the store logic we built in Step 4/11
    session.submitCurrentAnswer(); 
  }
};
</script>
