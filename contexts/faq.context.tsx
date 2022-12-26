import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'

export interface Faq {
  id: number
  question: string
  answer: string
  buzzWords: string[]
}

interface FaqContextInterface {
  entries: Faq[]
  loaded: (entries: Faq[]) => void
  filter: (value?: string) => void
}

const FaqContext = createContext<FaqContextInterface>(undefined as any)

export function useFaqContext(): FaqContextInterface {
  return useContext(FaqContext)
}

export function FaqContextProvider(props: PropsWithChildren): JSX.Element {
  const [entries, setEntries] = useState<Faq[]>([])
  const [filter, setFilter] = useState<string>()

  const context: FaqContextInterface = {
    entries: entries?.filter(
      (faq) =>
        !filter ||
        containsOne(filter, faq.question.toLowerCase()) ||
        containsOne(filter, faq.answer.toLowerCase()) ||
        containsOne(filter, faq.buzzWords),
    ),
    filter: (value?: string) => {
      setFilter(value?.toLowerCase())
    },
    loaded: setEntries,
  }

  function containsOne(needle: string, haystack: string | string[]): boolean {
    return needle
      ?.split(' ')
      .map((v) => haystack.includes(v))
      .includes(true)
  }

  return <FaqContext.Provider value={context}>{props.children}</FaqContext.Provider>
}
