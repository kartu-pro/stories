export type UserTier = 'anonymous' | 'free' | 'premium';

export interface TenseData {
  georgian: string;
  english: string;
  verb: string;
  distractors: string[];
  audio_url: string;
}

export interface Sentence {
  id: string;
  image_uuid: string;
  tenses: {
    [key: string]: TenseData;
  };
}

export interface Story {
  id: string;
  image_uuid: string;
  tier: UserTier;
  sentences: Sentence[];
}

export interface UserProgress {
  user_id: string;
  story_id: string;
  tense: string;
  difficulty: 'easy' | 'medium' | 'hard';
  accuracy: number; // Calculated as: ((correct / total) * 100)
}
