<template>
  <div class="flex flex-col items-center gap-8 w-full">
    
    <div class="flex flex-wrap justify-center gap-2 min-h-[64px] p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 w-full">
      <transition-group name="tile-list">
        <button
          v-for="tile in selectedTiles"
          :key="tile.id"
          @click="deselectTile(tile)"
          class="px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xl shadow-md transform transition-all active:scale-90"
        >
          {{ tile.char }}
        </button>
      </transition-group>
    </div>

    <div class="flex flex-wrap justify-center gap-3">
      <button
        v-for="tile in pool"
        :key="tile.id"
        @click="selectTile(tile)"
        :disabled="tile.used"
        :class="[
          tile.used 
            ? 'opacity-0 pointer-events-none scale-75' 
            : 'opacity-100 scale-100 hover:border-indigo-500 shadow-sm'
        ]"
        class="px-5 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-2xl transition-all duration-300"
      >
        {{ tile.char }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useSessionStore } from '@/stores/useSessionStore';
import { generateDistractors } from '@/utils/distractors'; // You can move logic here if preferred

const session = useSessionStore();

interface Tile {
  id: number;
  char: string;
  used: boolean;
}

const pool = ref<Tile[]>([]);
const selectedTiles = ref<Tile[]>([]);

const initTiles = () => {
  const target = session.currentSentenceData?.verb || '';
  const rawChars = generateDistractors(target);
  pool.value = rawChars.map((char, index) => ({
    id: index,
    char,
    used: false
  }));
  selectedTiles.value = [];
  session.userInput = '';
};

const selectTile = (tile: Tile) => {
  tile.used = true;
  selectedTiles.value.push(tile);
  updateStore();
};

const deselectTile = (tile: Tile) => {
  tile.used = false;
  selectedTiles.value = selectedTiles.value.filter(t => t.id !== tile.id);
  updateStore();
};

const updateStore = () => {
  session.userInput = selectedTiles.value.map(t => t.char).join('');
};

// Re-init if sentence changes
watch(() => session.currentSentenceIndex, initTiles);
onMounted(initTiles);
</script>

<style scoped>
.tile-list-enter-active,
.tile-list-leave-active {
  transition: all 0.3s ease;
}
.tile-list-enter-from,
.tile-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
