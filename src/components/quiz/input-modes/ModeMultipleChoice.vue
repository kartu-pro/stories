<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
    <button 
      v-for="(choice, idx) in session.mcOptions" :key="idx"
      @click="session.userInput = choice; session.submitCurrentAnswer()"
      class="p-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl text-xl font-bold hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all text-left flex items-center"
    >
      <span class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm mr-4 text-slate-400">{{ idx + 1 }}</span>
      {{ choice }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { useSessionStore } from '@/stores/useSessionStore';
const session = useSessionStore();
</script>
