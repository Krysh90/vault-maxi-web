interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  secondary?: boolean
  small?: boolean
}

export function Button({ secondary, small, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      className={[
        secondary
          ? 'text-sm text-code'
          : 'rounded-lg bg-main text-lg disabled:bg-light'.concat(small ? ' px-2 py-1' : ' px-4 py-2'),
        props.className,
      ].join(' ')}
    >
      {props.label}
    </button>
  )
}
