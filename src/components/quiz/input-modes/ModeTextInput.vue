<template>
  <div class="max-w-md mx-auto w-full">
    <input 
      v-model="session.userInput"
      @focus="session.isTyping = true"
      @blur="session.isTyping = false"
      placeholder="Type the verb..."
      class="w-full bg-slate-50 dark:bg-slate-800 p-6 text-2xl text-center font-bold rounded-3xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all"
      autofocus
    />
  </div>
</template>
<script setup lang="ts">
import { useSessionStore } from '@/stores/useSessionStore';
const session = useSessionStore();
</script>
