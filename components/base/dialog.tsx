import React from 'react'

export interface DialogProps {
  close: () => void
  children: any
}

export default function Dialog({ close, children }: DialogProps) {
  return (
    <div className="fixed w-screen h-screen bg-[black] bg-opacity-75 top-0 left-0">
      <div className="absolute left-1/2 translate-x-[-50%] top-1/2 translate-y-[-50%] flex justify-center items-center flex-col w-72 rounded-lg shadow-xl h-auto p-2 bg-light">
        {children}
        <div className="flex flex-row gap-4">
          <button
            className="my-5 w-auto px-8 h-10 bg-blue-600 text-white rounded-md shadow hover:shadow-lg font-semibold bg-main"
            onClick={() => close()}
          >
            Add
          </button>
          <button
            className="my-5 w-auto px-8 h-10 bg-blue-600 text-white rounded-md shadow hover:shadow-lg font-semibold bg-dark"
            onClick={() => close()}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}
