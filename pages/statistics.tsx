import { NextPage } from 'next'
import DonutChart from '../components/base/donut-chart'
import Layout from '../components/core/layout'
import HistoryChart from '../components/statistic/history-chart'
import { VaultStats } from '../dtos/vault-stats.dto'
import { historyDaysToLoad, StatisticsChartDataType, toChartData } from '../lib/statistics.lib'

export async function getServerSideProps(): Promise<{ props: StatisticsProps }> {
  const res = await fetch('https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/vaultAnalysis/latest.json')
  const statistics: VaultStats = await res.json()
  const history = await Promise.all<VaultStats>(
    historyDaysToLoad()
      .map((date) => `https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/vaultAnalysis/${date}.json`)
      .map((url) =>
        fetch(url)
          .then((res) => res.json())
          .catch(() => {}),
      ),
  ).then((stats) => stats.filter((stat) => stat !== undefined))
  const needsLatestInHistory = !history.find((stats) => stats.tstamp === statistics.tstamp)
  return { props: { statistics, history: history.concat(needsLatestInHistory ? statistics : []) } }
}

interface StatisticsProps {
  statistics: VaultStats
  history: VaultStats[]
}

const Statistics: NextPage<StatisticsProps> = ({ statistics, history }: StatisticsProps) => {
  const charts = [
    {
      title: 'Number of vaults',
      type: StatisticsChartDataType.NUMBER_OF_VAULTS,
      inDollar: false,
    },
    {
      title: 'Collateral in $',
      type: StatisticsChartDataType.COLLATERAL,
      inDollar: true,
    },
    {
      title: 'Strategy',
      type: StatisticsChartDataType.STRATEGY,
      inDollar: false,
    },
  ]

  return (
    <Layout page="Statistics" full maxWidth withoutSupport>
      <h1 className="text-4xl text-main">Statistics</h1>
      <div className="flex flex-row flex-wrap py-8 gap-16 flex-grow justify-center items-start w-full">
        {charts.map((info, index) => {
          const data = toChartData(statistics, info.type)
          const total = data.datasets[0].data.reduce((curr, prev) => curr + prev)
          const tableContent = [total].concat(data.datasets[0].data)
          const tableLabels = ['Total'].concat(data.labels)
          // TODO (Krysh) move isDollar logic to toChartData
          return (
            <div key={index} className="flex flex-col items-center gap-4">
              <h3>{info.title}</h3>
              <DonutChart chartData={data} />
              <div className="table table-fixed min-w-full">
                {tableContent.map((entry, index) => (
                  <div key={index} className="table-row">
                    <div
                      className={'table-cell text-left py-1'
                        .concat(index === tableContent.length - 1 ? '' : ' border-b border-b-light')
                        .concat(index > 0 ? ' border-r border-r-light' : '')}
                    >
                      {tableLabels[index]}
                    </div>
                    <div
                      className={'table-cell text-center'
                        .concat(index === tableContent.length - 1 ? '' : ' border-b border-b-light')
                        .concat(index > 0 ? ' border-r border-r-light' : '')}
                    >
                      {index > 0 ? `${((entry / total) * 100).toFixed(1)}%` : ''}
                    </div>
                    <div
                      className={'table-cell text-right'.concat(
                        index === tableContent.length - 1 ? '' : ' border-b border-b-light',
                      )}
                    >
                      {info.inDollar ? `$${entry.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : entry}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <HistoryChart history={history} />
    </Layout>
  )
}

export default Statistics
