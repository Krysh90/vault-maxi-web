import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { ReinvestTarget } from '../dtos/reinvest-target.dto'

interface ReinvestContextProps {
  targets: ReinvestTarget[]
  update: (targets: ReinvestTarget[]) => void
}

export const ReinvestContext = createContext({} as ReinvestContextProps)

export function ReinvestContextProvider(props: PropsWithChildren<{}>): JSX.Element {
  const [targets, setTargets] = useState<ReinvestTarget[]>([])

  // Krysh: maybe due to inexperience, but we would need a new render on each target update
  const [renderCount, setRenderCount] = useState(0)
  useEffect(() => {}, [renderCount])

  const context = {
    targets,
    update: (targets: ReinvestTarget[]) => {
      setTargets(targets)
      setRenderCount((renderCount + 1) % 2)
    },
  }

  return <ReinvestContext.Provider value={context}>{props.children}</ReinvestContext.Provider>
}

export const ReinvestContextConsumer = ReinvestContext.Consumer
