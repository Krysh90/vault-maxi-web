import { NextPage } from 'next'
import Image from 'next/future/image'
import Layout from '../../../components/core/layout'
import overview from '../../../public/basic.svg'

const VaultMaxiBasic: NextPage = () => {
  return (
    <Layout page="Vault Maxi - Basic">
      <h1 className="text-4xl text-main">Basic overview</h1>
      <div className="flex flex-col w-full pt-4 gap-4 items-center">
        <Image src={overview} alt="Overview of vault-maxi; vault plus aws lambda equals vault-maxi" />
        <p className="text-hint">We start from right to left</p>
        <h3>DeFiChain</h3>
        <div>
          <p>This represents your DeFiChain wallet consisting of an address and a vault.</p>
          <p>Vault Maxi will create and manage your LM position. No need to create it yourself.</p>
          <p>
            You can use one of the following wallets:
            <ul className="ml-8">
              <li className="list-disc">DeFiChain light wallet app</li>
              <li className="list-disc">DFX app</li>
              <li className="list-disc">Desktop wallet with a Bech32 address</li>
            </ul>
          </p>
        </div>
        <h3>Ocean API</h3>
        <div>
          <p>The Ocean API is an infrastructure hosted by DeFiChain (or other providers).</p>
          <p>
            Via this API you are able to retrieve a lot of information of the blockchain without the need of running a
            full node yourself.
          </p>
          <p>
            In Vault Maxis&apos; case we use it to monitor your vault, access balances on your address and manage your
            configured liquidity pool.
          </p>
          <p>
            <em>Import</em> to note is that Vault Maxi is not touching other vaults, which may exist on this address.
            Nor will it touch other liquidity pools. Only configured information will be used by Vault Maxi.
          </p>
          <p>You can freely choose from all ocean providers.</p>
        </div>
        <h3>AWS</h3>
        <div>
          <p>
            Amazon Web Services (AWS) is the provider we decided to use, due to high security standards and a ton of
            different tools and features to use. You will need to create an account. Sadly a credit-card is required to
            create an account. For most cases using Vault Maxi is completely <em>free</em>. For example I am running
            five Vault Maxis and a command-center and I am still within the Free Tier of AWS.
          </p>
          <h4>Trigger</h4>
          <p>
            Every 15 minutes Vault Maxis&apos; code will be triggered. Means every 15 minutes Vault Maxi will take care
            of your vault and check if something needs to be done.
          </p>
          <h4>Parameters</h4>
          <p>
            All information which is required for Vault Maxi to be able to execute is stored in a{' '}
            <em>Parameter Store</em>. Vault Maxi does read the information and write the state of the last execution.
          </p>
          <h4>Seed</h4>
          <p>
            You will need to create a parameter which stores your seed as a <em>Secure String</em>. Means your seed will
            be secured by encrypting it with your personal key.
          </p>
          <h4>Vault Maxi</h4>
          <p>
            After setting up your Vault Maxi it is important that you check if it&apos;s set up correctly. You can to
            this by executing a <em>checkSetup</em>. How this is done is described in our Guide.
          </p>
          <p>
            You are able to define a collateral ratio range for your vault. For example <em>190%</em> to <em>210%</em>.
            Vault Maxi will keep your vault within this range.
          </p>
          <p>If we keep it as simple as possible Vault Maxi is able to do following list of actions</p>
          <ul className="ml-8">
            <li className="list-disc">decrease exposure</li>
            <li className="list-disc">increase exposure</li>
            <li className="list-disc">reinvest</li>
            <li className="list-disc">communication</li>
          </ul>
        </div>
        <p className="text-hint">
          Briefly about vaults and their collateral ratio. If your collateral drops in $ value or your loans increases
          your collateral ratio will decrease.
        </p>
        <div>
          <h4>Decrease Exposure</h4>
          <p>
            If your next collateral ratio is below your defined range. In our example below <em>190%</em>. It will
            remove liquidity from the configured liquidity pair and will pay back the removed tokens, therefore
            decreasing your loans and increasing your collateral ratio to the center of your defined range.
          </p>
        </div>
        <div>
          <h4>Increase exposure</h4>
          <p>
            If your next collateral ratio is above your defined range. In our example above <em>210%</em>. It will take
            more loans and add new minted tokens to your liquidity pool.
          </p>
        </div>
        <div>
          <h4>Reinvest</h4>
          <p>
            If your threshold of DFI is met or exceeded in your address. It will automatically deposit it to your vault.
            The threshold and the reinvest itself are completely configurable to your desire.
          </p>
        </div>
        <div>
          <h4>Communication</h4>
          <p>
            Vault Maxi uses a Telegram bot to communicate with you. Means you need to setup a Telegram bot for yourself.
            A complete step-by-step how to can be found in our guide. Each action above will trigger a message. You can
            retrieve a message on each execution every 15 minutes too.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default VaultMaxiBasic
