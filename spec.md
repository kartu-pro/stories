# Georgian Story App: Unified Technical Spec (V5.0)

## 1. Project Overview
A modular, high-performance Web App for learning languages through narratives. The engine is moving from a static JSON structure to a relational model to support multi-language pairings and granular grammar focus.

- **Tech Stack:** Vue 3 (Composition API), Pinia, TypeScript, Supabase.
- **Linguistic Focus:** Relational "Lenses" allowing one scene to power multiple quiz types (verbs, nouns, cases).
- **Performance:** Zero-latency transitions via asset preloading and "Just-in-Time" relational fetching.

---

## 2. Relational Database Architecture (SQL)
This schema decouples visual assets from linguistic data to allow for global scalability.

### 2.1 Content Tables
| Table | Column | Description |
| :--- | :--- | :--- |
| **`stories`** | `id`, `title`, `sentence_count`, `tier` | Metadata for the library and access control. |
| **`scenes`** | `story_id`, `image_uuid`, `order` | Visual anchors; one image per scene. |
| **`translations`** | `scene_id`, `lang`, `tense`, `full_text` | Ground-truth sentences for the target and reference languages. |
| **`quizzes`** | `translation_id`, `type`, `answer`, `hint` | The interactive task (e.g., Verb, Noun Case, Vocabulary). |

### 2.2 User & Access Tables
| Table | Column | Description |
| :--- | :--- | :--- |
| **`user_profiles`** | `id`, `tier`, `preferred_ui_lang` | Tracks user level (Free/Premium) and UI language. |
| **`user_progress`** | `user_id`, `accuracy`, `completed_at` | Stores results per story/tense session. |
| **`user_access`** | `user_id`, `story_id`, `pack_id` | Manages permissions for individual stories or purchased packs. |

---

## 3. Library & Filtering Logic
Filtering is handled primarily at the database level via Supabase to keep the frontend snappy.

- **Keyword Search:** Debounced full-text search on `stories.title` and `translations.full_text`.
- **Length Filtering:** A slider interface based on `stories.sentence_count`.
- **Grammar Sub-Selectors:**
    - **Primary:** Quiz Type (Verb, Noun, Adjective).
    - **Secondary:** Tense (for Verbs) or Case (for Nouns).
- **Tier Gates:** UI locks visualised in `LibraryView.vue` based on `user_profiles.tier` or `user_access` entries.

### 3.1 Application Routes

| Path | View Component | Description |
| :--- | :--- | :--- |
| `/` | `LibraryView` | Home page for story discovery and relational filtering. |
| `/setup/:storyId` | `SetupView` | Configuration layer to select Tense, Language, and Quiz Type. |
| `/quiz/:storyId` | `QuizEngine` | The main interactive session view. |
| `/summary/:storyId` | `SummaryView` | Result analysis and Supabase progress persistence. |

---

## 4. Core Logic & Scoring

### 4.1 One-Try Accuracy
Users get exactly one attempt per question to ensure the data reflects true retention.
- **Formula:** $\text{accuracy} = \left( \frac{\text{first\_try\_correct}}{\text{total\_questions}} \right) \times 100$.
- Subsequent corrections allow the user to proceed but do not improve the session accuracy score.

### 4.2 Feedback & Audio
- **LCS Diff:** Uses the Longest Common Subsequence algorithm to highlight matches (Green), errors (Red), and insertions (Yellow).
- **Audio Reward:** Full-sentence audio playback is restricted until *after* a successful submission to prevent "cheating" via listening.

### 4.3 Unscramble Mode
Generated via `utils/distractors.ts` using:
- **Phonetic Foils:** If the target has `წ`, add `ც` or `ძ` to the tile pool.
- **Frequency Weighting:** Common characters (ა, ი, ე, ს) fill the remaining slots in the 12-tile pool.

### 4.4 The Engine Lifecycle & Orchestration

The quiz logic follows a hierarchical delegation model to handle varied linguistic tasks:

- **Session Initialization:** `SetupView` commits the user's "Lens" (e.g., Verb + Aorist) to `useSessionStore`.
- **Scene Management:** `QuizEngine.vue` acts as the root orchestrator, reacting to state changes in `useSessionStore`.
- **Linguistic Masking:** `ClozeSentence.vue` dynamically replaces the `answer` string within the `full_text` to create the interactive "blank".
- **Mode Switching:** `InputOrchestrator.vue` functions as a dynamic component bridge, mounting the correct input mode (`ModeTextInput`, `ModeUnscramble`, or `ModeMultipleChoice`) or `FeedbackDisplay` based on the session configuration.
- **State Reset:** Between scenes, the engine triggers a lifecycle hook to clear the `FeedbackDisplay` and re-focus the input for the next interaction.

---

## 5. Project File Manifest

| Folder | Key Responsibilities |
| :--- | :--- |
| **`src/api/`** | Supabase service layer. Handles relational queries for stories and progress persistence. |
| **`src/i18n/`** | Localization dictionaries (e.g., `en.json`, `ka.json`) for the UI "chrome". |
| **`src/stores/`** | |
| `useStoryStore.ts` | Read-only cache for relational story/scene data fetched from Supabase. |
| `useSessionStore.ts` | Transient state for the active quiz session (current index, first-try hits). |
| `useConfigStore.ts` | Persistent user preferences (i18n locale, dark mode, audio toggles). |
| `useAuthStore.ts` | Manages Supabase Auth state and user tier/access validation. |
| **`src/components/quiz/`** | |
| `InputOrchestrator.vue` | Logic bridge that mounts the correct `input-modes` based on quiz type. |
| `ClozeSentence.vue` | Manages string manipulation to create interactive "blanks" in sentences. |
| `ImageFrame.vue` | Visual context handler with logic to hide on mobile focus. |
| `input-modes/` | Contains specific logic for `ModeTextInput`, `ModeUnscramble`, and `ModeMultipleChoice`. |
| **`src/components/library/`** | Search bars, filter sliders (length/tense), and `StoryCard` components. |
| **`src/views/`** | |
| `QuizEngine.vue` | Root container for the active learning loop orchestrating the quiz components. |
| `SetupView.vue` | Route for pre-quiz configuration (Language, Tense, and Lens selection). |
| `SummaryView.vue` | Session post-mortem, analytics display, and progress sync trigger. |
| **`src/utils/`** | |
| `diff.ts` | LCS algorithm for real-time string comparison and colored feedback. |
| `distractors.ts` | Generates phonetic and frequency-based tiles for Unscramble mode. |



## 6. Data Strategy & Performance

- **Relational "Just-in-Time" Fetch:** `useStoryStore` fetches only the specific language pairings and quiz types requested during the Setup phase to minimize payload size.
- **Scoring Persistence:** On session completion, `SummaryView` triggers a `useApi` call to sync the `accuracy` from `useSessionStore` to the `user_progress` table.
- **UI Localization:** The interface uses `vue-i18n` with local JSON locales, ensuring the "chrome" of the app remains responsive regardless of the story language.

7. Security & DeploymentRow Level Security (RLS): Ensures users can only write to their own user_progress and only read stories within their tier.Deployment: GitHub Actions for automated deployment to GitHub Pages on every push to main.
