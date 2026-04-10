import { defineStore } from 'pinia';
import { useApi } from '@/composables/useApi'; // Assuming useApi is set up correctly
import { getLcsDiff } from '@/utils/diff'; // Assuming diff utility is correctly set up

// Define the structure for a single sentence's progress
interface SentenceProgress {
  id: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  diff: ReturnType<typeof getLcsDiff>;
}

// Define the structure for the overall session state
interface SessionState {
  currentStoryId: string | null;
  currentStoryData: any | null; // Structure based on plan.md JSONB
  currentTense: string | null;
  currentDifficulty: string | null;
  sentences: SentenceProgress[];
  currentSentenceIndex: number;
  quizMode: 'text' | 'unscramble' | 'multiple-choice' | null; // Add quiz modes
  score: number;
  totalSentences: number;
  // Add other relevant states like selected answers for multiple choice, etc.
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    currentStoryId: null,
    currentStoryData: null,
    currentTense: null,
    currentDifficulty: null,
    sentences: [],
    currentSentenceIndex: 0,
    quizMode: null,
    score: 0,
    totalSentences: 0,
  }),

  actions: {
    async loadStory(storyId: string) {
      this.currentStoryId = storyId;
      this.sentences = []; // Reset sentences for a new story
      this.currentSentenceIndex = 0;
      this.score = 0;

      const { fetchStoryById } = useApi();
      const storyData = await fetchStoryById(storyId);

      if (storyData) {
        this.currentStoryData = storyData;
        this.totalSentences = storyData.sentences.length;
        // Initialize sentence progress tracking
        this.sentences = storyData.sentences.map((sentence: any) => ({
          id: sentence.id,
          userAnswer: '',
          correctAnswer: sentence.tenses[this.currentTense || 'present']?.verb || '', // Default to present or handle missing tense
          isCorrect: false,
          diff: [],
        }));
      } else {
        // Handle error: story not found or fetch error
        console.error(`Story with ID ${storyId} not found.`);
        // Potentially redirect or show an error message
      }
    },

    setQuizSettings(tense: string, difficulty: string, mode: SessionState['quizMode']) {
      this.currentTense = tense;
      this.currentDifficulty = difficulty;
      this.quizMode = mode;
      // Re-initialize sentences if settings change after story load
      if (this.currentStoryData) {
        this.sentences = this.currentStoryData.sentences.map((sentence: any) => ({
          id: sentence.id,
          userAnswer: '',
          correctAnswer: sentence.tenses[this.currentTense || 'present']?.verb || '',
          isCorrect: false,
          diff: [],
        }));
      }
    },

    submitAnswer(sentenceId: string, userAnswer: string) {
      if (!this.currentStoryData) return;

      const sentenceIndex = this.sentences.findIndex(s => s.id === sentenceId);
      if (sentenceIndex === -1) return;

      const targetSentence = this.currentStoryData.sentences.find((s: any) => s.id === sentenceId);
      if (!targetSentence) return;

      const correctAnswer = targetSentence.tenses[this.currentTense || 'present']?.verb;
      if (!correctAnswer) return;

      const sentenceProgress = this.sentences[sentenceIndex];
      sentenceProgress.userAnswer = userAnswer;
      sentenceProgress.correctAnswer = correctAnswer; // Ensure correctAnswer is updated
      sentenceProgress.diff = getLcsDiff(correctAnswer, userAnswer);

      // Evaluate correctness based on exact match for now, could be refined
      // For 'unscramble' mode, this might need adjustment if the order doesn't matter as much
      // For 'multiple-choice', this logic would be different.
      sentenceProgress.isCorrect = userAnswer.trim() === correctAnswer.trim();

      if (sentenceProgress.isCorrect) {
        this.score++;
      }

      // Move to the next sentence or end the quiz
      if (this.currentSentenceIndex < this.totalSentences - 1) {
        this.currentSentenceIndex++;
      } else {
        // Quiz finished
        this.finishSession();
      }
    },

    // Placeholder for handling multiple-choice answers
    submitMultipleChoiceAnswer(sentenceId: string, selectedAnswer: string) {
      // Similar logic to submitAnswer, but with selectedAnswer
      // Ensure to set isCorrect based on the selected answer matching the correct option
      console.log(`Multiple choice answer submitted for ${sentenceId}: ${selectedAnswer}`);
      // ... implementation details ...
    },

    // Placeholder for handling unscramble answers (e.g., arranging tiles)
    submitUnscrambleAnswer(sentenceId: string, arrangedChars: string) {
      // Similar logic to submitAnswer, comparing arrangedChars with correctAnswer
      console.log(`Unscramble answer submitted for ${sentenceId}: ${arrangedChars}`);
      // ... implementation details ...
    },

    finishSession() {
      // Logic to handle end of quiz, e.g., navigation to summary
      console.log('Session finished!');
      // Potentially save progress to Supabase here via useApi
    },

    resetSession() {
      this.currentStoryId = null;
      this.currentStoryData = null;
      this.currentTense = null;
      this.currentDifficulty = null;
      this.sentences = [];
      this.currentSentenceIndex = 0;
      this.quizMode = null;
      this.score = 0;
      this.totalSentences = 0;
    },
  },

  getters: {
    currentSentence: (state) => {
      if (state.currentStoryData && state.sentences.length > 0) {
        return state.sentences[state.currentSentenceIndex];
      }
      return null;
    },
    currentSentenceData: (state) => {
      if (state.currentStoryData && state.sentences.length > 0) {
        return state.currentStoryData.sentences[state.currentSentenceIndex];
      }
      return null;
    },
    isSessionActive: (state) => state.currentStoryId !== null,
    progressPercentage: (state) => {
      if (state.totalSentences === 0) return 0;
      return Math.round((state.currentSentenceIndex / state.totalSentences) * 100);
    },
    isLastSentence: (state) => state.currentSentenceIndex === state.totalSentences - 1,
  },
});
