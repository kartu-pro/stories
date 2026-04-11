// src/api/stories.ts
import { supabase } from '@/supabase';
import { Story } from '@/types';

/**
 * Fetches a story and all its relational children.
 * Filtering by specific Tense/Type is deferred to the Store 
 * to allow mid-session "Lens" swapping without network calls.
 */
export const fetchStoryFullRelational = async (storyId: string): Promise<Story> => {
  const { data, error } = await supabase
    .from('stories')
    .select(`
      id,
      title,
      tier,
      scenes (
        id,
        image_uuid,
        order,
        translations (
          id,
          lang,
          tense,
          full_text,
          audio_url,
          quizzes (
            id,
            type,
            answer,
            hint,
            distractors
          )
        )
      )
    `)
    .eq('id', storyId)
    .order('order', { foreignTable: 'scenes', ascending: true });

  if (error) throw error;
  return data[0] as unknown as Story;
};
