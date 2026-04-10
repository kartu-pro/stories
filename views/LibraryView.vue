<template>
  <div class="library-view">
    <h1>Georgian Stories</h1>
    <div v-if="loading">Loading stories...</div>
    <div v-else-if="error">Error loading stories: {{ error.message }}</div>
    <ul v-else-if="stories && stories.length > 0">
      <li v-for="story in stories" :key="story.id" class="story-item">
        <div class="story-info">
          <h2>{{ story.title || `Story ${story.id}` }}</h2>
          <p>{{ story.description || 'A fascinating story to learn Georgian.' }}</p>
        </div>
        <button @click="selectStory(story)" class="select-story-button">
          Select
        </button>
      </li>
    </ul>
    <div v-else>No stories available.</div>

    <!-- Setup Modal -->
    <div v-if="showSetupModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Setup Quiz for: {{ selectedStory?.title || 'Selected Story' }}</h2>
        <div class="settings-group">
          <label for="tense">Tense:</label>
          <select id="tense" v-model="selectedTense">
            <option v-for="tense in tenseList" :key="tense" :value="tense">
              {{ capitalizeFirst(tense) }}
            </option>
          </select>
        </div>
        <div class="settings-group">
          <label for="difficulty">Difficulty:</label>
          <select id="difficulty" v-model="selectedDifficulty">
            <option v-for="difficulty in difficultyList" :key="difficulty" :value="difficulty">
              {{ capitalizeFirst(difficulty) }}
            </option>
          </select>
        </div>
        <div class="settings-group">
          <label for="quizMode">Mode:</label>
          <select id="quizMode" v-model="selectedQuizMode">
            <option v-for="mode in quizModeList" :key="mode" :value="mode">
              {{ formatQuizMode(mode) }}
            </option>
          </select>
        </div>
        <div class="modal-actions">
          <button @click="startQuiz" class="confirm-button">Start Quiz</button>
          <button @click="closeSetupModal" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '@/composables/useApi';
import { useSessionStore } from '@/stores/useSessionStore';
import { TENSE_LIST, DIFFICULTY_LIST, QUIZ_MODE_LIST, DEFAULT_SETTINGS } from '@/constants';

const { stories, loading, error, fetchStories } = useApi();
const sessionStore = useSessionStore();
const router = useRouter();

const showSetupModal = ref(false);
const selectedStory = ref<any>(null); // Replace 'any' with a proper Story type if available
const selectedTense = ref(DEFAULT_SETTINGS.TENSE);
const selectedDifficulty = ref(DEFAULT_SETTINGS.DIFFICULTY);
const selectedQuizMode = ref(DEFAULT_SETTINGS.QUIZ_MODE);

// Use constants for dropdown lists
const tenseList = TENSE_LIST;
const difficultyList = DIFFICULTY_LIST;
const quizModeList = QUIZ_MODE_LIST;

onMounted(async () => {
  await fetchStories();
});

const selectStory = (story: any) => {
  selectedStory.value = story;
  // Pre-fill settings if there's existing session data for this story or defaults
  // For now, using initial defaults.
  showSetupModal.value = true;
};

const closeSetupModal = () => {
  showSetupModal.value = false;
  selectedStory.value = null;
};

const startQuiz = async () => {
  if (!selectedStory.value) return;

  // Set the quiz settings in the session store
  sessionStore.setQuizSettings(selectedTense.value, selectedDifficulty.value, selectedQuizMode.value);

  // Load the story data into the session store
  await sessionStore.loadStory(selectedStory.value.id);

  // Navigate to the quiz view
  router.push({ name: 'Quiz', params: { storyId: selectedStory.value.id } });

  closeSetupModal();
};

// Helper to capitalize first letter for display
const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper to format quiz mode for display (e.g., "multiple-choice" -> "Multiple Choice")
const formatQuizMode = (mode: string) => {
  return mode.split('-').map(word => capitalizeFirst(word)).join(' ');
};

// Computed property to derive story titles if not present
const getStoryTitle = (story: any) => {
  return story.title || `Story ${story.id}`;
};

// Computed property to derive story descriptions if not present
const getStoryDescription = (story: any) => {
  return story.description || 'Learn Georgian with this story.';
};
</script>

<style scoped>
.library-view {
  padding: 20px;
  font-family: sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

ul {
  list-style: none;
  padding: 0;
  max-width: 800px;
  margin: 0 auto;
}

.story-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.story-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.story-info {
  flex-grow: 1;
  margin-right: 20px;
}

.story-info h2 {
  margin: 0 0 5px 0;
  color: #444;
}

.story-info p {
  margin: 0;
  color: #666;
  font-size: 0.95em;
}

.select-story-button {
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  background-color: #5c6ac4;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.select-story-button:hover {
  background-color: #4a57a3;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-content h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 25px;
}

.settings-group {
  margin-bottom: 20px;
  text-align: left;
}

.settings-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.settings-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.modal-actions {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}

.modal-actions button {
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.confirm-button {
  background-color: #4CAF50;
  color: white;
}
.confirm-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}
.cancel-button:hover {
  background-color: #da190b;
}

.modal-actions button:hover {
    transform: translateY(-2px);
}
</style>
