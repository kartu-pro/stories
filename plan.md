# 🇬🇪 Georgian Story App: Technical Blueprint (V2.1)

## 1. Project Overview
A high‑polish, modular Web App for learning Georgian through stories.

- **Tech Stack:** Vue 3 (Composition API), TypeScript, Pinia, Supabase (Free Tier).
- **Hosting:** GitHub Pages (App + Image Assets).
- **Key UX:** Horizontal transitions, character‑level diff feedback, and haptic integration.

## 2. Data & Progress Architecture

### 2.1 Supabase Schema: `user_progress`
Tracks completions based on the specific settings used during the session.

| Column        | Type    | Description |
|---------------|---------|-------------|
| `user_id`     | UUID    | Authenticated user ID. |
| `story_id`    | UUID    | Story identifier. |
| `tense`       | String  | e.g., `'aorist'`. |
| `difficulty`  | String  | e.g., `'hard'`. |
| `accuracy`    | Integer | 0‑100. |
| `completed_at`| Timestamp | UTC. |

> **Tip:** Use a composite unique index on `(user_id, story_id, tense, difficulty)` to prevent duplicate rows.

### 2.2 Supabase Schema: `stories`
Defines the structure of a story and its sentences. Stored as a JSONB column `content` in the `stories` table.

| Column   | Type    | Description |
|----------|---------|-------------|
| `id`     | UUID    | Primary key for the story. |
| `title`  | Text    | Human‑readable title of the story. |
| `author` | Text    | Optional author/creator name. |
| `content`| JSONB   | Full story payload (see **Story JSONB Structure** below). |
| `created_at` | Timestamp | When the story was added. |
| `updated_at` | Timestamp | Last modification time. |

#### Story JSONB Structure
```json
{
  "image_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "sentences": [
    {
      "id": "1",
      "georgian": "ბავშვი ჭამს ვაშლს",
      "english": "The child is eating an apple",
      "image_uuid": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
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
    },
    {
      "id": "2",
      "georgian": "მამა მუშაობს ბაღში",
      "english": "Dad works in the garden",
      "image_uuid": "b2c3d4e5-6789-0abc-def1-234567890abc",
      "tenses": {
        "present": {
          "georgian": "მამა მუშაობს ბაღში",
          "english": "Dad works in the garden",
          "verb": "მუშაობს",
          "distractors": ["მუშაობ", "მუშაობენ"]
        },
        "aorist": {
          "georgian": "მამამ მუშაობა ბაღში",
          "english": "Dad worked in the garden",
          "verb": "მუშავდა",
          "distractors": ["მუშავდა", "მუშავდა"]
        }
      }
    }
    // ... additional sentences ...
  ]
}
```

**Schema Details**

- **Story Level**
  - `id` – UUID, primary key.
  **`title`** – Required, non‑empty string.
  **`author`** – Optional string.
  **`content.image_uuid`** – UUID referencing a pre‑uploaded image asset that represents the story’s cover or thumbnail.
  **`content.sentences`** – Array of sentence objects (minimum 1).

- **Sentence Level**
  - `id` – String or UUID unique within the story.
  - `georgian` – Full Georgian sentence (used for display in “Easy” mode).
  - `english` – English translation.
  - `image_uuid` – UUID linking to an illustration for this sentence.
  - `tenses` – Object keyed by tense name (e.g., `present`, `aorist`, `future`).
    - Each tense object contains:
      - `georgian` – Sentence in the specific tense.
      - `english` – Translation for that tense.
      - `verb` – The target verb string that learners must produce.
      - `distractors` – Array of 2‑3 plausible but incorrect verb forms.

> **Validation Rules**
> - Every `tenses` entry must include `georgian`, `english`, `verb`, and at least two `distractors`.
> - All `image_uuid` values must correspond to an existing file in `/public/assets/images/`.
> - The `sentences` array order defines the slide order in the UI.

### 2.3 Supabase Schema: `user_progress`
(Repeated here for context; unchanged from earlier description.)

| Column        | Type    | Description |
|---------------|---------|-------------|
| `user_id`     | UUID    | Authenticated user ID. |
| `story_id`    | UUID    | Story identifier. |
| `tense`       | String  | e.g., `'aorist'`. |
| `difficulty`  | String  | e.g., `'hard'`. |
| `accuracy`    | Integer | 0‑100. |
| `completed_at`| Timestamp | UTC. |

> **Tip:** Use a composite unique index on `(user_id, story_id, tense, difficulty)` to prevent duplicate rows.

## 3. Component Architecture (Modular Files)

### 3.1 State Management (`/stores`)

| Store | Purpose | Key State |
|-------|---------|-----------|
| `useConfigStore.ts` | Persists current `tense` and `difficulty` globally. | `currentTense`, `currentDifficulty` |
| `useSessionStore.ts` | Tracks session progress. | `currentIndex`, `correctCount`, `isTypingMobile` |

### 3.2 View Components

| Component | Responsibility |
|-----------|----------------|
| `LibraryView.vue` | Story selection with filters (Verbs, Subjects, Length). |
| `StorySetup.vue` | Modal/Overlay to confirm **Tense** and **Difficulty** before starting. |
| `AppView.vue` | Main engine using `<transition name="slide-h">`. |
| `SummaryView.vue` | Final accuracy score with dropdowns to override `Tense`/`Difficulty` before saving to Supabase. |

### 3.3 Quiz Logic Components

| Component | Role |
|-----------|------|
| `QuizEngine.vue` | Headless controller switching between: |
| | • `MultipleChoice.vue` – 4‑option selection. |
| | • `Unscramble.vue` – Letter tile pool with phonetic distractors. |
| | • `TextInput.vue` – Native input with keyboard listener. |
| `FeedbackDisplay.vue` | Uses the **LCS Diff** utility to replace the input area after submission. |

## 4. Core Utilities

### 4.1 LCS Diff (`utils/diff.ts`)
Calculates character‑level changes (Match, Insertion, Deletion).  
*Replace the input with this visual diff on “Hard” and “Medium” modes.*

### 4.2 Distractor Generator (`utils/distractors.ts`)
Generates the character pool for the Unscramble mode.

*Logic:*  
1. Include all letters of the correct verb.  
2. Add phonetic foils (e.g., if `წ` is present, add `ც` and `ძ`).  
3. Add random common letters to total 12 tiles.

### 4.4 Haptics (`utils/haptics.ts`)
```ts
export const success = () => navigator.vibrate(50);
export const error   = () => navigator.vibrate([50, 100, 50]);
```

## 5. UI/UX Rules

### 5.1 Mobile “Typing Mode”
- When a text input is focused on a mobile device:
  - `isTypingMobile` becomes `true`.
  - `ImageFrame.vue` is hidden (`v-if`).
  - The Georgian sentence is pinned to the top to prevent scrolling issues.

### 5.2 Animations
- Use `TransitionGroup` for the story slides.
- **Horizontal Slide:** The entire `SentenceSlide` (Image + Text + Input) moves left on “Next” and right on “Back.”

### 5.3 Keyboard Shortcuts
| Key | Action |
|-----|--------|
| Enter | Submit Answer / Next Sentence |
| 1‑4 | Select Multiple Choice options |
| T | Toggle English translation |
| Esc | Return to Library |

## 6. Image & Asset Strategy
- **Hosting:** Images stored as `.webp` files in `/public/assets/images/` on GitHub Pages.
- **Preloading:** `AppView` will trigger an invisible image preload for `currentIndex + 1` to ensure instant transitions.

## 7. Persistence Flow
1. **Story Finish:** Push user to `SummaryView`.  
2. **Review:** User sees accuracy. They can toggle dropdowns for “Final Tense” or “Final Difficulty” if they want to log the progress differently.  
3. **Save:** On “Mark as Read,” perform a Supabase upsert to the `user_progress` table.  
4. **Exit:** Route back to `LibraryView`.

---

### Suggested Enhancements & Missing Details

1. **Authentication Flow**  
   - Add a lightweight Supabase Auth wrapper (`/composables/useAuth.ts`) to handle sign‑in/out and expose `userId`.  
   - Persist `userId` in Pinia so all stores can reference it.

2. **Error Handling & Loading States**  
   - Centralize API error handling in a `useApi.ts` composable.  
   - Show a global loading spinner during data fetches.

3. **Accessibility**  
   - Ensure all interactive elements have `aria-labels`.  
   - Provide keyboard focus outlines for mobile users.

4. **Testing Strategy**  
   - Unit tests for utilities (`diff.ts`, `distractors.ts`).  
   - Component tests with Vue Test Utils for `QuizEngine.vue`.  
   - End‑to‑end tests (Cypress) covering a full story flow.

5. **Performance**  
   - Lazy‑load story JSON after the first image preload.  
   - Use `defineAsyncComponent` for heavy components (`Unscramble.vue`).

6. **Internationalization**  
   - Wrap static strings in `$t()` for future language support.

7. **Versioning**  
   - Add a `CHANGELOG.md` and semantic versioning tags in Git.

8. **Documentation**  
   - Create a `docs/` folder with component diagrams and API contracts.

9. **CI/CD**  
   - GitHub Actions to lint, test, and deploy to GitHub Pages on every push to `main`.

10. **Security**  
    - Use Supabase Row Level Security (RLS) to restrict `user_progress` writes to the authenticated user only.

Implementing these additions will make the app more robust, maintainable, and ready for production use.
