interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  secondary?: boolean
}

export function Button({ secondary, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      className={[
        secondary ? 'text-sm text-code' : 'rounded-lg bg-main px-4 py-2 text-lg disabled:bg-light',
        props.className,
      ].join(' ')}
    >
      {props.label}
    </button>
  )
}
