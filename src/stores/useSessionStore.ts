import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useStoryStore } from './useStoryStore';
import { TENSES, DIFFICULTIES } from '@/constants';
import type { Tense, Difficulty } from '@/types';

export const useSessionStore = defineStore('session', () => {
  const storyStore = useStoryStore();

  // --- State ---
  const currentSentenceIndex = ref(0);
  const selectedTense = ref<Tense>(TENSES.PRESENT);
  const difficulty = ref<Difficulty>(DIFFICULTIES.MEDIUM);
  const sessionActive = ref(false);
  const firstTryResults = ref<Record<number, boolean>>({});
  
  const userInput = ref('');
  const isSubmitted = ref(false);
  const isTyping = ref(false); 
  const mcOptions = ref<string[]>([]);

  // --- Getters ---
  const currentStory = computed(() => storyStore.currentStory);
  const currentSentence = computed(() => currentStory.value?.sentences[currentSentenceIndex.value] || null);
  const currentSentenceData = computed(() => currentSentence.value?.tenses[selectedTense.value] || null);

  const totalAccuracy = computed(() => {
    const attempts = Object.values(firstTryResults.value);
    if (attempts.length === 0) return 0;
    const correct = attempts.filter(v => v === true).length;
    return Math.round((correct / attempts.length) * 100);
  });

  // --- Actions ---
  function startSession(tense: Tense, diff: Difficulty) {
    selectedTense.value = tense;
    difficulty.value = diff;
    currentSentenceIndex.value = 0;
    firstTryResults.value = {};
    sessionActive.value = true;
    resetStepState();
  }

  function submitCurrentAnswer() {
    if (isSubmitted.value || !currentSentenceData.value) return;
    isSubmitted.value = true;
    const target = currentSentenceData.value.verb;
    recordAttempt(userInput.value.trim() === target);
  }

  function recordAttempt(isCorrect: boolean) {
    if (firstTryResults.value[currentSentenceIndex.value] === undefined) {
      firstTryResults.value[currentSentenceIndex.value] = isCorrect;
    }
  }

  function resetStepState() {
    userInput.value = '';
    isSubmitted.value = false;
    isTyping.value = false;
    
    // Logic for Easy Mode distractors
    if (difficulty.value === DIFFICULTIES.EASY && currentSentenceData.value) {
      const target = currentSentenceData.value.verb;
      const distractors = currentSentenceData.value.distractors || [];
      mcOptions.value = [target, ...distractors].sort(() => Math.random() - 0.5);
    }
  }

  function nextSentence() {
    if (currentSentenceIndex.value < (currentStory.value?.sentences.length || 0) - 1) {
      currentSentenceIndex.value++;
      resetStepState();
    }
  }

  function previousSentence() {
    if (currentSentenceIndex.value > 0) {
      currentSentenceIndex.value--;
      resetStepState();
    }
  }

  return {
    currentSentenceIndex, selectedTense, difficulty, sessionActive,
    currentStory, currentSentence, currentSentenceData, totalAccuracy,
    userInput, isSubmitted, isTyping, mcOptions,
    startSession, submitCurrentAnswer, nextSentence, previousSentence
  };
});
