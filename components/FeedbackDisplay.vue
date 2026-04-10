<template>
  <div class="feedback-display">
    <p v-for="(item, index) in feedback" :key="index" :class="item.type">
      {{ item.char }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getLcsDiff } from '@/utils/diff'; // Ensure the path is correct

interface Props {
  expected: string;
  actual: string;
}

const props = defineProps<Props>();

const feedback = computed(() => {
  return getLcsDiff(props.expected, props.actual);
});
</script>

<style scoped>
.feedback-display {
  display: flex;
  flex-wrap: wrap;
  font-size: 1.2em;
  margin-top: 10px;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.feedback-display p {
  margin: 0 2px;
  padding: 2px 4px;
  border-radius: 3px;
  line-height: 1.4;
}

.match {
  color: green;
  background-color: #e6ffed;
}

.insertion {
  color: blue; /* Typically indicate something added */
  background-color: #e6f7ff;
  text-decoration: underline;
}

.deletion {
  color: red; /* Typically indicate something removed or incorrect */
  background-color: #ffe6e6;
  text-decoration: line-through;
}
</style>
