<template>
  <div class="feedback-container flex flex-col items-center justify-center min-h-[120px] animate-in fade-in zoom-in-95 duration-500">
    
    <div v-if="isCorrect" class="text-center">
      <span class="text-xs font-black uppercase tracking-widest text-emerald-500 mb-2 block">Correct</span>
      <span class="text-5xl font-black text-emerald-500 tracking-tight">{{ expected }}</span>
    </div>

    <div v-else-if="isCloseEnough" class="text-center space-y-3">
      <span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Almost there:</span>
      <div class="flex flex-wrap justify-center gap-1 font-bold text-4xl md:text-5xl">
        <template v-for="(item, index) in diffResults" :key="index">
          <span :class="getTypeClasses(item.type)">{{ item.char }}</span>
        </template>
      </div>
    </div>

    <div v-else class="text-center">
      <div class="flex flex-col items-center gap-2">
        <span class="text-2xl md:text-3xl line-through text-red-400 opacity-60 decoration-2 italic">
          {{ userInput || '___' }}
        </span>
        <div class="h-1 w-8 bg-slate-200 rounded-full my-1"></div>
        <span class="text-4xl md:text-5xl font-black text-emerald-500">{{ expected }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getLcsDiff } from '@/utils/diff';
import { FEEDBACK_TYPES } from '@/constants';

const props = defineProps<{
  userInput: string;
  expected: string;
}>();

const isCorrect = computed(() => props.userInput.trim() === props.expected.trim());

const editDistance = computed(() => getEditDistance(props.userInput.trim(), props.expected.trim()));

const isCloseEnough = computed(() => editDistance.value > 0 && editDistance.value <= 3);

const diffResults = computed(() => getLcsDiff(props.userInput, props.expected));

const getTypeClasses = (type: string) => {
  switch (type) {
    case FEEDBACK_TYPES.MATCH: return 'text-emerald-500';
    case FEEDBACK_TYPES.DELETION: return 'text-red-500 bg-red-50 dark:bg-red-900/20 px-0.5 rounded animate-shake';
    case FEEDBACK_TYPES.INSERTION: return 'text-amber-500 border-b-4 border-amber-400 animate-pulse';
    default: return 'text-slate-300';
  }
};

/**
 * Standard Levenshtein Distance for the "Close Enough" gate.
 */
function getEditDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = a[i - 1] === b[j - 1] 
        ? matrix[i - 1][j - 1] 
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[a.length][b.length];
}
</script>
