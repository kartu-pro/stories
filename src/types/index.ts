import { USER_TIERS, TENSES, DIFFICULTIES } from '@/constants';

/**
 * Derived Types from Constants
 * These ensure that variables can only hold valid values defined in constants.ts
 */
export type UserTier = typeof USER_TIERS[keyof typeof USER_TIERS];
export type Tense = typeof TENSES[keyof typeof TENSES];
export type Difficulty = typeof DIFFICULTIES[keyof typeof DIFFICULTIES];

/**
 * Linguistic Data Structure
 */
export interface TenseData {
  georgian: string;
  english: string;
  verb: string;
  distractors: string[]; // Standard distractors for Multiple Choice
  audio_url: string;
}

/**
 * Sentence Structure
 * Each sentence maps specific Tenses to their respective linguistic data.
 */
export interface Sentence {
  id: string;
  image_uuid: string;
  tenses: Record<Tense, TenseData>;
}

/**
 * Story Structure
 * The monolithic block fetched at the start of a session.
 */
export interface Story {
  id: string;
  image_uuid: string;
  tier: UserTier;
  sentences: Sentence[];
}

/**
 * Progress Tracking
 * Schema for syncing with the Supabase 'user_progress' table.
 */
export interface UserProgress {
  user_id: string;
  story_id: string;
  tense: Tense;
  difficulty: Difficulty;
  accuracy: number; // (first_try_correct / total_questions) * 100
  completed_at?: string;
}
