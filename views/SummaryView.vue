<template>
  <div class="summary-view">
    <h1>Quiz Summary</h1>
    <div v-if="loadingSummary">Loading summary...</div>
    <div v-else-if="errorSummary">Error loading summary: {{ errorSummary.message }}</div>
    <div v-else-if="story && sentences.length > 0">
      <h2>{{ story.title || `Story ${storyId}` }}</h2>
      <p>Tense: {{ sessionStore.currentTense || 'N/A' }} | Difficulty: {{ sessionStore.currentDifficulty || 'N/A' }}</p>

      <div class="score-section">
        <h3>Your Score:</h3>
        <p class="score-text">
          {{ sessionStore.score }} / {{ sessionStore.totalSentences }}
          <span v-if="sessionStore.totalSentences > 0" class="percentage">
            ({{ Math.round((sessionStore.score / sessionStore.totalSentences) * 100) }}%)
          </span>
        </p>
      </div>

      <div class="details-section">
        <h3>Details:</h3>
        <ul class="sentence-list">
          <li v-for="(sentence, index) in sentences" :key="sentence.id" :class="{ correct: sentence.isCorrect, incorrect: !sentence.isCorrect }">
            <span class="sentence-index">{{ index + 1 }}.</span>
            <div class="sentence-content">
              <p class="english-text">{{ getEnglishTranslation(sentence) }}</p>
              <div class="georgian-feedback">
                <p>Your Answer: <strong>{{ sentence.userAnswer }}</strong></p>
                <p>Correct Answer: <strong>{{ sentence.correctAnswer }}</strong></p>
                <FeedbackDisplay v-if="sentence.diff.length > 0" :expected="sentence.correctAnswer" :actual="sentence.userAnswer" />
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="actions">
        <button @click="replayQuiz" class="action-button replay">Replay Quiz</button>
        <button @click="goToLibrary" class="action-button library">Back to Library</button>
      </div>
    </div>
    <div v-else>
      <p>No summary available for this story.</p>
      <button @click="goToLibrary" class="action-button library">Back to Library</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/stores/useSessionStore';
import { useApi } from '@/composables/useApi';
import FeedbackDisplay from '@/components/FeedbackDisplay.vue';

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();
const { fetchStoryById } = useApi(); // Assuming fetchStoryById is available

const storyId = route.params.storyId as string;
const story = ref<any>(null); // Replace 'any' with a proper Story type
const loadingSummary = ref(true);
const errorSummary = ref<Error | null>(null);

// Get sentences from the session store after the quiz has concluded
const sentences = computed(() => sessionStore.sentences);

onMounted(async () => {
  if (!storyId) {
    errorSummary.value = new Error("Story ID is missing.");
    loadingSummary.value = false;
    return;
  }

  // Fetch the story details to display the title and potentially other info
  // We rely on the sessionStore holding the sentence data from the completed quiz.
  story.value = await fetchStoryById(storyId);

  if (!story.value) {
    errorSummary.value = new Error(`Could not fetch details for story ID: ${storyId}`);
  }
  loadingSummary.value = false;
});

const getEnglishTranslation = (sentenceData: { id: string; diff: ReturnType<typeof getLcsDiff>; userAnswer: string; correctAnswer: string }) => {
  if (!story.value || !sessionStore.currentTense) return 'N/A';
  const sentence = story.value.sentences.find((s: any) => s.id === sentenceData.id);
  return sentence?.tenses[sessionStore.currentTense]?.english || 'Translation not found';
};

const replayQuiz = async () => {
  // Reset the session and reload the story with the same settings
  await sessionStore.loadStory(storyId);
  // Optionally re-apply settings if they are not persisted automatically
  // sessionStore.setQuizSettings(sessionStore.currentTense, sessionStore.currentDifficulty, sessionStore.quizMode);
  router.push({ name: 'Quiz', params: { storyId: storyId } });
};

const goToLibrary = () => {
  sessionStore.resetSession(); // Clear current session data
  router.push('/');
};
</script>

<style scoped>
.summary-view {
  padding: 30px;
  max-width: 800px;
  margin: 20px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 2.2em;
}

h2 {
  text-align: center;
  color: #555;
  margin-bottom: 10px;
  font-size: 1.8em;
}

.score-section {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background-color: #eef2ff;
  border-radius: 8px;
  border: 1px solid #d0d8ff;
}

.score-section h3 {
  margin: 0 0 10px 0;
  color: #4a4a8a;
  font-size: 1.4em;
}

.score-text {
  font-size: 2.5em;
  font-weight: bold;
  color: #3a3a7a;
}

.percentage {
  font-size: 1.2em;
  font-weight: normal;
  color: #6a6aa0;
}

.details-section h3 {
  color: #444;
  font-size: 1.5em;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.sentence-list {
  list-style: none;
  padding: 0;
}

.sentence-list li {
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  display: flex;
  align-items: flex-start; /* Align items to the top */
  transition: background-color 0.3s ease;
}

.sentence-list li.correct {
  border-left: 5px solid #4CAF50;
  background-color: #f0fff0; /* Light green background */
}

.sentence-list li.incorrect {
  border-left: 5px solid #f44336;
  background-color: #fff0f0; /* Light red background */
}

.sentence-index {
  font-weight: bold;
  color: #777;
  margin-right: 15px;
  font-size: 1.1em;
  flex-shrink: 0; /* Prevent index from shrinking */
}

.sentence-content {
  flex-grow: 1; /* Allow content to take remaining space */
}

.english-text {
  font-style: italic;
  color: #555;
  margin-bottom: 10px;
  font-size: 1.1em;
  line-height: 1.5;
}

.georgian-feedback p {
  margin: 4px 0;
  font-size: 0.95em;
  line-height: 1.4;
}

.georgian-feedback p strong {
  color: #333;
}

.actions {
  margin-top: 40px;
  text-align: center;
}

.action-button {
  padding: 12px 25px;
  margin: 0 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.3s ease;
  font-weight: 500;
}

.action-button.replay {
  background-color: #5c6ac4;
  color: white;
}
.action-button.replay:hover {
  background-color: #4a57a3;
  transform: translateY(-2px);
}

.action-button.library {
  background-color: #6c757d;
  color: white;
}
.action-button.library:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}
</style>
