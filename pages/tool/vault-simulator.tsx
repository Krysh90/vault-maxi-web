import { NextPage } from 'next'
import Layout from '../../components/core/layout'
import { CollateralTokens } from '../../components/vault/collateral'
import { LoanTokens } from '../../components/vault/loan'
import { VaultOverview } from '../../components/vault/overview'
import { VaultContextProvider, useVaultContext } from '../../contexts/vault.context'
import dynamic from 'next/dynamic'
import { Button } from '../../components/base/button'
import ThemedInput from '../../components/base/themed-input'
import { useState } from 'react'
import Dialog from '../../components/base/dialog'
import { StaticEntry } from '../../components/base/static-entry'
import Dropdown from '../../components/base/dropdown'
import { getAssetIcon } from '../../defiscan'
import ValueChooser from '../../components/tool/value-chooser'
import { ThemedIconButton } from '../../components/base/themed-icon-button'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

const VaultSimulator: NextPage = () => {
  return (
    <VaultContextProvider>
      <VaultSimulatorContent />
    </VaultContextProvider>
  )
}

function VaultSimulatorContent(): JSX.Element {
  const {
    isLoading,
    importVault,
    resetVault,
    customizedPrices,
    priceTokens,
    addCustomPrice,
    updateCustomPrice,
    removeCustomPrice,
  } = useVaultContext()
  const [vaultID, setVaultID] = useState<string>('')
  const [showsCustomizePrices, setShowsCustomizePrices] = useState(false)

  return (
    <Layout page="Vault simulator" full maxWidth withoutSupport>
      <h1>Vault simulator</h1>
      <div className="flex flex-col gap-4 pt-8 items-center">
        {/* add a small info text and link to wiki page https://defichain-wiki.com/wiki/Vaults_and_Loans */}
        <div className="flex flex-row flex-wrap gap-4 my-4">
          <ThemedInput
            className="bg-dark w-full lg:w-60 px-2 h-11 rounded-lg border border-white pointer-events-auto"
            noSubmit
            value={vaultID}
            onChange={setVaultID}
            type="text"
          />
          <Button
            className="w-full lg:w-32"
            label="Import"
            onClick={() => importVault(vaultID)}
            isLoading={isLoading}
            disabled={vaultID.length !== 64}
          />
          <Button className="w-full lg:w-32" label="Reset" onClick={resetVault} />
          <Button
            className="w-full lg:w-44"
            label="Customize prices"
            onClick={() => setShowsCustomizePrices(true)}
            badge={customizedPrices.length > 0 ? customizedPrices.length : undefined}
          />
        </div>
      </div>
      <div className="w-full flex flex-row flex-wrap gap-8 py-8">
        <VaultOverview />
        <div className="flex flex-col flex-wrap lg:w-half">
          <CollateralTokens />
          <LoanTokens />
        </div>
      </div>
      <Dialog isVisible={showsCustomizePrices} onClose={() => setShowsCustomizePrices(false)}>
        <h3>Customize prices</h3>
        {customizedPrices.map((entry, index) => (
          <div key={index} className="flex flex-row w-full gap-4 items-center">
            <StaticEntry type="wrapper-between">
              <Dropdown
                items={priceTokens?.map((t) => ({ label: t.symbol })) ?? []}
                onSelect={(item) =>
                  updateCustomPrice(entry.id, { token: priceTokens?.find((t) => t.symbol === item.label) })
                }
                preselection={entry && entry.token ? { label: entry.token.symbol } : undefined}
                getIcon={(token) => getAssetIcon(token)({ height: 24, width: 24 })}
              />
              <ValueChooser
                value={entry?.value ?? 0}
                boundary={{ min: 0, max: Infinity }}
                onChange={(value) => updateCustomPrice(entry.id, { token: entry.token, value })}
                postfix="$"
                big
              />
            </StaticEntry>
            <ThemedIconButton
              icon={faTrashCan}
              color="#333"
              hoverColor="#ff00af"
              onClick={() => {
                removeCustomPrice(index)
              }}
              hidden={false}
            />
          </div>
        ))}
        <StaticEntry type="add" add={addCustomPrice} />
      </Dialog>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(VaultSimulator), { ssr: false })
