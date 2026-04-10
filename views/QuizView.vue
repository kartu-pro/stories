<template>
  <div class="quiz-view">
    <div v-if="isLoading">Loading story data...</div>
    <div v-else-if="error">Error loading story: {{ error.message }}</div>
    <div v-else-if="!sessionStore.isSessionActive && !isLoading">
      <p>Please select a story from the library to begin.</p>
      <router-link to="/">Go to Library</router-link>
    </div>
    <div v-else>
      <QuizEngine />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/stores/useSessionStore';
import QuizEngine from '@/components/QuizEngine.vue';

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const storyId = route.params.storyId as string;

onMounted(async () => {
  // Check if session is already active for this story, if not, load it.
  // This handles cases where the user navigates directly to a quiz URL
  // or refreshes the page.
  if (!sessionStore.isSessionActive || sessionStore.currentStoryId !== storyId) {
    // Load the story data using the ID from the route parameters
    // The session store's loadStory action also sets up the initial sentence.
    await sessionStore.loadStory(storyId);

    // If story loading failed or returned no data, redirect back to library
    if (!sessionStore.currentStoryData) {
      console.error("Failed to load story data, redirecting to library.");
      router.push('/');
    }
  }
});

// Watch for changes in session state, e.g., if the quiz finishes
watch(() => sessionStore.currentStoryId, (newStoryId, oldStoryId) => {
  // If the session is no longer active for the current story (e.g., finished or reset)
  // and we are on this quiz view, redirect to the summary or library.
  if (newStoryId !== storyId && !sessionStore.isSessionActive) {
     if (sessionStore.currentStoryData) { // Check if data exists to infer completion
        console.log("Session ended or reset, navigating to summary.");
        router.push({ name: 'Summary', params: { storyId: storyId } });
     } else {
        console.log("Session reset or failed, navigating to library.");
        router.push('/');
     }
  }
});

const isLoading = computed(() => sessionStore.loading); // Assuming sessionStore has a loading state
const error = computed(() => sessionStore.error);   // Assuming sessionStore has an error state

</script>

<style scoped>
.quiz-view {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align items to the top */
  padding: 20px;
  min-height: 100vh; /* Ensure it takes full viewport height */
  box-sizing: border-box;
}

.quiz-view > div {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-or-error,
.no-story-selected {
  text-align: center;
  margin-top: 50px;
  font-size: 1.2em;
  color: #666;
}

a {
  color: #5c6ac4;
  text-decoration: none;
  margin-top: 15px;
}

a:hover {
  text-decoration: underline;
}
</style>
