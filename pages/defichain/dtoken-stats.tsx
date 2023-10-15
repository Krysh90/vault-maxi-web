import { NextPage } from 'next'
import Layout from '../../components/core/layout'
import { DTokenStats } from '../../dtos/dtoken-stats.dto'
import {
  DTokenStatsChartDataType,
  DUSDStatsChartDataType,
  historyDaysToLoad,
  toChartData,
  toLineChartData,
  toScales,
} from '../../lib/dtoken-stats.lib'
import DonutChart from '../../components/base/donut-chart'
import { StaticEntry } from '../../components/base/static-entry'
import { formatNumber, generateTableContent } from '../../lib/chart.lib'
import HistoryChart from '../../components/statistic/history-chart'
import { TableRow } from '../../components/statistic/table-row'

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
      keywords: ['algo', 'backed'],
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
      keywords: ['Mint', 'Burn'],
    },
    {
      title: 'dUSD Volume',
      type: DUSDStatsChartDataType.VOLUME,
      inDollar: false,
      sort: false,
      customAlgo: false,
      showOverlay: false,
      showTotal: false,
      showLine: true,
      calculateDelta: false,
      keywords: ['buys', 'sells'],
    },
    {
      title: 'dUSD circulating supply',
      type: DUSDStatsChartDataType.CIRCULATING_SUPPLY,
      inDollar: false,
      sort: false,
      customAlgo: false,
      showOverlay: false,
      showTotal: true,
      showLine: false,
      calculateDelta: false,
      keywords: [],
    },
    {
      title: 'dUSD distribution',
      type: DUSDStatsChartDataType.DISTRIBUTION,
      inDollar: false,
      sort: true,
      customAlgo: false,
      showOverlay: false,
      showTotal: true,
      showLine: false,
      calculateDelta: false,
      keywords: [],
    },
  ]

  const historyItems = [
    { label: 'Algo', type: DTokenStatsChartDataType.ALGO },
    { label: 'Backed', type: DTokenStatsChartDataType.BACKED },
    { label: 'Algo Ratio', type: DTokenStatsChartDataType.RATIO },
    { label: 'FutureSwap', type: DTokenStatsChartDataType.FUTURESWAP },
    { label: 'dUSD Volume', type: DUSDStatsChartDataType.VOLUME, showZeroLine: true },
    { label: 'dUSD Supply', type: DUSDStatsChartDataType.CIRCULATING_SUPPLY },
    { label: 'dUSD Distribution', type: DUSDStatsChartDataType.DISTRIBUTION },
  ]

  const infoText = `Displayed values were taken at block ${statistics.meta.analysedAt}. Shown values are measured in respective oracles prices (1 DUSD = 1$). Displayed future swap prices are current oracle prices and not at the time where the mint or burn occurred. If delta is positive for FutureSwap it means that it created (minted) additional tokens. If delta is negative it means that it destroyed (burned) additional tokens. Additional the dUSD volume was  gathered between blocks ${statistics.meta.startHeight} and ${statistics.meta.endHeight}. Automated buys are performed by Buy and Burn Bot (BBB) and automated sells are performed by CAKEs' Yield Vault, everything else is counted as organic, means that a user bought or sold dUSD.`

  return (
    <Layout page="dToken stats" full maxWidth withoutSupport>
      <h1>dToken stats</h1>
      <div className="flex flex-row flex-wrap py-8 gap-16 flex-grow justify-center items-start w-full">
        <div className="max-w-lg flex flex-col gap-2">
          <p>
            As a short explanation on how we as a community and blockchain drifted into such a situation with such high
            algo ratios.
          </p>
          <p>
            In the beginning of the dToken system we had a big premium of 25 to 50% on dUSD and dToken. In order to
            reduce this premium, the community decided via Twitter Spaces that we should use DFI to payback dUSD loans.
            DFI at this time was between 3 and 5$.
          </p>
          <p>
            Those DFI got burned and created the first algo dUSD. Total created dUSD via this mechanism were{' '}
            {formatNumber(statistics.dTokens.find((entry) => entry.key === 'DUSD')?.minted.dfipayback ?? 0)}. This
            mechanism got turned off.
          </p>
          <p>
            To keep the dToken premium within a range of +/-5%, the FutureSwap (FS) was created which swaps dUSD to
            dToken and back. Since this could create algo dUSD (more dUSD minted than burned) over time, we created this
            page to show the current state.
          </p>
          <p>
            In the following graphs if the delta of FS shows a positive number it means it created more algo tokens than
            it burned. If the delta of FS shows a negative number it means it burned more token than it created.
          </p>
        </div>
        <StaticEntry type="info" text={infoText} variableHeight />
        {charts.map((info, index) => {
          const data = toChartData(statistics, info)
          const { content, labels, percentages, colors } = generateTableContent(
            data,
            info,
            info.showTotal,
            info.customAlgo,
            info.calculateDelta,
            info.keywords,
          )
          return (
            <div key={index} className="flex flex-col items-center gap-4">
              <h3>{info.title}</h3>
              <div className="relative">
                <DonutChart chartData={data} />
                {info.showOverlay && (
                  <>
                    <p className="absolute top-28 right-[8.5rem] text-end">{info.keywords[1]}</p>
                    <div className="bg-white w-[1px] absolute inset-0 left-32" />
                    <p className="absolute top-28 left-36 text-start">{info.keywords[0]}</p>
                  </>
                )}
                {info.showLine && <div className="bg-white w-[1px] absolute inset-0 left-32" />}
              </div>

              <div className="table table-fixed min-w-full">
                {content.map((entry, index) =>
                  labels[index].length > 0 ? (
                    <TableRow
                      key={index}
                      entry={entry}
                      index={index}
                      labels={labels}
                      percentages={percentages}
                      colors={colors}
                      isLast={index === content.length - 1}
                      showPercentage={info.type !== DUSDStatsChartDataType.VOLUME}
                    />
                  ) : null,
                )}
              </div>
            </div>
          )
        })}
      </div>
      <HistoryChart history={history} items={historyItems} toLineChartData={toLineChartData} toScales={toScales} />
    </Layout>
  )
}

export default DTokenStatsPage
