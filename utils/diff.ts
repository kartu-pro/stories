/**
 * Computes the Longest Common Subsequence (LCS) and generates diff operations.
 * Returns an array of objects, each indicating the character and its type: 'match', 'insertion', 'deletion'.
 */
export const getLcsDiff = (s1: string, s2: string): { char: string; type: 'match' | 'insertion' | 'deletion' }[] => {
  const n = s1.length;
  const m = s2.length;
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));

  // Build the DP table
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find the operations
  let i = n;
  let j = m;
  const result: { char: string; type: 'match' | 'insertion' | 'deletion' }[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
      result.unshift({ char: s1[i - 1], type: 'match' });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // If j > 0 and either i is 0 (meaning we've exhausted s1)
      // or the value from inserting into s1 (dp[i][j-1]) is greater than or equal to
      // the value from deleting from s1 (dp[i-1][j]), we treat it as an insertion.
      result.unshift({ char: s2[j - 1], type: 'insertion' });
      j--;
    } else if (i > 0 && (j === 0 || dp[i - 1][j] > dp[i][j - 1])) {
      // If i > 0 and either j is 0 (meaning we've exhausted s2)
      // or the value from deleting from s1 (dp[i-1][j]) is greater than
      // the value from inserting into s1 (dp[i][j-1]), we treat it as a deletion.
      result.unshift({ char: s1[i - 1], type: 'deletion' });
      i--;
    } else {
        // This case should ideally not be reached if the DP table is built correctly,
        // but as a fallback, we can prioritize deletion if both paths yield the same LCS length.
        result.unshift({ char: s1[i - 1], type: 'deletion' });
        i--;
    }
  }
  return result;
};
