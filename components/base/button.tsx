interface ButtonProps {
  title: string
  onClick: () => void
  style: ButtonStyle
}

export enum ButtonStyle {
  PRIMARY,
  SECONDARY,
}

export function Button({ title, onClick, style }: ButtonProps): JSX.Element {
  function tailwindFor(style: ButtonStyle): string {
    const defaultStyle = 'px-4 py-2 rounded'
    switch (style) {
      case ButtonStyle.PRIMARY:
        return `${defaultStyle} bg-main`
      case ButtonStyle.SECONDARY:
        return `${defaultStyle} bg-info`
      default:
        return defaultStyle
    }
  }

  return (
    <button className={tailwindFor(style)} onClick={onClick}>
      {title}
    </button>
  )
}
