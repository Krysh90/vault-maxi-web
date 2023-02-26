import { NextPage } from 'next'
import { StaticEntry } from '../../components/base/static-entry'
import Layout from '../../components/core/layout'
import { AddressSettings } from '../../components/portfolio-tracker/address-settings'
import { TotalBalance } from '../../components/portfolio-tracker/total-balance'
import { PortfolioTrackerContextProvider } from '../../contexts/portfolio-tracker.context'

const PortfolioTracker: NextPage = () => {
  const infoText = `Daily one scan of your address(es) will be taken and are visualized beneath. Start by entering an address.`

  return (
    <Layout page="Portfolio Tracker" full maxWidth withoutSupport>
      <h1>Portfolio Tracker</h1>
      <PortfolioTrackerContextProvider>
        <div className="flex flex-row flex-wrap py-8 gap-16 flex-grow justify-center items-start w-full">
          <StaticEntry type="info" text={infoText} variableHeight />
        </div>
        <div className="flex flex-col md:flex-row py-8 gap-8 flex-grow justify-center items-center md:items-start w-full">
          <TotalBalance />
          <AddressSettings />
        </div>
      </PortfolioTrackerContextProvider>
    </Layout>
  )
}

export default PortfolioTracker
