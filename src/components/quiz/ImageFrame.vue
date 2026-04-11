<template>
  <div 
    v-if="config.loadImages && !isMobileTyping"
    class="w-full max-w-3xl mx-auto px-4 animate-in fade-in slide-in-from-top-4 duration-500"
  >
    <div class="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-200">
      <img 
        :src="session.currentSentence?.image_uuid" 
        class="w-full h-full object-cover transition-opacity duration-700"
        loading="lazy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/useSessionStore';
import { useConfigStore } from '@/stores/useConfigStore';

defineProps<{ isMobileTyping: boolean }>();

const session = useSessionStore();
const config = useConfigStore();
</script>
