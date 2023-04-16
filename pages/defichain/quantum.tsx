import BigNumber from 'bignumber.js'
import { NextPage } from 'next'
import DonutChart from '../../components/base/donut-chart'
import { StaticEntry } from '../../components/base/static-entry'
import Layout from '../../components/core/layout'
import HistoryChart from '../../components/statistic/history-chart'
import { QuantumStats } from '../../dtos/quantum-stats.dto'
import { formatNumber, generateTableContent } from '../../lib/chart.lib'
import { historyDaysToLoad, QuantumChartDataType, toChartData, toLineChartData, toScales } from '../../lib/quantum.lib'

export async function getStaticProps(): Promise<{ props: QuantumProps; revalidate: number }> {
  const res = await fetch('https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/quantum/latest.json')
  const statistics: QuantumStats = await res.json()
  const history = await Promise.all<QuantumStats>(
    historyDaysToLoad()
      .map((date) => `https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/quantum/${date}.json`)
      .map((url) =>
        fetch(url)
          .then((res) => res.json())
          .catch(() => {}),
      ),
  ).then((stats) => stats.filter((stat) => stat !== undefined))
  return {
    props: {
      statistics,
      history,
    },
    revalidate: 3600,
  }
}

interface QuantumProps {
  statistics: QuantumStats
  history: QuantumStats[]
}

const Quantum: NextPage<QuantumProps> = ({ statistics, history }: QuantumProps) => {
  const charts = [
    {
      title: 'Liquidity in $',
      type: QuantumChartDataType.LIQUIDITY,
      inDollar: true,
      sort: false,
      showTable: false,
    },
    {
      title: 'Volume to ETH',
      type: QuantumChartDataType.VOLUME_ETH,
      inDollar: true,
      sort: true,
      showTable: true,
    },
    {
      title: 'Volume to defichain',
      type: QuantumChartDataType.VOLUME_DFC,
      inDollar: true,
      sort: true,
      showTable: true,
    },
  ]

  const historyItems = [
    { label: 'Liquidity on defichain in $', type: QuantumChartDataType.LIQUIDITY_DFC },
    { label: 'Liquidity on ETH in $', type: QuantumChartDataType.LIQUIDITY_ETH },
    { label: 'Volume to ETH', type: QuantumChartDataType.VOLUME_ETH },
    { label: 'Volume to defichain', type: QuantumChartDataType.VOLUME_DFC },
  ]

  const infoText = `Displayed values were taken at block ${statistics.meta.analysedAt}. Technically the last 24 hours are 2880 blocks and 30 days are 86400 blocks. It is important to understand that we are only analyzing the defichain side of Quantum. Prices are taken from defichain oracles'`

  return (
    <Layout page="Quantum" full maxWidth withoutSupport>
      <h1>Quantum</h1>
      <div className="flex flex-row flex-wrap py-8 gap-16 flex-grow justify-center items-start w-full">
        <StaticEntry type="info" text={infoText} variableHeight />
        {charts.map((info, index) => {
          const data = toChartData(statistics, info)
          const { content, labels, percentages, colors } = generateTableContent(data, info)
          return (
            <div key={index} className="flex flex-col items-center gap-4">
              <h3>{info.title}</h3>
              <DonutChart chartData={data} />
              {info.showTable && (
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
              )}
            </div>
          )
        })}
      </div>
      <HistoryChart history={history} items={historyItems} toLineChartData={toLineChartData} toScales={toScales} />
    </Layout>
  )
}

export default Quantum
