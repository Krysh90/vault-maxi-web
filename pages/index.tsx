import type { NextPage } from 'next'
import Layout from '../components/layout'
import styles from '../styles/pages/index.module.css'

const Home: NextPage = () => {
  return (
    <Layout page="Home">
      <div className={styles.about}>
        <h1>What is Vault Maxi?</h1>
        <ul>
          <li>A vault management bot hosted either via AWS or your own full node</li>
          <li>Keeps your vault collateral ratio within a configured range</li>
          <li>Maximizes your vaults rewards by using delta-neutral strategies</li>
        </ul>
      </div>
    </Layout>
  )
}

export default Home
