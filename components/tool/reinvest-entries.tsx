import React, { useEffect, useState } from 'react'
import { ReinvestTarget } from '../../dtos/reinvest-target.dto'
import Dialog from './dialog'

export interface ReinvestEntriesProps {
  entries: ReinvestTarget[]
  setEntries: (entries: ReinvestTarget[]) => void
}

export default function ReinvestEntries({ entries, setEntries }: ReinvestEntriesProps) {
  const [isDialogShown, setDialogShown] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-2">
        {entries.map((entry, key) => (
          <Entry key={key}>{`${entry.name} asdfasdfasdfasdfasdfafsafasdfasdfasdfasdfasdfsdfasdfsdf`}</Entry>
        ))}
        <AddEntry add={() => setDialogShown(true)}></AddEntry>
      </div>

      {isDialogShown && (
        <Dialog
          close={(target) => {
            if (target) setEntries(entries.concat(target))
            setDialogShown(false)
          }}
        >
          <p>hey just a test</p>
        </Dialog>
      )}
    </>
  )
}

function Entry({ children }: { children: any }) {
  return <div className="bg-light h-12 flex flex-row rounded-full w-full items-center p-4">{children}</div>
}

function AddEntry({ add }: { add: () => void }) {
  return (
    <Entry>
      <button className="w-full" onClick={add}>
        <div className="w-8 h-8 bg-main rounded-full ml-auto mr-auto text-[2rem] leading-[1.8rem]">+</div>
      </button>
    </Entry>
  )
}
