<template>
  <div class="w-full max-w-2xl mx-auto min-h-[180px] flex items-center justify-center px-4">
    
    <FeedbackDisplay 
      v-if="session.isSubmitted"
      :user-input="session.userInput"
      :expected="session.currentSentenceData?.verb || ''"
    />

    <div v-else class="w-full">
      <ModeTextInput v-if="session.difficulty === DIFFICULTIES.HARD" />
      <ModeUnscramble v-else-if="session.difficulty === DIFFICULTIES.MEDIUM" />
      <ModeMultipleChoice v-else />
    </div>

  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/useSessionStore';
import { DIFFICULTIES } from '@/constants';
import FeedbackDisplay from './FeedbackDisplay.vue';
import ModeTextInput from './input-modes/ModeTextInput.vue';
import ModeUnscramble from './input-modes/ModeUnscramble.vue';
import ModeMultipleChoice from './input-modes/ModeMultipleChoice.vue';

const session = useSessionStore();
</script>
