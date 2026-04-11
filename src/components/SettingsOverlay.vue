<template>
  <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border dark:border-slate-700 w-full max-w-sm">
    <h3 class="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Preferences</h3>
    
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-slate-600 dark:text-slate-300">Show Images</span>
        <button 
          @click="config.updateSetting('loadImages', !config.loadImages)"
          :class="config.loadImages ? 'bg-green-500' : 'bg-slate-300'"
          class="w-12 h-6 rounded-full transition-colors relative"
        >
          <span :class="config.loadImages ? 'translate-x-7' : 'translate-x-1'" 
                class="absolute top-1 left-0 w-4 h-4 bg-white rounded-full transition-transform"></span>
        </button>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-slate-600 dark:text-slate-300">Play Audio</span>
        <button 
          @click="config.updateSetting('loadAudio', !config.loadAudio)"
          :class="config.loadAudio ? 'bg-green-500' : 'bg-slate-300'"
          class="w-12 h-6 rounded-full transition-colors relative"
        >
          <span :class="config.loadAudio ? 'translate-x-7' : 'translate-x-1'" 
                class="absolute top-1 left-0 w-4 h-4 bg-white rounded-full transition-transform"></span>
        </button>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-slate-600 dark:text-slate-300">Dark Mode</span>
        <button 
          @click="config.updateSetting('isDarkMode', !config.isDarkMode)"
          :class="config.isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'"
          class="w-12 h-6 rounded-full transition-colors relative"
        >
          <span :class="config.isDarkMode ? 'translate-x-7' : 'translate-x-1'" 
                class="absolute top-1 left-0 w-4 h-4 bg-white rounded-full transition-transform"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/useConfigStore';
const config = useConfigStore();
</script>
