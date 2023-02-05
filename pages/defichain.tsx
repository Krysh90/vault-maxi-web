import { NextPage } from 'next'
import CardOverview from '../components/base/card-overview'
import Layout from '../components/core/layout'
import { DefichainRepository } from '../lib/defichain.repository'

const Defichain: NextPage = () => {
  return (
    <Layout page="defichain" full withoutSupport>
      <h1>defichain</h1>
      <CardOverview
        items={DefichainRepository.all().map((t, index) => ({
          index,
          title: t.name,
          ...t,
        }))}
      />
    </Layout>
  )
}

export default Defichain
