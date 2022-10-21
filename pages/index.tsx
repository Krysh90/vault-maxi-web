import type { NextPage } from 'next'
import Image from 'next/image'
import Layout from '../components/core/layout'
import Team from '../components/home/team'
import styles from '../styles/pages/index.module.css'

const Home: NextPage = () => {
  return (
    <Layout page="Home">
      <div className={styles.claim}>
        <h1>
          <em>MAXI</em>MIZE
          <br />
          YOUR <em>VAULT</em>
        </h1>
        <Image
          src="/overview.svg"
          width={440}
          height={130}
          alt="Overview of vault-maxi; vault plus aws lambda equals vault-maxi"
        />
      </div>
      <div className={styles.about}>
        <h2>What is Vault Maxi?</h2>
        <ul>
          <li>A vault management bot hosted either via AWS or your own full node</li>
          <li>Keeps your vault collateral ratio within a configured range</li>
          <li>
            Maximizes your vaults rewards by using delta-neutral strategies
            <ul>
              <li>
                <em>Double mint</em>: both dToken and dUSD are taken as loans
              </li>
              <li>
                <em>Single mint</em>: dToken (or dUSD) is taken as loan and dUSD (or DFI) is taken from collateral
              </li>
            </ul>
          </li>
          <li>
            Open source since the beginning on{' '}
            <a target="_blank" href="https://github.com/kuegi/defichain_maxi" rel="noopener noreferrer">
              GitHub &rarr;
            </a>
          </li>
        </ul>
      </div>
      <Team />
      <div className={styles.disclaimer}>
        <h1>Disclaimer</h1>
        <ul>
          <li>
            Do not use this tool if you don&rsquo;t understand vaults on defichain. If you set the wrong parameter, you
            risk liquidating your vault and losing the whole collateral.
          </li>
          <li>
            <strong>
              This is not financial advice and anyone using this tool is doing so at their own risk. Never invest more
              than you are ok to lose. We are using it ourselves but can&rsquo;t guarantee that it’s working flawlessly
              in every edge case. We are not responsible for any lost funds.
            </strong>
          </li>
          <li>
            For additional safety we recommend using{' '}
            <a target="_blank" href="https://defichain-dobby.com/" rel="noopener noreferrer">
              defichain dobby
            </a>{' '}
            to monitor your vault.
          </li>
          <li>
            Follow the best practices for your AWS account which include using MFA and not using your root account to
            monitor the lambda.
          </li>
        </ul>
      </div>
      <div className={styles.risks}>
        <h1>Risks involved</h1>
        <p>
          The risks involved contain (but are not limited to) the following list. Do NOT use the tool if you do not
          understand their impact:
        </p>
        <ul>
          <li>Vaults on defichain and their liquidation</li>
          <li>Impermanent Loss</li>
          <li>Counter-party risk in the ecosystem</li>
          <li>Code bugs (in Vault Maxi or defichain itself)</li>
          <li>Ocean API downtime / server-outage</li>
          <li>Ocean API timeouts</li>
          <li>loss of funds due to hacks of your account</li>
          <li>loss of funds when you upload custom build zips from a scammer </li>
          <li>AWS closing your account, effectively stopping vault-maxi from working</li>
        </ul>
        <strong>
          Always keep in mind that the code has full access to your wallet (not only this address, but the full wallet
          derived from your seed phrase). NEVER upload custom zips from anyone. We will NEVER send anyone a custom build
          zip to upload. Anyone who offers you one is a SCAMMER and tries to steal your funds. Please report them
          immediately.
        </strong>
      </div>
    </Layout>
  )
}

export default Home
