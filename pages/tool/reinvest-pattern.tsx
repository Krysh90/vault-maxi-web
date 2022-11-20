import { NextPage } from 'next'
import Layout from '../../components/core/layout'
import ReinvestEntries from '../../components/tool/reinvest-entries'
import ReinvestResult from '../../components/tool/reinvest-result'
import { ReinvestContextProvider } from '../../contexts/reinvest.context'

const ReinvestGenerator: NextPage = () => {
  return (
    <Layout page="Tool - Reinvest pattern" full maxWidth withoutSupport>
      <ReinvestContextProvider>
        <h1 className="text-4xl text-main">Reinvest pattern</h1>
        <div className="flex flex-col md:flex-row py-8 gap-8 flex-grow justify-center w-full">
          {/* <Chart /> */}
          <ReinvestEntries />
        </div>
        <ReinvestResult />
      </ReinvestContextProvider>
    </Layout>
  )
}

export default ReinvestGenerator
