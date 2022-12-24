import { createContext, PropsWithChildren, useContext } from 'react'

interface Faq {
  question: string
  answer: string
  buzzWords: string[]
}

interface FaqContextInterface {
  entries: Faq[]
}

const FaqContext = createContext<FaqContextInterface>(undefined as any)

export function useFaqContext(): FaqContextInterface {
  return useContext(FaqContext)
}

export function FaqContextProvider(props: PropsWithChildren): JSX.Element {
  const context: FaqContextInterface = {
    entries: [],
  }

  return <FaqContext.Provider value={context}>{props.children}</FaqContext.Provider>
}
