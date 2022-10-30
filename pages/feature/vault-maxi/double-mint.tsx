import { NextPage } from 'next'
import Image from 'next/future/image'
import Layout from '../../../components/core/layout'
import PageHeader from '../../../components/core/page-header'
import overview from '../../../public/vault-maxi/double-mint.svg'

const VaultMaxiDoubleMint: NextPage = () => {
  return (
    <Layout page="Double mint">
      <PageHeader pageHeader="Double mint strategy">
        <Image src={overview} alt="Overview of vault-maxis' double mint strategy" />
        <div>
          <p>
            To start Vault Maxi you will need to have a vault filled with collateral. Double mint strategy will mint
            both token for your configured liquidity mining pair. For example <em>TSLA-DUSD</em>. Both <em>TSLA</em> and{' '}
            <em>DUSD</em> are minted and put into the liquidity mining pool.
          </p>
          <p>
            Important to note is that you will need to have at least 50% <em>DFI</em>, otherwise you will receive a
            warning from Vault Maxi via Telegram.
          </p>
        </div>
        <div>
          <h4>Decrease exposure</h4>
          <p>
            On a decrease exposure Vault Maxi calculates how many liquidity mining tokens need to be removed from the
            pool. All removed tokens will be used to pay back loan and therefore bring your vaults&apos; collateral
            ratio into your defined range.
          </p>
        </div>
        <div>
          <h4>Increase exposure</h4>
          <p>
            On an increase exposure Vault Maxi calculates how much loans it can add to be in the center of your defined
            range. All new minted tokens will be added to the liquidity mining pool and therefore increase rewards
            received.
          </p>
        </div>
      </PageHeader>
    </Layout>
  )
}

export default VaultMaxiDoubleMint
