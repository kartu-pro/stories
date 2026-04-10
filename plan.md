# Georgian Story App: Technical Blueprint (V4.0)

## 1. Project Overview
A high-polish, modular Web App for learning Georgian through stories. Focus is on performance (zero-latency transitions) and linguistic accuracy.

- **Tech Stack:** Vue 3 (Composition API), Vue Router, TypeScript, Pinia, Supabase.
- **Hosting/CI:** GitHub Pages + GitHub Actions for automated deployment.

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

## 3. Project File Manifest

| Folder | Key Files & Responsibilities |
| :--- | :--- |
| **`/stores`** | `useConfigStore` (Settings/Toggles, including Dark Mode toggle with Local Storage persistence), `useSessionStore` (Quiz state), `useAuthStore`. |
| **`/views`** | `LibraryView` (Story selection), `QuizView` (Main engine), `SummaryView` (Results). |
| **`/components`**| `QuizEngine` (Logic switcher), `FeedbackDisplay` (LCS Diff), `ImageFrame`. |
| **`/utils`** | `diff.ts` (Character matching), `distractors.ts` (Intelligent tile generation). |
| **`/composables`**| `useApi.ts` (Supabase wrappers), `useHaptics.ts` (Vibration alerts). |

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

- **Auth:** Supabase Auth handles user sessions.
- **Security:** Row Level Security (RLS) on `user_progress` ensures users only access their own scores.
- **CI/CD:** Automated Vitest runs and GitHub Pages deployment on every push to `main`.
