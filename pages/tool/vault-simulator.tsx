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

const VaultSimulator: NextPage = () => {
  return (
    <VaultContextProvider>
      <VaultSimulatorContent />
    </VaultContextProvider>
  )
}

function VaultSimulatorContent(): JSX.Element {
  const { importVault, resetVault } = useVaultContext()
  const [vaultID, setVaultID] = useState<string>('')

  return (
    <Layout page="Vault simulator" full maxWidth withoutSupport>
      <h1>Vault simulator</h1>
      <div className="flex flex-col gap-4 pt-8 items-center">
        {/* add a small info text and link to wiki page https://defichain-wiki.com/wiki/Vaults_and_Loans */}
        <div className="flex flex-row gap-4 my-4">
          <ThemedInput
            className="bg-dark w-60 px-2 rounded-lg border border-white pointer-events-auto"
            noSubmit
            value={vaultID}
            onChange={setVaultID}
            type="text"
          />
          <Button className="w-32" label="Import" onClick={() => importVault(vaultID)} />
          <Button className="w-32" label="Reset" onClick={resetVault} />
        </div>
      </div>
      <div className="w-full flex flex-row flex-wrap gap-8 py-8">
        <VaultOverview />
        <div className="flex flex-col flex-wrap lg:w-half">
          <CollateralTokens />
          <LoanTokens />
        </div>
      </div>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(VaultSimulator), { ssr: false })
