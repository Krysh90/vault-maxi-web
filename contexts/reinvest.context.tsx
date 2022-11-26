import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { Reinvest } from '../entities/reinvest.entity'

interface ReinvestContextInterface {
  entries: Reinvest[]
  updateEntries: (entries: Reinvest[]) => void
  updated: () => void
}

const ReinvestContext = createContext<ReinvestContextInterface>(undefined as any)

export function useReinvestContext(): ReinvestContextInterface {
  return useContext(ReinvestContext)
}

export function ReinvestContextProvider(props: PropsWithChildren): JSX.Element {
  const [entries, setEntries] = useState<Reinvest[]>([])

  // Krysh: maybe due to inexperience, but we would need a new render on each target update
  const [renderCount, setRenderCount] = useState(0)
  useEffect(() => {}, [renderCount])

  const context = {
    entries,
    updateEntries: (entries: Reinvest[]) => {
      setEntries(entries)
      setRenderCount((renderCount + 1) % 2)
    },
    updated: () => {
      setRenderCount((renderCount + 1) % 2)
    },
  }

  return <ReinvestContext.Provider value={context}>{props.children}</ReinvestContext.Provider>
}
