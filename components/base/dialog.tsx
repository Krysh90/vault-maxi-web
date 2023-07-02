import React from 'react'

export interface DialogProps {
  isVisible: boolean
  onClose: () => void
  children: any
}

export default function Dialog({ isVisible, onClose, children }: DialogProps): JSX.Element {
  return isVisible ? (
    <>
      <div className="fixed w-screen h-screen bg-[black] bg-opacity-75 top-0 left-0" onClick={onClose} />
      <div className="absolute left-1/2 translate-x-[-50%] top-1/2 translate-y-[-50%] flex justify-center items-center flex-col gap-2 w-3/4 lg:w-1/2 rounded-lg shadow-xl h-auto p-2 bg-dark">
        {children}
      </div>
    </>
  ) : (
    <></>
  )
}
