import { useEffect } from 'react'
import { useTestStore } from '../store/useTestStore'

export function useTimer() {
  const status = useTestStore((s) => s.status)
  const tick = useTestStore((s) => s.tick)

  useEffect(() => {
    if (status !== 'STARTED') return
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [status, tick])
}
