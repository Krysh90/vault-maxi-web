import { NextPage } from 'next'
import Layout from '../../components/core/layout'
import { DTokenStats } from '../../dtos/dtoken-stats.dto'
import {
  DTokenStatsChartDataType,
  historyDaysToLoad,
  toChartData,
  toLineChartData,
  toScales,
} from '../../lib/dtoken-stats.lib'
import DonutChart from '../../components/base/donut-chart'
import { StaticEntry } from '../../components/base/static-entry'
import { generateTableContent } from '../../lib/chart.lib'
import HistoryChart from '../../components/statistic/history-chart'

export async function getStaticProps(): Promise<{ props: DTokenStatsProps; revalidate: number }> {
  const res = await fetch('https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/dToken/latest.json')
  const statistics: DTokenStats = await res.json()
  const history = await Promise.all<DTokenStats>(
    historyDaysToLoad()
      .map((date) => `https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/dToken/${date}.json`)
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

interface DTokenStatsProps {
  statistics: DTokenStats
  history: DTokenStats[]
}

const DTokenStatsPage: NextPage<DTokenStatsProps> = ({ statistics, history }: DTokenStatsProps) => {
  const charts = [
    {
      title: 'Distribution',
      type: DTokenStatsChartDataType.DISTRIBUTION,
      inDollar: true,
      sort: false,
      customAlgo: true,
      showOverlay: true,
      showTotal: false,
      showLine: false,
      calculateDelta: false,
    },
    {
      title: 'FutureSwap',
      type: DTokenStatsChartDataType.FUTURESWAP,
      inDollar: true,
      sort: false,
      customAlgo: false,
      showOverlay: false,
      showTotal: false,
      showLine: true,
      calculateDelta: true,
    },
  ]

  const historyItems = [
    { label: 'Distribution', type: DTokenStatsChartDataType.DISTRIBUTION },
    { label: 'FutureSwap', type: DTokenStatsChartDataType.FUTURESWAP },
  ]

  const infoText = `Displayed values were taken at block ${statistics.meta.analysedAt}. Shown values are measured in respective oracles prices (1 DUSD = 1$). Displayed future swap prices are current oracle prices and not at the time where the mint or burn occurred. If delta is positive for FutureSwap it means that it created (minted) additional tokens. If delta is negative it means that it destroyed (burned) additional tokens.`

  return (
    <Layout page="dToken stats" full maxWidth withoutSupport>
      <h1>dToken stats</h1>
      <div className="flex flex-row flex-wrap py-8 gap-16 flex-grow justify-center items-start w-full">
        <StaticEntry type="info" text={infoText} variableHeight />
        {charts.map((info, index) => {
          const data = toChartData(statistics, info)
          const { content, labels, percentages, colors } = generateTableContent(
            data,
            info,
            info.showTotal,
            info.customAlgo,
            info.calculateDelta,
          )
          return (
            <div key={index} className="flex flex-col items-center gap-4">
              <h3>{info.title}</h3>
              <div className="relative">
                <DonutChart chartData={data} />
                {info.showOverlay && (
                  <>
                    <p className="absolute top-28 right-[8.5rem] text-end">Backed</p>
                    <div className="bg-white w-[1px] absolute inset-0 left-32" />
                    <p className="absolute top-28 left-36 text-start">Algo</p>
                  </>
                )}
                {info.showLine && <div className="bg-white w-[1px] absolute inset-0 left-32" />}
              </div>

              <div className="table table-fixed min-w-full">
                {content.map((entry, index) => (
                  <TableRow
                    key={index}
                    entry={entry}
                    index={index}
                    labels={labels}
                    percentages={percentages}
                    colors={colors}
                    isLast={index === content.length - 1}
                  />
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

function TableRow({
  entry,
  index,
  labels,
  percentages,
  colors,
  isLast,
}: {
  entry: string
  index: number
  labels: string[]
  percentages: string[]
  colors: string[]
  isLast: boolean
}): JSX.Element {
  return (
    <div className="table-row">
      <div
        className={'table-cell text-left py-1'
          .concat(isLast ? '' : ' border-b border-b-light')
          .concat(index > 0 ? ' border-r border-r-light' : '')}
      >
        <div className="flex flex-row items-center gap-1">
          {index !== 0 && <div className="w-1 h-4" style={{ backgroundColor: colors[index] }} />}
          {labels[index]}
        </div>
      </div>
      <div
        className={'table-cell text-center align-middle'
          .concat(isLast ? '' : ' border-b border-b-light')
          .concat(index > 0 ? ' border-r border-r-light' : '')}
      >
        {index > 0 && percentages[index].length > 0 ? `${percentages[index]}%` : ''}
      </div>
      <div className={'table-cell text-right align-middle'.concat(isLast ? '' : ' border-b border-b-light')}>
        {entry}
      </div>
    </div>
  )
}

export default DTokenStatsPage
