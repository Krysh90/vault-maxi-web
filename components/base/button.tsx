interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  secondary?: boolean
  small?: boolean
  badge?: number
}

export function Button({ secondary, small, badge, ...props }: ButtonProps): JSX.Element {
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
      {badge && (
        <div className="relative">
          <div className="absolute -top-4 -right-6 rounded-full bg-main border border-white text-xs">
            &nbsp;&nbsp;{badge}&nbsp;&nbsp;
          </div>
        </div>
      )}
      {props.label}
    </button>
  )
}
