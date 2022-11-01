import { NextPage } from 'next'
import Image from 'next/future/image'
import Layout from '../../components/core/layout'
import PageHeader from '../../components/core/page-header'
import overview from '../../public/command-center/overview.svg'

const CommandCenter: NextPage = () => {
  return (
    <Layout page="Command Center">
      <PageHeader pageHeader="Command Center">
        <Image src={overview} alt="Overview of command-center" />
        <div>
          <p>
            Our command center is a completely optional addon, you don&apos;t need to run Vault Maxi. It just makes
            changing or receiving information of your Vault Maxi way easier. Same as Vault Maxi it does run in your AWS
            and is triggered every minute.
          </p>
          <p>
            <em>
              <strong>Important</strong>
            </em>{' '}
            to note is that command center has no permission to your seed. Only the parameters to read or store settings
            are allowed to be accessed.
          </p>
          <p>
            In conjunction with Telegram and only allowing a specific Telegram user to send commands. We can achieve a
            high security standard without further exposure of your seed.
          </p>
        </div>
        <div>
          <h4>Functionality</h4>
          <p>
            On each run it asks Telegram if there are new messages. It will read the messages and look for specific
            commands.
          </p>
        </div>
        <div>
          <h4>Commands</h4>
          <p>
            There are various commands to receive information like <em>&#47;bots</em> to receive all installed bots
            within this AWS region. Or <em>&#47;help</em> to receive an overview of all possible commands.
          </p>
          <p>
            And commands which are changing settings like <em>&#47;setRange 165-175</em> to change the collateral range
            of your Vault Maxi. Or <em>/setReinvest vault-maxi 10</em> to change the reinvest threshold of your Vault
            Maxi.
          </p>
        </div>
        <div>
          <h4>Usage</h4>
          <p>
            With those examples above there is a pattern, which is important to know. Each command setup after the same
            structure <em>&#47;command bot values</em>.
            <ul className="ml-8">
              <li className="list-decimal">
                <em>command</em>: the name of the command you want to execute
              </li>
              <li className="list-decimal">
                <em>bot</em>: the name of the bot for this command. It is optional if there is only one bot which can
                execute this command
              </li>
              <li className="list-decimal">
                <em>values</em>: a list of values depends on the executed command
              </li>
            </ul>
          </p>
        </div>
      </PageHeader>
    </Layout>
  )
}

export default CommandCenter
