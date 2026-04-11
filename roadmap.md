# Refactor Blueprint: Relational Language Engine

## 1. Database Architecture (SQL)
This structure separates **Visual Context** from **Linguistic Content**, allowing one image to power multiple quiz types across any language.

```sql
-- STORIES: High-level containers for narrative arcs
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SCENES: Visual anchors (The "One-Image-Per-Scene" rule)
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  image_uuid TEXT NOT NULL, 
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TRANSLATIONS: Linguistic ground-truth (The full, correct sentence)
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scene_id UUID REFERENCES scenes(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,      -- 'ka', 'en', 'es'
  tense TEXT,              -- 'present', 'past', 'future'
  full_text TEXT NOT NULL, -- The complete answer-included sentence
  audio_url TEXT,          -- Path to the full-sentence audio
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QUIZZES: The interactive tasks (The "Lens" through which we see a translation)
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  translation_id UUID REFERENCES translations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,      -- 'verb', 'noun_case', 'vocabulary'
  answer TEXT NOT NULL,    -- The exact substring to be clozed
  hint TEXT,               -- The dictionary form (e.g., Infinitive)
  distractors TEXT[]       -- Array of false options
);
```

2. Implementation Roadmap
Phase 1: Data Migration & Model Update
JSON Refactor: Transition stories.json from a flat structure to the nested Story > Scene > Translation > Quiz format.

Agnostic Logic: Update the QuizEngine.vue to use full_text.replace(answer, '___') instead of hardcoded prefix/suffix keys.

Infinitive Integration: Add the hint field to the UI to guide users in "Hard" (Text Input) mode.

Phase 2: Relational Fetching (The Matchmaker)
Filtered Selection: Update useSessionStore to fetch quizzes based on user preferences:

Target Language (What is being quizzed)

Reference Language (What shows as the hint/translation)

Focus Area (Filtering by quiz.type)

Temporal Layering: Implement logic to allow users to play the "Present Tense" version of a story, then "Future," reusing the same scenes.

Phase 3: Feedback & Audio Loop
Spoiler Prevention: Move the audio button exclusively to the FeedbackDisplay.vue.

Reward Play: Configure the engine to auto-play the full sentence audio only after a correct submission to reinforce prosody and listening comprehension.

Phase 4: Personalization & Auth (Supabase Integration)
User Progress: Link firstTryResults to a user_id in Supabase to track accuracy per story/tense over time.

Setup View: Replace the Setup Modal with a dedicated SetupView route for language and difficulty configuration.

Phase 5: Monetization & Scaling
Premium Tiers: Flag certain quiz_types or stories as premium.

Global Access: Since the schema is agnostic, add a new language (e.g., Spanish or French) by simply adding rows to the translations and quizzes tables.

3. Core Principles
Immersive First: Don't play audio until the user has attempted the answer.

Context is King: Always show the image (Scene) to provide visual context for the grammar.

Relational Power: Don't duplicate images. If a sentence has a verb and a noun to quiz, create two quizzes pointing to one translation.



## Other things to consider
- [ ] **Supabase Sync**: On story completion, use `useApi.ts` to push results to the `user_progress` table.
- [ ] **Tier Gates**: Implement UI locks in `LibraryView.vue` using `useAuthStore` to prevent access to premium content by free users.
- [ ] **$N+1$ Preloading**: Logic to pre-fetch the image and audio for the next sentence while the user is solving the current one.
- [ ] **Mobile Typing Mode**: Logic to hide images when the keyboard is active to maximize viewport space for Georgian text.
- [ ] **`useHaptics.ts`**: Trigger haptic vibrations for correct/incorrect feedback on mobile devices.
- login/logout pages
- payment pages
- per story and user access: user might pay to have access to only certain stories, like if they buy a pack of 5 stories
