<template>
  <div class="min-h-[100dvh] bg-white dark:bg-slate-950 flex flex-col overflow-hidden">
    <QuizHeader @open-settings="showSettings = true" />

    <main class="flex-grow flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-6 overflow-y-auto">
      
      <ImageFrame :is-mobile-typing="session.isTyping" />

      <ClozeSentence class="w-full mt-8" />

      <div class="w-full mt-auto py-10 transition-all duration-300">
        <InputOrchestrator />
      </div>
    </main>

    <QuizFooter class="border-t dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur" />

    <SettingsOverlay v-if="showSettings" @close="showSettings = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useSessionStore } from '@/stores/useSessionStore';

// Component Imports
import QuizHeader from '@/components/quiz/QuizHeader.vue';
import ImageFrame from '@/components/quiz/ImageFrame.vue';
import ClozeSentence from '@/components/quiz/ClozeSentence.vue';
import InputOrchestrator from '@/components/quiz/InputOrchestrator.vue';
import QuizFooter from '@/components/quiz/QuizFooter.vue';
import SettingsOverlay from '@/components/SettingsOverlay.vue';

const session = useSessionStore();
const showSettings = ref(false);

/**
 * Global Keyboard Shortcuts
 * - Enter: Submits if typing, moves to next if already submitted.
 */
const handleKeys = (e: KeyboardEvent) => {
  // Prevent double-firing if the user is in the middle of a text input
  if (e.key === 'Enter') {
    if (session.isSubmitted) {
      session.nextSentence();
    } else if (session.userInput.trim().length > 0) {
      session.submitCurrentAnswer();
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeys);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeys);
});
</script>

<style scoped>
/* Ensure the layout feels like a native app on mobile devices */
main {
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
}
main::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome/Safari */
}

/* Optional: Add a slight bounce to the footer navigation on mobile */
footer button:active {
  transform: scale(0.95);
}
</style>
