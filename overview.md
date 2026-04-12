# Overview
A web app for learning foreign languages using short stories.

## Features
- **Multilingual:** Both the ui and data structure allow users who speak any language to learn any other language.
- **Story Library:** A collection of stories and images, searchable by language, length, focus, keyword. Free and premium content.
- **Study Lenses:** Content organized to allow one story to serve multiple pedagogical purposes (see below).
- **Content Pipeline:** Custom CMS to allow rapid generation of new stories, translations and native speaker review.
- **Users:** Login/logout, saved preferences (ui language, study langauge, dark/light mode, load images, load audio), progress summary, manage subscriptions, streaks, popular stories.
- **Polish:** Clear UI, smooth UX, graceful handling of errors and edge cases, optimized api fetches, preloading.

## Study Lens Structure
1. **The Story (Base Layer)**
   - The core narrative and metadata (title, length, tier).
   - Contains the set of visual "anchors" (images) used across all versions.

2. **The Version (Linguistic Layer)**
   - Defines the target language and version (e.g., Georgian - Aorist, EN - Future).
   - Contains the "Ground Truth" full-text translations.

3. **The Focus (Grammar Layer)**
   - Determines the specific linguistic task within that version.
   - Examples: Verb conjugation, noun declensions, or core vocabulary.

4. **The Mode (Interactive Layer)**
   - Sets the difficulty level and input method for the user.
   - Levels: Multiple Choice (Easy), Unscramble (Medium), or Text Input (Hard).

## Technologies
- Supabase - data storage and auth
- Vue.js (Composition API) with Vue Router and Pinia
- Typescript
- Github pages for hosting vue front end and media files
