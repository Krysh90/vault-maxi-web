import { NextPage } from 'next'
import { useState } from 'react'
import DonutChart from '../components/base/donut-chart'
import Layout from '../components/core/layout'
import { ChartData } from '../dtos/chart-data.dto'
import { VaultStats } from '../dtos/vault-stats.dto'

export async function getServerSideProps(): Promise<{ props: StatisticsProps }> {
  const res = await fetch('https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/vaultAnalysis/latest.json')
  const statistics = await res.json()
  return { props: { statistics } }
}

interface StatisticsProps {
  statistics: VaultStats
}

const Statistics: NextPage<StatisticsProps> = ({ statistics }: StatisticsProps) => {
  const [showBotOnly, setShowBotOnly] = useState(false)

  function toChartData(stats: VaultStats): ChartData {
    const vaultMaxi =
      stats.botData.doubleMintMaxi.totalVaults +
      stats.botData.dfiSingleMintMaxi.totalVaults +
      stats.botData.dusdSingleMintMaxi.totalVaults
    return {
      labels: ['Vault Maxi', 'Wizard'],
      datasets: [
        {
          data: [vaultMaxi, stats.botData.wizard.totalVaults],
          backgroundColor: ['#ff00af', '#000'],
          hoverOffset: 4,
        },
      ],
    }
  }

  return (
    <Layout page="Statistics" full maxWidth withoutSupport>
      <h1 className="text-4xl text-main">Statistics</h1>
      <div className="flex flex-col md:flex-row py-8 gap-8 flex-grow justify-center items-center md:items-start w-full">
        <div>
          <p>ToDo toggle for all vaults and bot only</p>
          <DonutChart chartData={toChartData(statistics)} />
          <p>Total: {toChartData(statistics).datasets.map((d) => d.data.reduce((curr, prev) => curr + prev))}</p>
          <p>Vault Maxi: {toChartData(statistics).datasets[0].data[0]}</p>
          <p>Wizard: {toChartData(statistics).datasets[0].data[1]}</p>
        </div>
      </div>
    </Layout>
  )
}

export default Statistics
