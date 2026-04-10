import letterWeights from './letter-weights.json';

/**
 * Similarity Groups: If the verb contains ANY letter in a sub-array,
 * the other letters in that sub-array are candidates for distractors.
 */
const SIMILARITY_GROUPS = [
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
 * @param targetVerb The correct Georgian verb
 * @param totalTiles Total number of tiles to return (Default: 12)
 */
export function generateDistractors(targetVerb: string, totalTiles: number = DEFAULT_TILE_COUNT): string[] {
  const targetChars = targetVerb.split('');
  const tileSet = new Set<string>(targetChars);

  // 1. Add Bidirectional Phonetic Foils
  targetChars.forEach(char => {
    const group = SIMILARITY_GROUPS.find(g => g.includes(char));
    if (group) {
      group.forEach(sibling => {
        if (tileSet.size < totalTiles) tileSet.add(sibling);
      });
    }
  });

  // 2. Frequency-Based Weighting for remaining slots
  while (tileSet.size < totalTiles) {
    const randomChar = getWeightedRandomLetter();
    tileSet.add(randomChar);
  }

  // Convert to array and shuffle
  return Array.from(tileSet).sort(() => Math.random() - 0.5);
}

function getWeightedRandomLetter(): string {
  const totalWeight = Object.values(letterWeights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (const [letter, weight] of Object.entries(letterWeights)) {
    if (random < weight) return letter;
    random -= weight;
  }
  return 'ა';
}
