import { useState } from 'react'
import Selection from './selection'

interface PagerProps {
  pages: Map<string, JSX.Element>
  initialPage?: string
}

export function Pager({ pages, initialPage }: PagerProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState<string>(initialPage ?? Array.from(pages.keys())[0])
  return (
    <>
      <Selection items={Array.from(pages.keys())} onChanged={setCurrentPage} selectedItem={currentPage} border />
      {pages.get(currentPage)}
    </>
  )
}
