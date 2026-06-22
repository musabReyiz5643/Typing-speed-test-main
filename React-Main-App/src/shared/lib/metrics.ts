export function calcWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0
  return Math.round((correctChars / 5) / (elapsedSeconds / 60))
}

export function calcAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped === 0) return 100
  return Math.round((correctChars / totalTyped) * 100)
}

export function countCorrect(typed: string, target: string): number {
  let n = 0
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) n++
  }
  return n
}
