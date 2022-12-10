import { NextPage } from 'next'
import DonutChart from '../components/base/donut-chart'
import { StaticEntry } from '../components/base/static-entry'
import Layout from '../components/core/layout'
import HistoryChart from '../components/statistic/history-chart'
import { VaultStats } from '../dtos/vault-stats.dto'
import { historyDaysToLoad, StatisticsChartDataType, toChartData } from '../lib/statistics.lib'

export async function getStaticProps(): Promise<{ props: StatisticsProps; revalidate: number }> {
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
  return { props: { statistics, history }, revalidate: 3600 }
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
      sort: true,
    },
    { title: 'Loans', type: StatisticsChartDataType.LOAN, inDollar: true, sort: false },
    {
      title: "Bot managed vaults' collateral",
      type: StatisticsChartDataType.COLLATERAL,
      inDollar: true,
      sort: true,
    },
    {
      title: 'Vault Maxi strategies',
      type: StatisticsChartDataType.STRATEGY,
      inDollar: false,
      sort: true,
    },
  ]

  const infoText = `All information shown on this page were done via blockchain analysis of Kügi. Only active vaults are shown with a minimum collateral of ${statistics.params.minCollateral}. Bots are identified by a specific transaction pattern of the last ${statistics.params.maxHistory} transactions.`

  return (
    <Layout page="Statistics" full maxWidth withoutSupport>
      <h1 className="text-4xl text-main">Statistics</h1>
      <div className="flex flex-row flex-wrap py-8 gap-16 flex-grow justify-center items-start w-full">
        {/* <div className="max-w-lg"> */}
        <StaticEntry type="info" text={infoText} variableHeight />
        {/* </div> */}
        {charts.map((info, index) => {
          const data = toChartData(statistics, info.type, info.sort)
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
