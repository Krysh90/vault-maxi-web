import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { useMetaMask } from '../hooks/metamask.hook'

interface WalletInterface {
  address?: string
  chain?: number
  balance?: string
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
  const [balance, setBalance] = useState<string>()
  const { isInstalled, register, requestAccount, requestChain, requestBalance, sign } = useMetaMask()

  const isConnected = address !== undefined

  useEffect(() => {
    register(setAddress, setChain)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (address) {
      requestBalance(address).then((balance) => {
        if (balance && chain) {
          setBalance(`${balance} DFI`)
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
      isInstalled,
      isConnected,
      connect,
      signMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, balance, chain, isInstalled, isConnected],
  )

  return <WalletContext.Provider value={context}>{props.children}</WalletContext.Provider>
}
