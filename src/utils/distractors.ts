import letterWeights from './letter-weights.json';

/**
 * Similarity Groups: Phonetic foils based on Georgian linguistic patterns.
 */
const SIMILARITY_GROUPS: string[][] = [
  ['წ', 'ც', 'ძ'],
  ['ჭ', 'ჩ', 'ჯ'],
  ['ყ', 'კ', 'გ'],
  ['თ', 'ტ', 'დ'],
  ['ფ', 'პ', 'ბ'],
  ['ხ', 'ჰ'],
  ['შ', 'ჩ']
];

const DEFAULT_TILE_COUNT = 12;

/**
 * Generates a set of tiles for the Unscramble mode.
 * Preserves duplicate letters from the target verb and adds distractors up to totalTiles.
 */
export function generateDistractors(targetVerb: string, totalTiles: number = DEFAULT_TILE_COUNT): string[] {
  // 1. Start with ALL characters from the verb to handle duplicates (e.g., "ჭამამ" -> ['ჭ','ა','მ','ა','მ'])
  const tiles: string[] = targetVerb.split('');

  // Use a Set specifically for distractors to avoid adding a foil that is already in the verb
  const distractorPool = new Set<string>();

  // 2. Identify potential Phonetic Foils
  tiles.forEach(char => {
    const group = SIMILARITY_GROUPS.find(g => g.includes(char));
    if (group) {
      group.forEach(sibling => {
        // Only add as a distractor if it isn't part of the target verb's required tiles
        if (!tiles.includes(sibling)) {
          distractorPool.add(sibling);
        }
      });
    }
  });

  // 3. Add foils to the main tiles array until we hit the limit or run out of foils
  const foils = Array.from(distractorPool);
  while (tiles.length < totalTiles && foils.length > 0) {
    tiles.push(foils.shift()!);
  }

  // 4. Fill remaining slots with frequency-weighted common letters
  while (tiles.length < totalTiles) {
    const randomChar = getWeightedRandomLetter();
    // Avoid adding a duplicate distractor if possible
    if (!tiles.includes(randomChar) || Math.random() > 0.8) {
      tiles.push(randomChar);
    }
  }

  // 5. Shuffle the final array so the answer isn't in order
  return tiles.sort(() => Math.random() - 0.5);
}

/**
 * Selects a letter based on its frequency in the Georgian language.
 */
function getWeightedRandomLetter(): string {
  const weights = letterWeights as Record<string, number>;
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (const [letter, weight] of Object.entries(weights)) {
    if (random < weight) return letter;
    random -= weight;
  }
  return 'ა';
}
