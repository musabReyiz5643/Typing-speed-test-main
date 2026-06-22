import { create } from 'zustand'
import { calcAccuracy, calcWpm, countCorrect } from '../../../shared/lib/metrics'
import { TIMED_DURATION } from '../constants'

export type Status = 'NOT_STARTED' | 'STARTED' | 'COMPLETED'
export type Mode = 'TIMED' | 'PASSAGE'
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
export type ResultType = 'FIRST' | 'HIGHSCORE' | 'COMPLETED'

const STORAGE_KEY = 'speedtype_best_wpm'

interface TestState {
  status: Status
  mode: Mode
  difficulty: Difficulty
  wpm: number
  accuracy: number
  time: number
  typedCharacters: string
  targetText: string
  bestWPM: number
  resultType: ResultType | null
  startedAt: number | null

  start: () => void
  reset: () => void
  complete: () => void
  setMode: (mode: Mode) => void
  setDifficulty: (difficulty: Difficulty) => void
  setTargetText: (text: string) => void
  appendChar: (char: string) => void
  backspace: () => void
  tick: () => void
  updateMetrics: () => void
  commitBestWPM: () => void
}

function loadBestWPM(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const n = parseInt(stored ?? '', 10)
    return Number.isFinite(n) && n >= 0 ? n : 0
  } catch {
    return 0
  }
}

function computeMetrics(
  typedCharacters: string,
  targetText: string,
  startedAt: number | null,
): { wpm: number; accuracy: number } {
  const elapsedSeconds = startedAt == null ? 0 : (performance.now() - startedAt) / 1000
  const correct = countCorrect(typedCharacters, targetText)
  return {
    wpm: elapsedSeconds < 1 ? 0 : calcWpm(correct, elapsedSeconds),
    accuracy: calcAccuracy(correct, typedCharacters.length),
  }
}

export const useTestStore = create<TestState>((set, get) => ({
  status: 'NOT_STARTED',
  mode: 'TIMED',
  difficulty: 'MEDIUM',
  wpm: 0,
  accuracy: 100,
  time: TIMED_DURATION,
  typedCharacters: '',
  targetText: '',
  bestWPM: loadBestWPM(),
  resultType: null,
  startedAt: null,

  start: () => set({ status: 'STARTED', startedAt: performance.now() }),

  reset: () => {
    const { mode } = get()
    set({
      status: 'NOT_STARTED',
      typedCharacters: '',
      wpm: 0,
      accuracy: 100,
      time: mode === 'TIMED' ? TIMED_DURATION : 0,
      resultType: null,
      startedAt: null,
    })
  },

  complete: () => {
    const { typedCharacters, targetText, bestWPM, status, startedAt } = get()
    if (status !== 'STARTED') return
    const { wpm, accuracy } = computeMetrics(typedCharacters, targetText, startedAt)
    const resultType: ResultType =
      bestWPM === 0 ? 'FIRST' : wpm > bestWPM ? 'HIGHSCORE' : 'COMPLETED'
    set({ status: 'COMPLETED', wpm, accuracy, resultType })
  },

  setMode: (mode) => {
    if (get().status === 'STARTED') return
    set({ mode, time: mode === 'TIMED' ? TIMED_DURATION : 0 })
    get().reset()
  },

  setDifficulty: (difficulty) => {
    if (get().status === 'STARTED') return
    set({ difficulty })
    get().reset()
  },

  setTargetText: (text) => set({ targetText: text }),

  appendChar: (char) => {
    const { typedCharacters, targetText } = get()
    if (typedCharacters.length >= targetText.length) return
    const next = typedCharacters + char
    set({ typedCharacters: next })
    if (next.length >= targetText.length) {
      get().complete()
    }
  },

  backspace: () => {
    const { typedCharacters } = get()
    set({ typedCharacters: typedCharacters.slice(0, -1) })
  },

  tick: () => {
    const { status, mode, time } = get()
    if (status !== 'STARTED') return
    if (mode === 'TIMED') {
      const newTime = time - 1
      if (newTime <= 0) {
        set({ time: 0 })
        get().complete()
      } else {
        set({ time: newTime })
      }
    } else {
      set({ time: time + 1 })
    }
  },

  updateMetrics: () => {
    const { typedCharacters, targetText, startedAt } = get()
    const { wpm, accuracy } = computeMetrics(typedCharacters, targetText, startedAt)
    set({ wpm, accuracy })
  },

  commitBestWPM: () => {
    const { wpm } = get()
    try {
      localStorage.setItem(STORAGE_KEY, String(wpm))
    } catch {
      // storage unavailable (private mode, sandbox)
    }
    set({ bestWPM: wpm })
  },
}))
