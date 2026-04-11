/**
 * LINGUISTIC CONSTANTS
 * Used for session state and filtering story data.
 */
export const TENSES = {
  PRESENT: 'present',
  AORIST: 'aorist',
} as const;

/**
 * DIFFICULTY CONSTANTS
 * Maps to specific quiz modes (Multiple Choice, Unscramble, TextInput).
 */
export const DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

// Add to src/constants.ts
export const DIFFICULTY_METADATA = {
  [DIFFICULTIES.EASY]: {
    label: 'Easy',
    description: 'Multiple Choice'
  },
  [DIFFICULTIES.MEDIUM]: {
    label: 'Medium',
    description: 'Unscramble Letter Tiles'
  },
  [DIFFICULTIES.HARD]: {
    label: 'Hard',
    description: 'Type the Answer'
  }
} as const;

/**
 * ACCESS & AUTH CONSTANTS
 * Matches the 'user_profiles' and 'stories' table schema in Supabase.
 */
export const USER_TIERS = {
  ANONYMOUS: 'anonymous',
  FREE: 'free',
  PREMIUM: 'premium',
} as const;

/**
 * UI & UX CONSTANTS
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  ONE: '1',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
} as const;


export const FEEDBACK_TYPES = {
  MATCH: 'match',       // Correct (Green)
  DELETION: 'deletion', // Error (Red)
  INSERTION: 'insertion' // Missing (Yellow/Underline)
} as const;
