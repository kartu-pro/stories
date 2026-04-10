import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient' // Assuming supabase client is configured in lib/supabaseClient.ts

const stories = ref([])
const loading = ref(false)
const error = ref(null)

export function useApi() {
  const fetchStories = async () => {
    loading.value = true
    error.value = null
    try {
      // Fetch all stories initially. Replace with actual Supabase table/query.
      // Example: const { data, error: fetchError } = await supabase.from('stories').select('*')
      const { data, error: fetchError } = await supabase.from('stories').select('*')

      if (fetchError) throw fetchError
      stories.value = data || []
    } catch (err) {
      console.error("Error fetching stories:", err)
      error.value = err
      stories.value = [] // Clear stories on error
    } finally {
      loading.value = false
    }
  }

  const fetchStoryById = async (storyId: string) => {
    loading.value = true
    error.value = null
    try {
      // Fetch a specific story by ID. Replace with actual Supabase table/query.
      // Example: const { data, error: fetchError } = await supabase.from('stories').select('*').eq('id', storyId).single()
      const { data, error: fetchError } = await supabase.from('stories').select('*').eq('id', storyId).single()

      if (fetchError) throw fetchError
      return data // Return the single story object
    } catch (err) {
      console.error(`Error fetching story with ID ${storyId}:`, err)
      error.value = err
      return null // Return null on error
    } finally {
      loading.value = false
    }
  }

  return {
    stories,
    loading,
    error,
    fetchStories,
    fetchStoryById,
  }
}
