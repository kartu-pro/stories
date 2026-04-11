<template>
  <div class="flex flex-wrap justify-center gap-1 font-bold text-3xl md:text-5xl tracking-tight">
    <template v-for="(item, index) in diffResults" :key="index">
      
      <span 
        v-if="item.type === FEEDBACK_TYPES.MATCH"
        class="text-emerald-500 transition-colors duration-300"
      >
        {{ item.char }}
      </span>

      <span 
        v-else-if="item.type === FEEDBACK_TYPES.DELETION"
        class="text-red-500 bg-red-50 dark:bg-red-900/20 px-0.5 rounded animate-shake"
      >
        {{ item.char }}
      </span>

      <span 
        v-else-if="item.type === FEEDBACK_TYPES.INSERTION"
        class="text-amber-500 border-b-4 border-amber-400 animate-pulse"
      >
        {{ item.char }}
      </span>

    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getLcsDiff, type DiffResult } from '@/utils/diff';
import { FEEDBACK_TYPES } from '@/constants';

const props = defineProps<{
  userInput: string;
  expected: string;
  showFeedback: boolean;
}>();

/**
 * Calculates the diff only when showFeedback is true.
 * Returns an array of DiffResult objects.
 */
const diffResults = computed<DiffResult[]>(() => {
  if (!props.showFeedback) {
    // Before submission, just show user input as neutral characters
    return props.userInput.split('').map(char => ({
      char,
      type: FEEDBACK_TYPES.MATCH // Use match style or create a 'neutral' type
    }));
  }
  
  return getLcsDiff(props.userInput, props.expected);
});
</script>

<style scoped>
/* Shake animation for incorrect letters */
.animate-shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
