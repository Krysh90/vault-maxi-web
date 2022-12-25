import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'

export interface Faq {
  id: number
  question: string
  answer: string
  buzzWords: string[]
}

interface FaqContextInterface {
  entries: Faq[]
  filter: (value?: string) => void
}

const FaqContext = createContext<FaqContextInterface>(undefined as any)

export function useFaqContext(): FaqContextInterface {
  return useContext(FaqContext)
}

export function FaqContextProvider(props: PropsWithChildren): JSX.Element {
  const [entries, setEntries] = useState<Faq[]>([])
  const [filter, setFilter] = useState<string>()

  useEffect(() => {
    setEntries([testQuestion1, testQuestion2])
  }, [])

  const context: FaqContextInterface = {
    entries: entries.filter(
      (faq) =>
        !filter ||
        faq.question.toLowerCase().includes(filter) ||
        faq.answer.toLowerCase().includes(filter) ||
        faq.buzzWords.find((v) => v.includes(filter)) != null,
    ),
    filter: (value?: string) => {
      setFilter(value?.toLowerCase())
    },
  }

  return <FaqContext.Provider value={context}>{props.children}</FaqContext.Provider>
}

const testQuestion1: Faq = {
  id: 1,
  question: 'Hello this is an awesome test question?',
  answer:
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  buzzWords: ['statistics', 'income'],
}

const testQuestion2: Faq = {
  id: 2,
  question: 'Hello this is an really long test question?',
  answer:
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr,\nsed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,\nsed diam voluptua.\nAt vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  buzzWords: ['safetyratio', 'safety-ratio', 'safety', 'collateral'],
}
