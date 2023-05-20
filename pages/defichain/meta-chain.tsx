import { NextPage } from 'next'
import { WalletContextProvider, useWalletContext } from '../../contexts/wallet.context'
import Layout from '../../components/core/layout'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MetaMaskChainInterface, useMetaMask } from '../../hooks/metamask.hook'
import { floppy } from '../../lib/meta-chain-network.lib'
import { Button } from '../../components/base/button'
import { ThemedIconButton } from '../../components/base/themed-icon-button'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'

const MetaChain: NextPage = () => {
  return (
    <WalletContextProvider>
      <MetaChainContent />
    </WalletContextProvider>
  )
}

function MetaChainContent(): JSX.Element {
  const { chain } = useWalletContext()

  return (
    <Layout page="MetaChain" full maxWidth withoutSupport>
      <h1 className="mx-auto">MetaChain</h1>
      {/* <div className="relative w-full">
        <Button
          className="absolute bottom-0 right-0"
          disabled={isConnected}
          onClick={connect}
          label={isConnected ? 'Connected' : 'Connect'}
        />
      </div> */}
      <div className="pt-16">
        {chain !== floppy.chainId ? (
          <AddNetworkManual chain={floppy} />
        ) : (
          <p>Congrats you have successfully added Floppy network of MetaChain to your MetaMask</p>
        )}
      </div>
    </Layout>
  )
}

function AddNetworkManual({ chain }: { chain: MetaMaskChainInterface }): JSX.Element {
  const { requestChangeToChain } = useMetaMask()
  const [showsAddInfo, setShowsAddInfo] = useState(false)

  return (
    <div>
      {showsAddInfo ? (
        <div className="flex flex-col items-center gap-4">
          <ol>
            <li className="list-decimal">
              Open your MetaMask extension and click on the network drop-down on the top.
            </li>
            <li className="list-decimal">Click Add Network button</li>
            <li className="list-decimal">On the bottom of the recommended networks, click on Add a network manually</li>
            <li className="list-decimal">Please add following network</li>
          </ol>

          <div className="w-96 flex flex-col gap-2 place-self-center">
            <ManualEntry label="Network name" value={chain.chainName} />
            <ManualEntry label="New RPC URL" value={chain.rpcUrls[0]} />
            <ManualEntry label="Chain ID" value={'' + chain.chainId} />
            <ManualEntry label="Currency symbol" value={chain.nativeCurrency.name} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p>
              Thanks to{' '}
              <a className="hover:text-main ease-in duration-100" href="https://twitter.com/0ptim_">
                0ptim_
              </a>
            </p>
            <p>His twitter thread about how to add Floppynet </p>
            <a
              className="hover:text-main ease-in duration-100"
              href="https://twitter.com/0ptim_/status/1658398518686490626"
            >
              Twitter thread
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            label={`Change to ${chain.chainName}`}
            onClick={() => requestChangeToChain(chain.chainId).catch(() => setShowsAddInfo(true))}
          />
          <Button label="Show how to add manually" onClick={() => setShowsAddInfo(true)} secondary />
        </div>
      )}
    </div>
  )
}

function ManualEntry({ label, value }: { label: string; value: string }): JSX.Element {
  function copyToClipboard(value: string) {
    if (window.isSecureContext && navigator && navigator.clipboard) navigator.clipboard.writeText(value)
  }

  return (
    <div className="bg-light rounded-lg h-12 w-full px-2 py-1 flex flex-row justify-between">
      <p className="self-center">{label}</p>
      <div className="flex flex-row gap-1">
        <div className="rounded-lg bg-dark flex flex-row items-center px-2">
          <p>{value}</p>
        </div>
        <ThemedIconButton
          className="w-10 h-full"
          color="#fff"
          hoverColor="#ff00af"
          icon={faClipboard}
          onClick={() => copyToClipboard(value)}
          useCheckmarkAnimation
        />
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(MetaChain), { ssr: false })
