import { useQuery } from '@tanstack/react-query'

interface Passage {
  id: string
  text: string
}

interface PassagesData {
  easy: Passage[]
  medium: Passage[]
  hard: Passage[]
}

async function fetchPassages(): Promise<PassagesData> {
  const res = await fetch('/data.json')
  if (!res.ok) throw new Error('Failed to fetch passages')
  return res.json()
}

export function usePassages() {
  return useQuery<PassagesData>({
    queryKey: ['passages'],
    queryFn: fetchPassages,
    staleTime: Infinity,
  })
}
