import { NextPage } from 'next'
import Layout from '../../components/core/layout'
import { CollateralTokens } from '../../components/vault/collateral'
import { LoanTokens } from '../../components/vault/loan'
import { VaultOverview } from '../../components/vault/overview'
import { VaultContextProvider, useVaultContext } from '../../contexts/vault.context'
import dynamic from 'next/dynamic'
import { Button } from '../../components/base/button'

const VaultSimulator: NextPage = () => {
  return (
    <VaultContextProvider>
      <VaultSimulatorContent />
    </VaultContextProvider>
  )
}

function VaultSimulatorContent(): JSX.Element {
  const { resetVault } = useVaultContext()
  return (
    <Layout page="Vault simulator" full maxWidth withoutSupport>
      <h1>Vault simulator</h1>
      <div className="flex flex-col gap-4 pt-8 items-center">
        {/* add a small info text and link to wiki page https://defichain-wiki.com/wiki/Vaults_and_Loans */}
        <p>TODO vault explanation</p>
        <Button className="my-4 w-32" label="Reset" onClick={resetVault} />
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
