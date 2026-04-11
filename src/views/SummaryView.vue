<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center p-6">
    <div class="w-full max-w-md text-center mt-12 space-y-4">
      <div class="inline-block p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      </div>
      <h1 class="text-4xl font-black text-slate-900 dark:text-white">Story Complete!</h1>
      <p class="text-slate-500">You've mastered the verbs in <strong>{{ session.currentStory?.title }}</strong>.</p>
    </div>

    <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border dark:border-slate-800 p-8 mt-10">
      <div class="grid grid-cols-2 gap-8">
        <div class="text-center border-r dark:border-slate-800">
          <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Accuracy</div>
          <div class="text-4xl font-black text-indigo-600">{{ session.totalAccuracy }}%</div>
        </div>
        <div class="text-center">
          <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tense</div>
          <div class="text-xl font-bold text-slate-800 dark:text-slate-200 capitalize">{{ session.selectedTense }}</div>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t dark:border-slate-800 space-y-4">
        <div class="flex justify-between text-sm font-medium">
          <span class="text-slate-500">Correct on first try</span>
          <span class="text-slate-900 dark:text-white font-bold">{{ correctCount }}</span>
        </div>
        <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-emerald-500" :style="{ width: `${session.totalAccuracy}%` }"></div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex items-center gap-2 text-sm">
      <div v-if="isSaving" class="flex items-center gap-2 text-slate-400 animate-pulse">
        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        Saving progress...
      </div>
      <div v-else-if="saveError" class="text-red-500 font-medium">Failed to save progress.</div>
      <div v-else class="text-emerald-500 font-medium flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Progress synced to cloud
      </div>
    </div>

    <div class="w-full max-w-md mt-12 space-y-3">
      <button @click="router.push('/library')" class="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-colors">
        Back to Library
      </button>
      <button @click="session.startSession(session.selectedTense, session.difficulty); router.push('/quiz')" class="w-full py-5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border dark:border-slate-800 rounded-3xl font-bold transition-all">
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSessionStore } from '@/stores/useSessionStore';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase'; // Ensure this is initialized

const session = useSessionStore();
const router = useRouter();

const isSaving = ref(false);
const saveError = ref(false);

const correctCount = computed(() => {
  return Object.values(session.firstTryResults).filter(v => v === true).length;
});

const saveProgress = async () => {
  isSaving.value = true;
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        story_id: session.currentStory?.id,
        tense: session.selectedTense,
        accuracy: session.totalAccuracy,
        completed_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (e) {
    console.error(e);
    saveError.value = true;
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  if (session.totalAccuracy > 0) {
    saveProgress();
  }
});
</script>
