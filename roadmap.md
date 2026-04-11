# Georgian Story App: Implementation Roadmap

## Phase 1: State & Session Management
- [ ] **Implement `useSessionStore.ts`**: Create the reactive state for a live quiz session, tracking `currentSentenceIndex`, `selectedTense`, and `difficulty`.
- [ ] **One-Try Accuracy Logic**: Build the logic to flag a sentence as "Incorrect" for the session accuracy total if the first attempt fails, regardless of subsequent corrections.
- [ ] **Integration**: Ensure `useSessionStore` communicates with `useStoryStore` to pull the active story data.

## Phase 2: The Quiz Engine (Core UI)
- [ ] **Setup Modal**: Develop the mandatory start-screen overlay where users select Tense and Difficulty before the quiz begins.
- [ ] **`QuizEngine.vue`**: Orchestrate the switching between **TextInput**, **Unscramble**, and **Multiple Choice** modes.
- [ ] **Keyboard Shortcuts**: Map `Enter` for submission/progression and keys `1–4` for multiple-choice options.

## Phase 3: Feedback & Linguistic Accuracy
- [ ] **`FeedbackDisplay.vue`**: Implement the LCS (Longest Common Subsequence) diffing UI.
- [ ] **Diff Visuals**: Apply color coding: Green (Match), Red (Error), and Yellow/Underline (Insertion).
- [ ] **`useHaptics.ts`**: Trigger haptic vibrations for correct/incorrect feedback on mobile devices.

## Phase 4: Performance & Optimization
- [ ] **`ImageFrame.vue`**: Create a responsive container for story images that respects the **Data Saver** toggle from `useConfigStore`.
- [ ] **$N+1$ Preloading**: Logic to pre-fetch the image and audio for the next sentence while the user is solving the current one.
- [ ] **Mobile Typing Mode**: Logic to hide images when the keyboard is active to maximize viewport space for Georgian text.

## Phase 5: Persistence & Summary
- [ ] **`SummaryView.vue`**: Design the results page to show the final accuracy percentage and session highlights.
- [ ] **Supabase Sync**: On story completion, use `useApi.ts` to push results to the `user_progress` table.
- [ ] **Tier Gates**: Implement UI locks in `LibraryView.vue` using `useAuthStore` to prevent access to premium content by free users.
