export interface SpinnerProps {
  text: string
}

export function Spinner({ text }: SpinnerProps): JSX.Element {
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <div
        className="spinner-border animate-spin inline-block w-10 h-10 border-4 border-t-dark rounded-full text-main"
        role="status"
      />
      <h3 className="text-white">{text}</h3>
    </div>
  )
}
