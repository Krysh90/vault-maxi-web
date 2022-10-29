import { NextPage } from 'next'
import Layout from '../components/core/layout'
import FeatureOverview from '../components/feature/feature-overview'

const Features: NextPage = () => {
  return (
    <Layout page="Features" full>
      <h1 className="text-4xl text-main">Features</h1>
      <FeatureOverview />
    </Layout>
  )
}

export default Features
