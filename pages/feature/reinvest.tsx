import { NextPage } from 'next'
import Image from 'next/future/image'
import Layout from '../../components/core/layout'
import PageHeader from '../../components/core/page-header'
import overview from '../../public/reinvest/overview.svg'

const Reinvest: NextPage = () => {
  return (
    <Layout page="Reinvest">
      <PageHeader pageHeader="Reinvest">
        <Image src={overview} alt="Overview of reinvest" />
        <div>
          <p>
            Reinvest is now 100% customizable and powerful as it gets. This feature is completely integrated into{' '}
            <em>Vault-Maxi</em> and can be used as a standalone bot, which can be hosted on your AWS. It a real powerful
            automation, which triggers on having above a configured amount of DFI on your address.
          </p>
          <p>
            As soon as this threshold is met, it will swap, send, deposit and/or add to liquidity pool depending on your
            reinvestment targets, which are described by a pattern.
          </p>
          <p>This pattern contains one or more reinvest targets. Each reinvest target has three parts:</p>
          <ul className="pl-6">
            <li className="list-disc">
              target token, either a token like <em>DFI</em>, <em>DUSD</em>... or a liquidity mining token like{' '}
              <em>TSLA-DUSD</em>...
            </li>
            <li className="list-disc">percentage which should be used for this target</li>
            <li className="list-disc">address or vault, where this should be sent or deposited</li>
          </ul>
          <h4 className="pt-2">Example patterns</h4>
          <p className="text-code font-mono">DFI TSLA-DUSD</p>
          <p>will lead to:</p>
          <ul className="pl-6">
            <li className="list-disc text-code font-mono">DFI</li>
            <li>
              will deposit 50% of your reinvested amount as <em>DFI</em> to your configured vault
            </li>
            <li className="list-disc text-code font-mono">TSLA-DUSD</li>
            <li>
              will swap & add 50% of your reinvested amount in <em>TSLA-DUSD</em> pool
            </li>
          </ul>
          <p className="pt-2 text-code font-mono">DFI:40 BTC-DFI:30:addressOfJoe DUSD::vaultOfJane</p>
          <p>will lead to:</p>
          <ul className="pl-6">
            <li className="list-disc text-code font-mono">DFI:40</li>
            <li>
              will deposit 40% of your reinvested amount as <em>DFI</em> to your configured vault
            </li>
            <li className="list-disc text-code font-mono">BTC-DFI:30:addressOfSomeOneElse</li>
            <li>
              will swap & add 30% of your reinvested amount in <em>BTC-DFI</em> pool and send it to the address of Joe
            </li>
            <li className="list-disc text-code font-mono">DUSD::vaultOfJane</li>
            <li>
              {' '}
              will swap 40% of your reinvested amount in <em>DUSD</em> pool and deposit it to the vault of Jane
            </li>
          </ul>
          <p className="pt-4">
            <strong className="text-main">Important:</strong> We are currently developing a tool to create such
            patterns. If it sounds too complicated to write it yourself, please wait until we launched this tool. As
            soon as we are finished a link to this tool will be here.
          </p>
        </div>
      </PageHeader>
    </Layout>
  )
}

export default Reinvest
