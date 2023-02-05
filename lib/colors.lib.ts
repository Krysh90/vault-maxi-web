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
    case 'Unused':
      return '#222'
    default:
      return '#444'
  }
}

export function randomGrayscale(): string {
  const value = (Math.random() * 0xff) | 0
  const grayscale = (value << 16) | (value << 8) | value
  return '#' + grayscale.toString(16)
}
