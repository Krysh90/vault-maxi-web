import { Faq, useFaqContext } from '../../contexts/faq.context'
import ThemedSearch from '../base/themed-search'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

interface FaqContentProps {
  content: Faq[]
}

export function FaqContent({ content }: FaqContentProps): JSX.Element {
  const { entries, filter, loaded } = useFaqContext()

  useEffect(() => {
    loaded(content)
  }, [content, loaded])

  return (
    <>
      <div className="w-full flex justify-end py-4 lg:py-0 lg:-translate-y-[2.75rem]">
        <ThemedSearch onChange={filter} />
      </div>
      <div className="flex flex-col w-full gap-2">
        {entries?.map((faq) => (
          <FaqEntry faq={faq} key={faq.id} />
        ))}
      </div>
    </>
  )
}

export function FaqEntry({ faq }: { faq: Faq }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <button onClick={() => setIsOpen(!isOpen)} className="w-full">
      <div className={`bg-light rounded-lg ${isOpen ? '' : 'md:h-12'} w-full px-2 py-1`}>
        <div className="rounded-lg w-full h-full flex flex-row items-center gap-2">
          <FontAwesomeIcon
            className="px-2 w-4"
            icon={isOpen ? faChevronDown : faChevronRight}
            size={'sm'}
            color="#ff00af"
          />
          <div
            className={`w-full min-h-[2.5rem] ${
              isOpen ? 'rounded-t-lg' : 'rounded-lg'
            } bg-dark flex flex-row items-center px-2 text-lg`}
          >
            {faq.question}
          </div>
        </div>

        {isOpen && (
          <div className="bg-dark flex flex-col flex-grow-0 flex-shrink-0 gap-2 whitespace-pre-line items-start text-sm rounded-b-lg border-t border-light p-2 text-start ml-[2.45rem]">
            <ReactMarkdown>{faq.answer}</ReactMarkdown>
          </div>
        )}
      </div>
    </button>
  )
}
