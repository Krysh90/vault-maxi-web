import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { Reinvest } from '../entities/reinvest.entity'
import { toTotalValue } from '../lib/reinvest.lib'

interface ReinvestContextInterface {
  entries: Reinvest[]
  updateEntries: (entries: Reinvest[]) => void
  updated: () => void
  showWarning: boolean
  warning?: string
  showInfo: boolean
  info?: string
}

const ReinvestContext = createContext<ReinvestContextInterface>(undefined as any)

export function useReinvestContext(): ReinvestContextInterface {
  return useContext(ReinvestContext)
}

export function ReinvestContextProvider(props: PropsWithChildren): JSX.Element {
  const [entries, setEntries] = useState<Reinvest[]>([])
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [warning, setWarning] = useState<string>()
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [info, setInfo] = useState<string>()

  const warningAboveMax = 'Please review your targets, currently you are above 100%'
  const warningInvalidTarget = 'Please review your targets, one destination is invalid'

  // Krysh: maybe due to inexperience, but we would need a new render on each target update
  const [renderCount, setRenderCount] = useState(0)
  useEffect(() => {}, [renderCount])

  function updateEntries(entries: Reinvest[]) {
    setEntries(entries)
    updated(entries)
  }

  function updated(inputEntries?: Reinvest[]) {
    setRenderCount((renderCount + 1) % 2)
    const entriesToCheck = inputEntries ?? entries
    const total = toTotalValue(entriesToCheck)
    const hasAFillTarget = entriesToCheck.filter((r) => r.value === 0).length > 0
    const isAbove100 = total > 100
    const hasOneInvalidTarget = entriesToCheck.filter((r) => !r.isTargetValid()).length > 0
    setShowWarning(isAbove100 || hasOneInvalidTarget)
    if (isAbove100) setWarning(warningAboveMax)
    else if (hasOneInvalidTarget) setWarning(warningInvalidTarget)
    else setWarning(undefined)

    const hasUnused = total < 100 && !hasAFillTarget
    setShowInfo(hasUnused)
    setInfo(hasUnused ? `You still have ${100 - total}% unused. Add a new target or change one to fill` : undefined)
  }

  const context = {
    entries,
    updateEntries,
    updated,
    showWarning,
    warning,
    showInfo,
    info,
  }

  return <ReinvestContext.Provider value={context}>{props.children}</ReinvestContext.Provider>
}
