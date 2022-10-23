import { NextPage } from 'next'
import Layout from '../components/core/layout'
import FeatureOverview from '../components/feature/feature-overview'

const Features: NextPage = () => {
  return (
    <Layout page="Features">
      <h1 style={{ fontSize: 'xx-large', color: '#ff00af' }}>Features</h1>
      <FeatureOverview />
    </Layout>
  )
}

export default Features
