import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { Reinvest } from '../entities/reinvest.entity'

interface ReinvestContextProps {
  entries: Reinvest[]
  update: (entries: Reinvest[]) => void
  updated: () => void
}

export const ReinvestContext = createContext({} as ReinvestContextProps)

export function ReinvestContextProvider(props: PropsWithChildren<{}>): JSX.Element {
  const [entries, setEntries] = useState<Reinvest[]>([])

  // Krysh: maybe due to inexperience, but we would need a new render on each target update
  const [renderCount, setRenderCount] = useState(0)
  useEffect(() => {}, [renderCount])

  const context = {
    entries,
    update: (entries: Reinvest[]) => {
      setEntries(entries)
      setRenderCount((renderCount + 1) % 2)
    },
    updated: () => {
      setRenderCount((renderCount + 1) % 2)
    },
  }

  return <ReinvestContext.Provider value={context}>{props.children}</ReinvestContext.Provider>
}

export const ReinvestContextConsumer = ReinvestContext.Consumer
