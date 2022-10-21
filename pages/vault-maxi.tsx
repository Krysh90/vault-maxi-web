import { NextPage } from 'next'
import Layout from '../components/core/layout'
import styles from '../styles/pages/vault-maxi.module.css'

const VaultMaxi: NextPage = () => {
  return (
    <Layout page="Bot">
      <h1>Currently under construction. Please check back later.</h1>

      <div className={styles.explanation}>
        <h2>How does it work?</h2>
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
    </Layout>
  )
}

export default VaultMaxi
