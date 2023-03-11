import BigNumber from 'bignumber.js'
import { NextPage } from 'next'
import DonutChart from '../../components/base/donut-chart'
import { StaticEntry } from '../../components/base/static-entry'
import Layout from '../../components/core/layout'
import HistoryChart from '../../components/statistic/history-chart'
import { QuantumStats, QuantumTokenTxStats } from '../../dtos/quantum-stats.dto'
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
      title: 'Liquidity on defichain',
      type: QuantumChartDataType.LIQUIDITY,
      inDollar: true,
      sort: true,
    },
    {
      title: 'Volume to ETH',
      type: QuantumChartDataType.IN,
      inDollar: true,
      sort: true,
    },
    {
      title: 'Volume to defichain',
      type: QuantumChartDataType.OUT,
      inDollar: true,
      sort: true,
    },
  ]

  const historyItems = [
    { label: 'Number of txs', type: QuantumChartDataType.NUMBER_OF_TXS },
    { label: 'Volume to ETH vs to defichain', type: QuantumChartDataType.VOLUME_IN_VS_OUT },
    { label: 'Volume to ETH', type: QuantumChartDataType.VOLUME_IN },
    { label: 'Volume to defichain', type: QuantumChartDataType.VOLUME_OUT },
    { label: 'Coins to ETH', type: QuantumChartDataType.COINS_IN },
    { label: 'Coins to defichain', type: QuantumChartDataType.COINS_OUT },
    { label: 'Max to ETH swap', type: QuantumChartDataType.MAX_IN_SWAP },
    { label: 'Max to defichain swap', type: QuantumChartDataType.MAX_OUT_SWAP },
  ]

  const infoText = `Displayed values were taken at block ${statistics.meta.analysedAt}. It is important to understand that we are only analyzing the defichain side of Quantum. Prices are taken from defichain oracles'`

  const calculateVolume = (txStats: QuantumTokenTxStats[], useIn: boolean): number => {
    return txStats
      .map((txStats) =>
        new BigNumber(useIn ? txStats.coinsIn : txStats.coinsOut).multipliedBy(txStats.oraclePrice).toNumber(),
      )
      .reduce((prev, curr) => prev + curr, 0)
  }

  return (
    <Layout page="Quantum" full maxWidth withoutSupport>
      <h1>Quantum</h1>
      <div className="py-6 text-lg">
        <div className="pb-4">
          <p className="text-main text-lg">Total volume to defichain</p>
          <p>Last 24 hours: {formatNumber(calculateVolume(statistics.txsInBlocks[2880], false))}$</p>
          <p>Last 30 days: {formatNumber(calculateVolume(statistics.txsInBlocks[86400], false))}$</p>
        </div>
        <div>
          <p className="text-main text-lg">Total volume to ETH</p>
          <p>Last 24 hours: {formatNumber(calculateVolume(statistics.txsInBlocks[2880], true))}$</p>
          <p>Last 30 days: {formatNumber(calculateVolume(statistics.txsInBlocks[86400], true))}$</p>
        </div>
      </div>
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
      <HistoryChart history={history} items={historyItems} toLineChartData={toLineChartData} toScales={toScales} />
    </Layout>
  )
}

export default Quantum
