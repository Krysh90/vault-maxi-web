import type { NextPage } from 'next'
import Layout from '../components/core/layout'
import Support from '../components/home/support'
import styles from '../styles/pages/index.module.css'

const Home: NextPage = () => {
  return (
    <Layout page="Home">
      <div className={styles.about}>
        <h1>What is Vault Maxi?</h1>
        <ul>
          <li>A vault management bot hosted either via AWS or your own full node</li>
          <li>Keeps your vault collateral ratio within a configured range</li>
          <li>
            Maximizes your vaults rewards by using delta-neutral strategies
            <ul>
              <li>Double mint: both dToken and dUSD are taken as loans</li>
              <li>Single mint: dToken is taken as loan and dUSD is taken from collateral</li>
              <li>OR dUSD is taken as loan and DFI is taken from collateral</li>
            </ul>
          </li>
        </ul>
      </div>
      <div className={styles.explanation}>
        <h1>How does it work?</h1>
        <ul>
          <li>
            The DeFiChain VaultMaxi script runs on AWS (Amazon Web Services) as a so-called Lambda function. AWS Lambda
            is a compute service that lets you run code without provisioning or managing servers. AWS Lambda can be used
            for our purpose as a <em>free</em> service.
          </li>
          <li>
            The instructions in this document explain how the script can be set up to run as a Lambda function, and how
            it can be configured to monitor a specific vault.
          </li>
          <li>
            Once set up, the script is triggered with an interval of 15 minutes. During each execution it takes the
            actions that are required to keep the configured vault in optimal condition.
          </li>
          <li>
            Optionally, the script can send information about the actions it has executed to a Telegram bot. In this
            way, you can easily keep track of the actions that the script has executed on your vault. Instructions for
            setting up a Telegram bot are provided in our guide.
          </li>
        </ul>
      </div>
      <Support />
    </Layout>
  )
}

export default Home
