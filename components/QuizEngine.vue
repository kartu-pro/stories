<template>
  <div class="quiz-engine">
    <div v-if="sessionStore.currentSentenceData" class="sentence-display">
      <p>{{ currentSentenceEnglish }}</p>
      <div v-if="!isSessionActive || !currentSentence" class="loading-or-error">
        <p v-if="isLoading">Loading sentence...</p>
        <p v-else-if="error">Error loading sentence: {{ error.message }}</p>
        <p v-else>Select a story and settings to begin.</p>
      </div>
      <div v-else>
        <!-- Render different input components based on quizMode -->
        <div v-if="quizMode === 'text'">
          <input
            type="text"
            v-model="textInput"
            @keyup.enter="handleSubmit"
            placeholder="Type the Georgian verb..."
            :disabled="isSubmitting"
          />
          <button @click="handleSubmit" :disabled="isSubmitting || !textInput">
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
        <div v-else-if="quizMode === 'unscramble'">
          <!-- Unscramble component placeholder -->
          <p>Unscramble mode not implemented yet.</p>
          <button @click="handleSubmit" :disabled="isSubmitting">Submit Unscramble</button>
        </div>
        <div v-else-if="quizMode === 'multiple-choice'">
          <!-- Multiple Choice component placeholder -->
          <p>Multiple choice mode not implemented yet.</p>
          <button @click="handleSubmit" :disabled="isSubmitting">Submit Choice</button>
        </div>

        <FeedbackDisplay
          v-if="currentSentence?.diff?.length > 0"
          :expected="currentSentence.correctAnswer"
          :actual="currentSentence.userAnswer"
        />
      </div>
    </div>
    <div v-else class="no-story-selected">
      <p>Please select a story and quiz settings from the library.</p>
    </div>

    <div class="quiz-controls">
      <p>Score: {{ sessionStore.score }} / {{ sessionStore.totalSentences }}</p>
      <p>Progress: {{ sessionStore.progressPercentage }}%</p>
      <button @click="sessionStore.finishSession" :disabled="!isSessionActive">End Quiz</button>
      <!-- Add navigation buttons if needed, e.g., Back, Next -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSessionStore } from '@/stores/useSessionStore';
import FeedbackDisplay from '@/components/FeedbackDisplay.vue';
// Import other necessary components like UnscrambleComponent, MultipleChoiceComponent

const sessionStore = useSessionStore();
const {
  currentSentence,
  currentSentenceData,
  isSessionActive,
  quizMode,
  isLoading, // Assuming isLoading is managed within session store or useApi
  error,     // Assuming error is managed within session store or useApi
} = storeToRefs(sessionStore);

const textInput = ref('');
const isSubmitting = ref(false);

// Computed property for the English translation of the current sentence
const currentSentenceEnglish = computed(() => {
  if (currentSentenceData.value && currentSentence.value) {
    // Access the correct tense from the story data
    const sentenceWithTense = currentSentenceData.value.sentences.find(
      (s: any) => s.id === currentSentence.value?.id
    );
    return sentenceWithTense?.tenses[sessionStore.currentTense || 'present']?.english || 'English translation not available';
  }
  return '';
});

const handleSubmit = async () => {
  if (!currentSentence.value || isSubmitting.value) return;

  isSubmitting.value = true;

  // Use the appropriate submission method based on quizMode
  if (quizMode.value === 'text') {
    sessionStore.submitAnswer(currentSentence.value.id, textInput.value);
    textInput.value = ''; // Clear input after submission
  } else if (quizMode.value === 'unscramble') {
    // Placeholder: Call unscramble submission logic
    // const arrangedChars = getArrangedCharsFromUnscrambleComponent();
    // sessionStore.submitUnscrambleAnswer(currentSentence.value.id, arrangedChars);
    console.log('Unscramble submission handler');
  } else if (quizMode.value === 'multiple-choice') {
    // Placeholder: Call multiple choice submission logic
    // const selectedOption = getSelectedOptionFromMultipleChoiceComponent();
    // sessionStore.submitMultipleChoiceAnswer(currentSentence.value.id, selectedOption);
    console.log('Multiple choice submission handler');
  }

  isSubmitting.value = false;

  // If it's the last sentence and it was correct, potentially navigate to summary
  if (sessionStore.isLastSentence && currentSentence.value?.isCorrect) {
      // Delay navigation slightly to allow feedback to be seen, or handle via a watcher
      setTimeout(() => {
          // Logic to navigate to summary view (e.g., using router)
          // import { useRouter } from 'vue-router';
          // const router = useRouter();
          // router.push(`/summary/${sessionStore.currentStoryId}`);
          console.log('Navigating to summary...');
      }, 1500); // Example delay
  }
};

// Watch for changes in currentSentence to potentially reset input or manage state
watch(currentSentence, (newSentence, oldSentence) => {
  if (newSentence && newSentence.id !== oldSentence?.id) {
    // Reset text input when moving to a new sentence
    textInput.value = '';
    // Clear diff display if moving to a new sentence before submission
    if (newSentence.diff?.length === 0 && newSentence.userAnswer === '') {
       // Ensure feedback display is cleared if not already handled by submission
    }
  }
});

onMounted(() => {
  // You might want to load the story here if it's not loaded by the parent view
  // For now, assuming the parent view (QuizView.vue) handles loading the story.
});
</script>

<style scoped>
.quiz-engine {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.sentence-display {
  width: 100%;
  max-width: 600px;
  text-align: center;
  margin-bottom: 20px;
}

.sentence-display p {
  font-size: 1.3em;
  margin-bottom: 15px;
  line-height: 1.6;
}

.loading-or-error p {
  color: grey;
  font-style: italic;
}

input[type="text"] {
  padding: 10px;
  font-size: 1.1em;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 250px;
}

button {
  padding: 10px 15px;
  font-size: 1.1em;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

.quiz-controls {
  margin-top: 20px;
  text-align: center;
  border-top: 1px solid #eee;
  padding-top: 15px;
  width: 100%;
  max-width: 600px;
}

.quiz-controls p {
  margin: 5px 0;
  font-size: 1.1em;
}
</style>
