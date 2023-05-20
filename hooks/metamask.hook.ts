import Web3 from 'web3'
import { Buffer } from 'buffer'
import ERC20_ABI from '../lib/erc20.abi.json'
import { useMemo } from 'react'
import { floppy } from '../lib/meta-chain-network.lib'

export interface MetaMaskInterface {
  isInstalled: boolean
  register: (onAccountChanged: (account?: string) => void, onChainChanged: (chain?: number) => void) => void
  requestAccount: () => Promise<string | undefined>
  requestChain: () => Promise<number | undefined>
  requestChangeToChain: (chain?: number) => Promise<void>
  requestBalance: (account: string) => Promise<string | undefined>
  sign: (address: string, message: string) => Promise<string>
  addContract: (address: string, svgData: string) => Promise<boolean>
}

interface MetaMaskError {
  code: number
  message: string
}

export interface MetaMaskChainInterface {
  chainId: number
  chainName: string
  nativeCurrency: { name: string; symbol: string; decimals: number }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

export function useMetaMask(): MetaMaskInterface {
  const { ethereum } = window as any
  const web3 = new Web3(Web3.givenProvider)

  const isInstalled = Boolean(ethereum && ethereum.isMetaMask)

  function register(onAccountChanged: (account?: string) => void, onChainChanged: (chain?: number) => void) {
    web3.eth.getAccounts((_err, accounts) => {
      onAccountChanged(verifyAccount(accounts))
    })
    web3.eth.getChainId((_err, chainId) => {
      onChainChanged(chainId)
    })
    ethereum?.on('accountsChanged', (accounts: string[]) => {
      onAccountChanged(verifyAccount(accounts))
    })
    ethereum?.on('chainChanged', (chainId: string) => {
      onChainChanged(Number(chainId))
      // Following is a recommendation of metamask documentation. I am not sure, if we will need it.
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      // window.location.reload();
    })
  }

  async function requestAccount(): Promise<string | undefined> {
    return verifyAccount(await web3.eth.requestAccounts())
  }

  async function requestChain(): Promise<number | undefined> {
    return await web3.eth.getChainId()
  }

  async function requestChangeToChain(id?: number): Promise<void> {
    if (!id) return
    const chainId = web3.utils.toHex(id)
    return new Promise((resolve, reject) => {
      ethereum
        .sendAsync(
          {
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
          },
          (e?: MetaMaskError) => {
            // 4902 chain is not yet added to MetaMask, therefore add chainId to MetaMask
            if (e && e.code === 4902 && id === 1132) {
              reject('could not switch')
            }
          },
        )
        ?.then(resolve)
    })
  }

  async function requestAddChainId(): Promise<void> {
    return ethereum.sendAsync({
      method: 'wallet_addEthereumChain',
      params: [toChainObject()],
    })
  }

  async function requestBalance(account: string): Promise<string | undefined> {
    return web3.eth.getBalance(account)
  }

  async function sign(address: string, message: string): Promise<string> {
    return web3.eth.personal.sign(message, address, '')
  }

  async function addContract(address: string, svgData: string): Promise<boolean> {
    const tokenContract = new web3.eth.Contract(ERC20_ABI as any, address)

    const symbol = await tokenContract.methods.symbol().call()
    const decimals = await tokenContract.methods.decimals().call()

    return ethereum.sendAsync({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals,
          image: `data:image/svg+xml;base64,${Buffer.from(svgData).toString('base64')}`,
        },
      },
      id: Math.round(Math.random() * 10000),
    })
  }

  function verifyAccount(accounts: string[]): string | undefined {
    if ((accounts?.length ?? 0) <= 0) return undefined
    // check if address is valid
    return Web3.utils.toChecksumAddress(accounts[0])
  }

  function toChainObject(): MetaMaskChainInterface {
    return floppy
  }

  return useMemo(
    () => ({
      isInstalled,
      register,
      requestAccount,
      requestChain,
      requestChangeToChain,
      requestBalance,
      sign,
      addContract,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isInstalled],
  )
}
