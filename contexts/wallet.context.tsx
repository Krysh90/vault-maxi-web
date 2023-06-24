import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { useMetaMask } from '../hooks/metamask.hook'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'

interface WalletInterface {
  address?: string
  chain?: number
  block?: number
  balance?: BigNumber
  isInstalled: boolean
  isConnected: boolean
  connect: () => Promise<string>
  signMessage: (message: string, address: string) => Promise<string>
}

const WalletContext = createContext<WalletInterface>(undefined as any)

export function useWalletContext(): WalletInterface {
  return useContext(WalletContext)
}

export function WalletContextProvider(props: PropsWithChildren): JSX.Element {
  const [address, setAddress] = useState<string>()
  const [chain, setChain] = useState<number>()
  const [block, setBlock] = useState<number>()
  const [balance, setBalance] = useState<BigNumber>()
  const { isInstalled, verifyAccount, requestAccount, requestChain, requestBalance, sign } = useMetaMask()
  const web3 = new Web3(Web3.givenProvider)
  const { ethereum } = window as any

  const isConnected = address !== undefined

  useEffect(() => {
    web3.eth.getAccounts((_err, accounts) => {
      setAddress(verifyAccount(accounts))
    })
    web3.eth.getChainId((_err, chainId) => {
      setChain(chainId)
    })
    web3.eth.getBlockNumber((_err, block) => {
      setBlock(block)
    })
    ethereum?.on('accountsChanged', (accounts: string[]) => {
      setAddress(verifyAccount(accounts))
    })
    ethereum?.on('chainChanged', (chainId: string) => {
      setChain(Number(chainId))
      // Following is a recommendation of metamask documentation. I am not sure, if we will need it.
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      // window.location.reload();
    })
    web3.eth.subscribe('newBlockHeaders', (_err, blockHeader) => {
      setBlock(blockHeader.number)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (address) {
      requestBalance(address).then((balance) => {
        if (balance && chain) {
          setBalance(new BigNumber(web3.utils.fromWei(balance, 'ether')).decimalPlaces(8))
        } else {
          setBalance(undefined)
        }
      })
    } else {
      setBalance(undefined)
    }
  }, [address, chain, requestBalance])

  async function connect(): Promise<string> {
    const account = await requestAccount()
    if (!account) throw new Error('Permission denied or account not verified')
    setAddress(account)
    setChain(await requestChain())
    return account
  }

  async function signMessage(message: string, address: string): Promise<string> {
    try {
      return await sign(address, message)
    } catch (e: any) {
      // TODO (Krysh): real error handling
      // {code: 4001, message: 'User rejected the request.'} = requests accounts cancel
      // {code: 4001, message: 'MetaMask Message Signature: User denied message signature.'} = login signature cancel
      console.error(e.message, e.code)
      throw e
    }
  }

  const context: WalletInterface = useMemo(
    () => ({
      address,
      balance,
      chain,
      block,
      isInstalled,
      isConnected,
      connect,
      signMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, balance, chain, block, isInstalled, isConnected],
  )

  return <WalletContext.Provider value={context}>{props.children}</WalletContext.Provider>
}
