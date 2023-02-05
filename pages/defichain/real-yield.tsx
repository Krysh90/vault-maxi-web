import { NextPage } from 'next'
import DonutChart from '../../components/base/donut-chart'
import { StaticEntry } from '../../components/base/static-entry'
import Layout from '../../components/core/layout'
import { RealYieldStats } from '../../dtos/real-yield-stats.dto'
import { generateTableContent } from '../../lib/chart.lib'
import { historyDaysToLoad, RealYieldChartDataType, toChartData } from '../../lib/real-yield.lib'

export async function getStaticProps(): Promise<{ props: StatisticsProps; revalidate: number }> {
  const res = await fetch('https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/realYield/latest.json')
  const statistics: RealYieldStats = await res.json()
  const history = await Promise.all<RealYieldStats>(
    historyDaysToLoad()
      .map((date) => `https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/realYield/${date}.json`)
      .map((url) =>
        fetch(url)
          .then((res) => res.json())
          .catch(() => {}),
      ),
  ).then((stats) => stats.filter((stat) => stat !== undefined))
  return { props: { statistics, history }, revalidate: 3600 }
}

interface StatisticsProps {
  statistics: RealYieldStats
  history: RealYieldStats[]
}

const Statistics: NextPage<StatisticsProps> = ({ statistics, history }: StatisticsProps) => {
  const charts = [
    {
      title: 'Fees (burned)',
      type: RealYieldChartDataType.FEE,
      inDollar: true,
      sort: true,
    },
    { title: 'Crypto commissions (yield)', type: RealYieldChartDataType.COMMISSION_CRYPTO, inDollar: true, sort: true },
    {
      title: 'dToken commissions (yield)',
      type: RealYieldChartDataType.COMMISSION_TOKEN,
      inDollar: true,
      sort: true,
    },
  ]

  const infoText = `Displayed values were taken between blocks ${statistics.meta.startHeight} and ${statistics.meta.endHeight}. Shown values are measured in respective oracles prices (1 DUSD = 1$)`

  return (
    <Layout page="Real yield" full maxWidth withoutSupport>
      <h1>Real yield</h1>
      <div className="flex flex-row flex-wrap py-8 gap-16 flex-grow justify-center items-start w-full">
        <StaticEntry type="info" text={infoText} variableHeight />
        {charts.map((info, index) => {
          const data = toChartData(statistics, info)
          const { content, labels, percentages, colors } = generateTableContent(data, info)
          return (
            <div key={index} className="flex flex-col items-center gap-4">
              <h3>{info.title}</h3>
              <DonutChart chartData={data} />
              <div className="table table-fixed min-w-full">
                {content.map((entry, index) => (
                  <div key={index} className="table-row">
                    <div
                      className={'table-cell text-left py-1'
                        .concat(index === content.length - 1 ? '' : ' border-b border-b-light')
                        .concat(index > 0 ? ' border-r border-r-light' : '')}
                    >
                      <div className="flex flex-row items-center gap-1">
                        {index !== 0 && <div className="w-1 h-4" style={{ backgroundColor: colors[index] }} />}
                        {labels[index]}
                      </div>
                    </div>
                    <div
                      className={'table-cell text-center align-middle'
                        .concat(index === content.length - 1 ? '' : ' border-b border-b-light')
                        .concat(index > 0 ? ' border-r border-r-light' : '')}
                    >
                      {index > 0 ? `${percentages[index]}%` : ''}
                    </div>
                    <div
                      className={'table-cell text-right align-middle'.concat(
                        index === content.length - 1 ? '' : ' border-b border-b-light',
                      )}
                    >
                      {entry}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {/* <HistoryChart history={history} /> */}
    </Layout>
  )
}

export default Statistics
