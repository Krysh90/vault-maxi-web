export interface SpinnerProps {
  text?: string
  small?: boolean
  white?: boolean
}

export function Spinner({ text, small, white }: SpinnerProps): JSX.Element {
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <div
        className={`spinner-border animate-spin inline-block ${
          small ? 'w-5 h-5' : 'w-10 h-10'
        } border-4 border-t-dark rounded-full ${white ? 'text-white' : 'text-main'}`}
        role="status"
      />
      {text && <h3 className="text-white">{text}</h3>}
    </div>
  )
}
