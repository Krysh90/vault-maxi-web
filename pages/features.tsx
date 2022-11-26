import { NextPage } from 'next'
import CardOverview from '../components/base/card-overview'
import Layout from '../components/core/layout'
import { FeatureRepository } from '../lib/feature.repository'

const Features: NextPage = () => {
  return (
    <Layout page="Features" full>
      <h1 className="text-4xl text-main">Features</h1>
      <CardOverview
        items={FeatureRepository.all().map((f) => ({
          title: f.name,
          ...f,
        }))}
      />
    </Layout>
  )
}

export default Features
