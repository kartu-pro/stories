# Georgian Story App: Technical Blueprint (V4.0)

## 1. Project Overview
A high-polish, modular Web App for learning Georgian through stories. Focus is on performance (zero-latency transitions) and linguistic accuracy.

- **Tech Stack:** Vue 3 (Composition API), Vue Router, TypeScript, Pinia, Supabase.
- **Hosting/CI:** GitHub Pages + GitHub Actions for automated deployment.
- **Access Model:** Tiered access (Anonymous, Free, Premium).

## 2. Data Architecture

### 2.1 Supabase Schema: `user_progress`
| Column | Type | Description |
| :--- | :--- | :--- |
| `user_id` | UUID | References Supabase Auth. |
| `story_id` | UUID | The story being tracked. |
| `tense` | String | e.g., `'aorist'`. |
| `difficulty` | String | e.g., `'hard'`. |
| `accuracy` | Integer | Calculated as: $\left( \frac{\text{first\_try\_correct}}{\text{total\_questions}} \right) \times 100$. |
| `completed_at`| Timestamp | UTC. |

### 2.2 Story JSONB Structure
Fetched as one monolithic block per story to allow instant mid-session setting changes.

```json
{
  "image_uuid": "cover-uuid",
  "tier": "anonymous, free, or premium",
  "sentences": [
    {
      "id": "s1",
      "image_uuid": "s1-image-uuid",
      "tenses": {
        "present": {
          "georgian": "ბავშვი ჭამს ვაშლს",
          "english": "The child is eating an apple",
          "verb": "ჭამს",
          "distractors": ["ჭამ", "ჭამენ"],
          "audio_url": "assets/audio/s1_pres.mp3"
        },
        "aorist": {
          "georgian": "ბავშვმა შეჭამა ვაშლი",
          "english": "The child ate an apple",
          "verb": "შეჭამა",
          "distractors": ["ვჭამე", "შეჭამეს"],
          "audio_url": "assets/audio/s1_aor.mp3"
        }
      }
    }
  ]
}
```

### 2.3 Supabase Schema: `user_profiles`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | References Supabase Auth. |
| `tier` | UUID | 'free' or 'premium'. Defaults to 'free'. |



## 3. Project File Manifest

| Folder | Key Files & Responsibilities |
| :--- | :--- |
| **`/stores`** |
| &nbsp;&nbsp;&nbsp;&nbsp;`useConfigStore.ts` | Manages app-wide configuration and settings (e.g., dark mode, data saver). |
| &nbsp;&nbsp;&nbsp;&nbsp;`useSessionStore.ts` | Handles the state and logic for the current quiz session. |
| &nbsp;&nbsp;&nbsp;&nbsp;`useAuthStore.ts` | Manages user authentication state and interactions with Supabase Auth. Also tracks user tier. |
| **`/views`** |
| &nbsp;&nbsp;&nbsp;&nbsp;`LibraryView.vue` | Displays the list of available stories for selection. |
| &nbsp;&nbsp;&nbsp;&nbsp;`QuizView.vue` | The main interface for the quiz, handling user input and progress. |
| &nbsp;&nbsp;&nbsp;&nbsp;`SummaryView.vue` | Presents the quiz results and session summary to the user. |
| **`/components`**|
| &nbsp;&nbsp;&nbsp;&nbsp;`QuizEngine.vue` | Orchestrates the different quiz modes and core logic. |
| &nbsp;&nbsp;&nbsp;&nbsp;`FeedbackDisplay.vue` | Shows real-time feedback on user answers using LCS Diff algorithm. |
| &nbsp;&nbsp;&nbsp;&nbsp;`ImageFrame.vue` | Displays story-related images with responsive handling. |
| &nbsp;&nbsp;&nbsp;&nbsp;`TierBadge.vue` | UI component to label stories. |
| &nbsp;&nbsp;&nbsp;&nbsp;`UpgradeModal.vue` | Prompt shown a user tires to access content above their tier. |
| **`/utils`** |
| &nbsp;&nbsp;&nbsp;&nbsp;`diff.ts` | Implements the Longest Common Subsequence (LCS) algorithm for feedback. |
| &nbsp;&nbsp;&nbsp;&nbsp;`distractors.ts` | Generates intelligent distractor tiles for unscramble mode. |
| **`/composables`**|
| &nbsp;&nbsp;&nbsp;&nbsp;`useApi.ts` | Provides a wrapper for Supabase API calls and data fetching. Injects tier-based filters to queries. |
| &nbsp;&nbsp;&nbsp;&nbsp;`useHaptics.ts` | Manages haptic feedback (vibrations) for user interactions. |

## 3.1 Application Routes

| Path | View/Component | Description |
| :--- | :--- | :--- |
| `/` | `LibraryView` | Home page, displays list of stories. |
| `/story/:storyId` | `QuizView` | Main quiz interface for a specific story. `:storyId` is the unique identifier for the story. |
| `/summary/:storyId` | `SummaryView` | Displays the results and summary after completing a story. |

## 3.2 Filtering Strategy
* **Database Level:** Supabase Row Level Security (RLS) ensures that a user's session token cannot fetch stories above their tier.
* **UI Level:** LibraryView.vue uses the useAuthStore to visually "lock" premium stories for free users, redirecting them to a landing/upgrade page.

## 4. Core Logic & Scoring

### 4.1 One-Try Accuracy
- Users get **exactly one attempt** per sentence. 
- Immediately upon submission (Enter or Tile selection), the `FeedbackDisplay` triggers. 
- If wrong on first try, that sentence is marked "Incorrect" for the session's accuracy calculation, regardless of subsequent corrections.

### 4.2 Intelligent Distractor Generator (`utils/distractors.ts`)
For **Unscramble** mode, the letter pool (12 tiles total) is generated using:
1. **Target Letters:** All characters in the correct verb.
2. **Phonetic Foils:** If the verb contains a specific letter, add its "look-alike/sound-alike" (e.g., if `წ`, add `ც` or `ძ`; if `ჭ`, add `ჩ`).
3. **Frequency Weighting:** Fill remaining tiles with common Georgian letters (ა, ი, ე, ს) to prevent the pool from being too easy to "guess."

### 4.3 LCS Diff Feedback
Applies to both **TextInput** and **Unscramble** modes.
- Compares user input vs. target verb.
- Highlights Match (Green), Deletion/Error (Red), and Insertion (Yellow/Underline).

## 5. UI/UX Rules

### 5.1 Forced Setup Flow
- On story click, a **Setup Modal** overrides the screen.
- User *must* select Tense and Difficulty to proceed.
- These settings remain editable via a settings icon mid-story, triggering an immediate UI update.
- For premium stories clicked by free/anonymous users, the Upgrade Model takes precedence.

### 5.2 Data Saver & Mobile Optimization
- **Image Toggle:** If disabled, the image container uses `v-if` to hide completely; text content expands to fill the space.
- **Mobile Typing Mode:** When the input is focused, the image is hidden to keep the Georgian text and keyboard in the viewport without scrolling.

### 5.3 Keyboard Shortcuts
| Key | Action |
| :--- | :--- |
| **Enter** | Submit Answer / Proceed to Next |
| **1–4** | Select Multiple Choice options |
| **Esc** | Exit Story to Library |

## 6. Data Strategy & Performance

- **Monolithic Fetch:** `useApi.ts` fetches the entire story JSON on start. mid-story tense changes require zero network overhead.
- **Asset Preloading:** When the user is on Sentence $N$, the app pre-fetches the image and audio for Sentence $N+1$ (respecting data-saver toggles).

## 7. Security & Infrastructure

- **Auth:** Supabase Auth handles user sessions and links to `user_pfiles` for tier verification.
- **Security:** Row Level Security (RLS) on `user_progress` ensures users only access their own scores.
- **CI/CD:** Automated Vitest runs and GitHub Pages deployment on every push to `main`.
