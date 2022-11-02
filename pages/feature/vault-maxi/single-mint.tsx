import { NextPage } from 'next'
import Image from 'next/future/image'
import Layout from '../../../components/core/layout'
import PageHeader from '../../../components/core/page-header'
import overview from '../../../public/vault-maxi/single-mint.svg'

const VaultMaxiSingleMint: NextPage = () => {
  return (
    <Layout page="Single mint">
      <PageHeader pageHeader="Single mint strategy">
        <Image src={overview} alt="Overview of vault-maxis' single mint strategy" />
        <div>
          <p>
            To start Vault Maxi you will need to have a vault filled with collateral. Single mint strategy will mint
            only one token for your configured liquidity mining pair and takes the other one from your collateral. For
            example <em>dTSLA-DUSD</em>. Only <em>dTSLA</em> is minted and <em>DUSD</em> is taken from collateral put
            into the liquidity mining pool. You need to change your main collateral setting to <em>DUSD</em>.
          </p>
          <p>
            With this strategy you can use Vault Maxi to invest in <em>DUSD-DFI</em> by setting main collateral to{' '}
            <em>DFI</em>.
          </p>
        </div>
        <div>
          <h4>Decrease exposure</h4>
          <p>
            On a decrease exposure Vault Maxi calculates how many liquidity mining tokens need to be removed from the
            pool. The loaned part of removed tokens will be used to pay back loan, the main collateral part is deposited
            to your vault and therefore bring your vaults&apos; collateral ratio into your defined range.
          </p>
        </div>
        <div>
          <h4>Increase exposure</h4>
          <p>
            On an increase exposure Vault Maxi calculates how much loans it can add and how many collateral needs to be
            withdrawn to be in the center of your defined range. Minted and withdrawn tokens will be added to the
            liquidity mining pool and therefore increase rewards received.
          </p>
        </div>
      </PageHeader>
    </Layout>
  )
}

export default VaultMaxiSingleMint
