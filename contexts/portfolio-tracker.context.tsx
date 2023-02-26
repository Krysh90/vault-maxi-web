import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { useStore } from '../hooks/store.hook'

interface PortfolioTrackerContextInterface {
  addresses: string[]
  loadAddresses: (addresses: string[]) => Promise<void>
}

const PortfolioTrackerContext = createContext<PortfolioTrackerContextInterface>(undefined as any)

export function usePortfolioTrackerContext(): PortfolioTrackerContextInterface {
  return useContext(PortfolioTrackerContext)
}

export function PortfolioTrackerContextProvider(props: PropsWithChildren): JSX.Element {
  const store = useStore()
  const [addresses, setAddresses] = useState<string[]>([])

  useEffect(() => {
    setAddresses(store.addresses.get() ?? [])
  }, [setAddresses, store])

  async function loadAddresses(addresses: string[]): Promise<void> {}

  const context = useMemo(() => ({ addresses, loadAddresses }), [addresses])

  return <PortfolioTrackerContext.Provider value={context}>{props.children}</PortfolioTrackerContext.Provider>
}
