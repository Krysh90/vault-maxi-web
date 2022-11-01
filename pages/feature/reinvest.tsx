import { NextPage } from 'next'
import Image from 'next/future/image'
import Layout from '../../components/core/layout'
import PageHeader from '../../components/core/page-header'
import overview from '../../public/reinvest/overview.svg'

const Reinvest: NextPage = () => {
  return (
    <Layout page="Reinvest">
      <PageHeader pageHeader="Reinvest">
        <Image src={overview} alt="Overview of reinvest" />
        <h4>
          <strong>Important note</strong>: We are currently completely overhauling our reinvest. Stay tuned!
        </h4>
        <div>
          <p>
            Reinvest is another standalone bot, which can be hosted on your AWS. It a really simple automation, which
            triggers on having above a configured amount of DFI on your address.
          </p>
          <p>
            As soon as this threshold is met, it will swap 50% DFI into the first token of your configured pool and the
            other 50% DFI into the second token. After the swap is completed, it will add those tokens into the
            liquidity pool.
          </p>
          <p>All pools which are currently available on DeFiChain can be used.</p>
        </div>
      </PageHeader>
    </Layout>
  )
}

export default Reinvest
