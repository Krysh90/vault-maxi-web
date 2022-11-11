import { NextPage } from 'next'
import { useState } from 'react'
import Layout from '../../components/core/layout'
import Chart from '../../components/tool/chart'
import ReinvestEntries from '../../components/tool/reinvest-entries'
import { ReinvestTarget } from '../../dtos/reinvest-target.dto'
import { toChartEntry } from '../../lib/reinvest-generator.lib'

const ReinvestGenerator: NextPage = () => {
  const [entries, setEntries] = useState<ReinvestTarget[]>([])

  return (
    <Layout page="Tool - Reinvest generator" maxWidth withoutSupport>
      <h1 className="text-4xl text-main">Reinvest generator</h1>
      <div className="flex flex-col md:flex-row p-8 gap-8 flex-grow justify-center w-full">
        <Chart items={entries.map(toChartEntry)} />
        <ReinvestEntries entries={entries} setEntries={setEntries} />
      </div>
      <div>
        <p>some text to copy in future {entries.length} entries</p>
      </div>
    </Layout>
  )
}

export default ReinvestGenerator
