import { NextPage } from 'next'
import Layout from '../../components/core/layout'
import ReinvestChart from '../../components/tool/reinvest-chart'
import ReinvestEntries from '../../components/tool/reinvest-entries'
import ReinvestResult from '../../components/tool/reinvest-result'
import { ReinvestContextProvider } from '../../contexts/reinvest.context'

const ReinvestPattern: NextPage = () => {
  return (
    <Layout page="Tool - Reinvest pattern" full maxWidth withoutSupport>
      <ReinvestContextProvider>
        <h1>Reinvest pattern</h1>
        <div className="flex flex-col md:flex-row py-8 gap-8 flex-grow justify-center items-center md:items-start w-full">
          <ReinvestChart />
          <ReinvestEntries />
        </div>
        <ReinvestResult />
      </ReinvestContextProvider>
    </Layout>
  )
}

export default ReinvestPattern
