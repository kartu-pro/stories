<template>
  <div class="flex flex-col items-center space-y-6 py-4">
    <h2 class="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-relaxed text-center">
      <span>{{ prefix }}</span>
      
      <span class="inline-block border-b-4 border-slate-300 mx-2 min-w-[100px]">
        <span v-if="session.isSubmitted" :class="isCorrect ? 'text-emerald-500' : 'text-red-500'">
          {{ session.userInput || '____' }}
        </span>
        <span v-else class="text-indigo-600 opacity-50">___</span>
      </span>

      <span>{{ suffix }}</span>

      <button 
        v-if="config.loadAudio && session.currentSentenceData?.audio_url"
        @click="playAudio"
        class="ml-4 p-2 rounded-full bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      </button>
    </h2>

    <div class="flex flex-col items-center">
      <button 
        @click="showTranslation = !showTranslation"
        class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500"
      >
        {{ showTranslation ? 'Hide English' : 'Show English' }}
      </button>
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0">
        <p v-if="showTranslation" class="mt-2 text-lg text-slate-500 italic">
          "{{ session.currentSentenceData?.english }}"
        </p>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSessionStore } from '@/stores/useSessionStore';
import { useConfigStore } from '@/stores/useConfigStore';

const session = useSessionStore();
const config = useConfigStore();
const showTranslation = ref(false);

const isCorrect = computed(() => session.userInput.trim() === session.currentSentenceData?.verb);

const parts = computed(() => (session.currentSentenceData?.georgian || '').split('___'));
const prefix = computed(() => parts.value[0] || '');
const suffix = computed(() => parts.value[1] || '');

const playAudio = () => {
  if (session.currentSentenceData?.audio_url) {
    new Audio(session.currentSentenceData.audio_url).play();
  }
};
</script>
