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
        <a
          target="_blank"
          href="https://www.youtube.com/playlist?list=PLgSw0rik-znfQa3wVO-EJ_6Of7RnWZm3_"
          rel="noopener noreferrer"
        >
          Vault Maxi video series &rarr;
        </a>
      </div>
      <div className={styles.explanation}>
        <h1>How does it work?</h1>
        <ul>
          <li>
            The DeFiChain VaultMaxi script runs on AWS (Amazon Web Services) as a so-called Lambda function. AWS Lambda
            is a compute service that lets you run code without provisioning or managing servers. AWS Lambda can be used
            for our purpose as a free service.
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
        <a
          target="_blank"
          href="https://docs.google.com/document/d/1sb9VgeVHGYZpyLWQx8VsxsoeHO4JRz3fACj5_JjoVNs"
          rel="noopener noreferrer"
        >
          Vault Maxi guide &rarr;
        </a>
      </div>
    </Layout>
  )
}

export default Home
