<template>
  <header class="w-full flex items-center justify-between p-4 md:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
    <button @click="handleExit" class="p-2 text-slate-400 hover:text-red-500 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div class="flex-grow max-w-xs mx-4">
      <div class="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
        <span>Progress</span>
        <span>{{ session.currentSentenceIndex + 1 }} / {{ totalSentences }}</span>
      </div>
      <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          class="h-full bg-indigo-600 transition-all duration-500 ease-out"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="text-right hidden sm:block">
        <div class="text-[10px] font-black uppercase text-slate-400">Accuracy</div>
        <div class="text-xl font-black text-indigo-600 leading-none">{{ session.totalAccuracy }}%</div>
      </div>
      <button @click="$emit('open-settings')" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSessionStore } from '@/stores/useSessionStore';
import { useRouter } from 'vue-router';

const session = useSessionStore();
const router = useRouter();

const totalSentences = computed(() => session.currentStory?.sentences.length || 0);
const progressPercent = computed(() => ((session.currentSentenceIndex + 1) / totalSentences.value) * 100);

const handleExit = () => {
  if (confirm("Quit this session? Progress won't be saved.")) {
    router.push('/library');
  }
};
</script>
