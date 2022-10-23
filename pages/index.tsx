import type { NextPage } from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Layout from '../components/core/layout'
import Team from '../components/home/team'
import styles from '../styles/pages/index.module.css'
import overview from '../public/overview.svg'

const Home: NextPage = () => {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', listenToScroll)
    return () => window.removeEventListener('scroll', listenToScroll)
  }, [])

  const listenToScroll = () => {
    let heightToHideFrom = 30
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
    if (winScroll > heightToHideFrom) {
      setHasScrolled(true)
    }
  }

  return (
    <Layout page="Home">
      <div className={styles.claim}>
        <h1 style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <p>
            <em>MAXI</em>MIZE
          </p>
          <p>
            YOUR <em>VAULT</em>
          </p>
        </h1>
        <Image src={overview} alt="Overview of vault-maxi; vault plus aws lambda equals vault-maxi" />
      </div>
      {!hasScrolled && (
        <div className={styles.hint}>
          <p>Read more</p>
          <p>&darr;</p>
        </div>
      )}
      <div className={styles.about}>
        <h2>What is Vault Maxi?</h2>
        <ul>
          <li>A vault management bot hosted either via AWS or your own full node</li>
          <li>Keeps your vault collateral ratio within a configured range</li>
          <li>Automatically reinvests rewards into your vault</li>
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
        <h2>Disclaimer</h2>
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
        <h2>Risks involved</h2>
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
