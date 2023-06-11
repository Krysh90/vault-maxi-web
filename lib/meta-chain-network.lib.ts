import { MetaMaskChainInterface } from '../hooks/metamask.hook'

export const floppy: MetaMaskChainInterface = {
  chainId: 1132,
  chainName: 'MetaChain (Floppy)',
  nativeCurrency: {
    name: 'DFI',
    symbol: 'dfi',
    decimals: 8,
  },
  rpcUrls: ['http://35.187.53.161:20551'],
  blockExplorerUrls: [],
}

export const changi: MetaMaskChainInterface = {
  chainId: 1133,
  chainName: 'MetaChain (Changi)',
  nativeCurrency: {
    name: 'DFI',
    symbol: 'dfi',
    decimals: 8,
  },
  rpcUrls: ['http://35.187.53.161:20551'],
  blockExplorerUrls: [],
}

// TODO: add testnet and mainnet DMC as soon as ready
