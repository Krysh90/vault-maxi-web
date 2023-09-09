import { NextPage } from 'next'
import { VolumeStats } from '../../dtos/volume.dto'
import { VolumeChartDataType, historyDaysToLoad, toChartData, toLineChartData, toScales } from '../../lib/volume.lib'
import Layout from '../../components/core/layout'
import { StaticEntry } from '../../components/base/static-entry'
import { generateTableContent } from '../../lib/chart.lib'
import DonutChart from '../../components/base/donut-chart'
import HistoryChart from '../../components/statistic/history-chart'
import { TableRow } from '../../components/statistic/table-row'

export async function getStaticProps(): Promise<{ props: StatisticsProps; revalidate: number }> {
  const res = await fetch('https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/dfiVolumes/latest.json')
  const statistics: VolumeStats = await res.json()
  const history = await Promise.all<VolumeStats>(
    historyDaysToLoad()
      .map((date) => `https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/dfiVolumes/${date}.json`)
      .map((url) =>
        fetch(url)
          .then((res) => res.json())
          .catch(() => {}),
      ),
  ).then((stats) => stats.filter((stat) => stat !== undefined))
  return { props: { statistics, history }, revalidate: 3600 }
}

interface StatisticsProps {
  statistics: VolumeStats
  history: VolumeStats[]
}

const Volume: NextPage<StatisticsProps> = ({ statistics, history }: StatisticsProps) => {
  const charts = [
    {
      title: 'Volume',
      type: VolumeChartDataType.VOLUME,
      inDollar: false,
      sort: false,
      showOverlay: true,
      showLine: true,
      showTotal: false,
      calculateDelta: true,
      deltaKeyWords: ['bought', 'sold'],
      buildCustomVolume: true,
    },
    {
      title: 'Volume above TODO$',
      type: VolumeChartDataType.BIG_SWAPS_VOLUME,
      inDollar: false,
      sort: false,
      showOverlay: true,
      showLine: true,
      showTotal: false,
      calculateDelta: true,
      deltaKeyWords: ['bought', 'sold'],
      buildCustomVolume: true,
    },
  ]

  const historyItems = [
    { label: 'Volume', type: VolumeChartDataType.VOLUME },
    { label: 'Volume above TODO$', type: VolumeChartDataType.BIG_SWAPS_VOLUME },
  ]

  const infoText = `Displayed volumes were gathered between blocks ${statistics.meta.startHeight} and ${statistics.meta.endHeight}. All displayed values are in DFI. Big swaps are above a value of TODO$`

  return (
    <Layout page="Volume" full maxWidth withoutSupport>
      <h1>Volume</h1>
      <div className="flex flex-row flex-wrap py-8 gap-16 flex-grow justify-center items-start w-full">
        <StaticEntry type="info" text={infoText} variableHeight />
        {charts.map((info, index) => {
          const data = toChartData(statistics, info)
          const { content, labels, percentages, colors } = generateTableContent(
            data,
            info,
            info.showTotal,
            info.buildCustomVolume,
            info.calculateDelta,
            info.deltaKeyWords,
          )
          return (
            <div key={index} className="flex flex-col items-center gap-4">
              <h3>{info.title}</h3>
              <div className="relative">
                <DonutChart chartData={data} />
                {info.showOverlay && (
                  <>
                    <p className="absolute top-28 right-36 text-end">Sells</p>
                    <div className="bg-white w-[1px] absolute inset-0 left-32" />
                    <p className="absolute top-28 left-36 text-start">Buys</p>
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
                      showPercentage
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

export default Volume
