export function colorBasedOn(symbol: string): string {
  switch (symbol) {
    case 'DFI':
      return '#ff00af'
    case 'BTC':
      return '#F7931A'
    case 'ETH':
      return '#627EEA'
    case 'BCH':
      return '#0AC18E'
    case 'LTC':
      return '#345D9D'
    case 'DOGE':
      return '#F3EDD6'
    case 'DUSD':
      return '#FFCCEF'
    case 'USDC':
      return '#2775CA'
    case 'USDT':
      return '#26A17B'
    case 'EUROC':
      return '#F5F5F5'
    case 'Unused':
      return '#222'
    default:
      return '#444444'
  }
}

export function adjustColor(color: string, amount: number): string {
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, (color) =>
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).slice(-2),
      )
  )
}
