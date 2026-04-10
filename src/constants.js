// Centralized constants for the Georgian Story App

// Tenses available in the stories
export const TENSES = {
  PRESENT: 'present',
  AORIST: 'aorist',
};

// List of tenses for dropdowns/iteration
export const TENSE_LIST = [TENSES.PRESENT, TENSES.AORIST];

// Difficulty levels
export const DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

// List of difficulties for dropdowns/iteration
export const DIFFICULTY_LIST = [DIFFICULTIES.EASY, DIFFICULTIES.MEDIUM, DIFFICULTIES.HARD];

// Quiz modes
export const QUIZ_MODES = {
  TEXT: 'text',
  UNSCRAMBLE: 'unscramble',
  MULTIPLE_CHOICE: 'multiple-choice',
};

// List of quiz modes for dropdowns/iteration
export const QUIZ_MODE_LIST = [QUIZ_MODES.TEXT, QUIZ_MODES.UNSCRAMBLE, QUIZ_MODES.MULTIPLE_CHOICE];

// Default settings
export const DEFAULT_SETTINGS = {
  TENSE: TENSES.PRESENT,
  DIFFICULTY: DIFFICULTIES.EASY,
  QUIZ_MODE: QUIZ_MODES.TEXT,
};
