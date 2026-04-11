import { USER_TIERS, TENSES, DIFFICULTIES } from '@/constants';

/**
 * Derived Types from Constants
 * These ensure that variables can only hold valid values defined in constants.ts
 */
export type UserTier = typeof USER_TIERS[keyof typeof USER_TIERS];
export type Tense = typeof TENSES[keyof typeof TENSES];
export type Difficulty = typeof DIFFICULTIES[keyof typeof DIFFICULTIES];

/**
 * 1. RELATIONAL CONTENT STRUCTURE
 * These match the new Supabase schema while maintaining your linguistic requirements.
 */

export interface Quiz {
  id: string;
  type: string;        // e.g., 'verb', 'noun', 'vocabulary'
  answer: string;      // The exact substring to be clozed
  hint?: string;        // The dictionary/infinitive form
  distractors: string[]; // Options for MCQ or Unscramble logic
}

export interface Translation {
  id: string;
  lang: string;        // 'ka', 'en', etc.
  tense: Tense | null; // Nullable for non-verb focus
  full_text: string;   // The complete ground-truth sentence
  audio_url?: string;  // For post-submission playback
  quizzes: Quiz[];     // The various "Lenses" for this sentence
}

export interface Scene {
  id: string;
  image_uuid: string;
  order: number;
  translations: Translation[];
}

/**
 * 2. CORE ENGINE STRUCTURES
 * This replaces your monolithic "Sentence" with the Scene-based model.
 */

export interface Story {
  id: string;
  title: string;
  tier: UserTier;
  scenes: Scene[];
}

/**
 * 3. PROGRESS & SESSION TRACKING
 * Restored from your original blueprint to support the SummaryView.
 */

export interface UserProgress {
  user_id: string;
  story_id: string;
  tense: Tense;
  difficulty: Difficulty;
  accuracy: number; // Calculated as (first_try_correct / total_questions) * 100
  completed_at?: string;
}

/**
 * SessionResult is used by useSessionStore to track the live state 
 * of the current quiz before pushing to Supabase.
 */
export interface SessionResult {
  sceneId: string;
  isFirstTryCorrect: boolean;
  userAnswer: string;
  timestamp: string;
}
