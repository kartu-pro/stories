import { FEEDBACK_TYPES } from '@/constants';

/**
 * Represents a single character's status in the diff comparison.
 */
export interface DiffResult {
  char: string;
  type: typeof FEEDBACK_TYPES[keyof typeof FEEDBACK_TYPES];
}

/**
 * Compares user input against the target verb using the Longest Common Subsequence (LCS) 
 * algorithm to generate real-time feedback.
 * * @param input - What the user typed or selected.
 * @param expected - The correct target verb.
 * @returns An array of objects containing the character and its match status.
 */
export const getLcsDiff = (input: string, expected: string): DiffResult[] => {
  const n = input.length;
  const m = expected.length;
  
  // Create DP table
  const dp: number[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(m + 1).fill(0));

  // Build the LCS matrix
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (input[i - 1] === expected[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffResult[] = [];
  let i = n;
  let j = m;

  // Backtrack to find the diff sequence
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && input[i - 1] === expected[j - 1]) {
      // Character matches perfectly (Green)
      result.unshift({ char: input[i - 1], type: FEEDBACK_TYPES.MATCH });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // Character is missing from user input (Yellow/Underline)
      result.unshift({ char: expected[j - 1], type: FEEDBACK_TYPES.INSERTION });
      j--;
    } else {
      // User typed an incorrect character (Red)
      result.unshift({ char: input[i - 1], type: FEEDBACK_TYPES.DELETION });
      i--;
    }
  }

  return result;
};
