/**
 * Computes the Longest Common Subsequence (LCS) between two strings.
 * Returns an array of operations: 'equal', 'insert', 'delete'.
 */
export function computeLCS(s1: string, s2: string): ('equal' | 'insert' | 'delete')[] {
  const m = s1.length
  const n = s2.length
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0))

  // Build the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to find the operations
  const operations: ('equal' | 'insert' | 'delete')[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
      operations.push('equal')
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1])) {
      operations.push('insert')
      j--
    } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j])) {
      operations.push('delete')
      i--
    }
  }

  return operations.reverse()
}

/**
 * Generates diff highlighting information based on LCS operations.
 * Returns an array of objects, each indicating the type of segment and its text.
 */
export function generateDiff(s1: string, s2: string): { type: 'equal' | 'insert' | 'delete'; text: string }[] {
  const operations = computeLCS(s1, s2)
  const diff: { type: 'equal' | 'insert' | 'delete'; text: string }[] = []

  let currentOp: 'equal' | 'insert' | 'delete' | null = null
  let currentText = ''
  let s1Index = 0
  let s2Index = 0

  operations.forEach(op => {
    if (op === 'equal') {
      if (currentOp === 'equal') {
        currentText += s1[s1Index]
      } else {
        if (currentOp !== null) diff.push({ type: currentOp, text: currentText })
        currentOp = 'equal'
        currentText = s1[s1Index]
      }
      s1Index++
      s2Index++
    } else if (op === 'insert') {
      if (currentOp === 'insert') {
        currentText += s2[s2Index]
      } else {
        if (currentOp !== null) diff.push({ type: currentOp, text: currentText })
        currentOp = 'insert'
        currentText = s2[s2Index]
      }
      s2Index++
    } else if (op === 'delete') {
      if (currentOp === 'delete') {
        currentText += s1[s1Index]
      } else {
        if (currentOp !== null) diff.push({ type: currentOp, text: currentText })
        currentOp = 'delete'
        currentText = s1[s1Index]
      }
      s1Index++
    }
  })

  if (currentOp !== null) {
    diff.push({ type: currentOp, text: currentText })
  }

  // Post-processing to merge adjacent identical operations if any
  const mergedDiff: { type: 'equal' | 'insert' | 'delete'; text: string }[] = []
  if (diff.length > 0) {
    mergedDiff.push(diff[0])
    for (let i = 1; i < diff.length; i++) {
      if (diff[i].type === mergedDiff[mergedDiff.length - 1].type) {
        mergedDiff[mergedDiff.length - 1].text += diff[i].text
      } else {
        mergedDiff.push(diff[i])
      }
    }
  }

  return mergedDiff
}
