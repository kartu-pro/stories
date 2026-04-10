# 🇬🇪 Georgian Story App: Technical Blueprint (V2.1)
## 1. Project Overview
A high-polish, modular Web App for learning Georgian through stories.
 * **Tech Stack:** Vue 3 (Composition API), TypeScript, Pinia, Supabase (Free Tier).
 * **Hosting:** GitHub Pages (App + Image Assets).
 * **Key UX:** Horizontal transitions, character-level diff feedback, and haptic integration.
## 2. Data & Progress Architecture
### 2.1 Supabase Schema: user_progress
Tracks completions based on the specific settings used during the session.
 * user_id: UUID
 * story_id: UUID
 * tense: String (e.g., 'aorist')
 * difficulty: String (e.g., 'hard')
 * accuracy: Integer (0-100)
 * completed_at: Timestamp
### 2.2 Story JSONB Structure
Each sentence object inside a story's sentences array:
```json
{
  "image_uuid": "550e8400-e29b...",
  "tenses": {
    "present": {
      "georgian": "ბავშვი ჭამს ვაშლს",
      "english": "The child is eating an apple",
      "verb": "ჭამს",
      "distractors": ["ჭამ", "ჭამენ"]
    },
    "aorist": {
       "georgian": "ბავშვმა შეჭამა ვაშლი",
       "english": "The child ate the apple",
       "verb": "შეჭამა",
       "distractors": ["ვჭამე", "ჭამა"]
    }
  }
}

```
## 3. Component Architecture (Modular Files)
### 3.1 State Management (/stores)
 * useConfigStore.ts: Persists currentTense and currentDifficulty globally.
 * useSessionStore.ts: Tracks currentIndex, correctCount, and isTypingMobile state.
### 3.2 View Components
 * LibraryView.vue: Story selection with filters (Verbs, Subjects, Length).
 * StorySetup.vue: Modal/Overlay to confirm **Tense** and **Difficulty** before starting.
 * AppView.vue: The main engine using `<transition name="slide-h">`.
 * SummaryView.vue: Final accuracy score with dropdowns to override Tense/Difficulty before saving to Supabase.
### 3.3 Quiz Logic Components
 * QuizEngine.vue: Headless controller switching between:
   * MultipleChoice.vue: 4-option selection.
   * Unscramble.vue: Letter tile pool with phonetic distractors.
   * TextInput.vue: Native input with keyboard listener.
 * FeedbackDisplay.vue: Uses the **LCS Diff** utility to replace the input area after submission.
## 4. Core Utilities
### 4.1 LCS Diff (utils/diff.ts)
Calculates character-level changes (Match, Insertion, Deletion).
 * *Note:* Replace the input with this visual diff on "Hard" and "Medium" modes.
### 4.2 Distractor Generator (utils/distractors.ts)
Generates the character pool for the Unscramble mode.
 * **Logic:** Includes all letters of the correct verb + phonetic foils (e.g., if წ is present, add ც and ძ) + random common letters to total 12 tiles.
### 4.4 Haptics (utils/haptics.ts)
 * success(): navigator.vibrate(50).
 * error(): navigator.vibrate([50, 100, 50]).
## 5. UI/UX Rules
### 5.1 Mobile "Typing Mode"
 * When a text input is focused on a mobile device:
   * isTypingMobile becomes true.
   * ImageFrame.vue is hidden (v-if).
   * The Georgian sentence is pinned to the top to prevent scrolling issues.
### 5.2 Animations
 * Use TransitionGroup for the story slides.
 * **Horizontal Slide:** The entire SentenceSlide (Image + Text + Input) moves left on "Next" and right on "Back."
### 5.3 Keyboard Shortcuts
 * Enter: Submit Answer / Next Sentence.
 * 1-4: Select Multiple Choice options.
 * T: Toggle English translation.
 * Esc: Return to Library.
## 6. Image & Asset Strategy
 * **Hosting:** Images stored as .webp files in /public/assets/images/ on GitHub Pages.
 * **Preloading:** The AppView will trigger an invisible image preload for currentIndex + 1 to ensure instant transitions.
## 7. Persistence Flow
 1. **Story Finish:** Push user to SummaryView.
 2. **Review:** User sees accuracy. They can toggle dropdowns for "Final Tense" or "Final Difficulty" if they want to log the progress differently.
 3. **Save:** On "Mark as Read," perform a Supabase upsert to the user_progress table.
 4. **Exit:** Route back to LibraryView.
