import { NextPage } from 'next'
import DonutChart from '../../components/base/donut-chart'
import { StaticEntry } from '../../components/base/static-entry'
import Layout from '../../components/core/layout'
import HistoryChart from '../../components/statistic/history-chart'
import { QuantumStats } from '../../dtos/quantum-stats.dto'
import { generateTableContent } from '../../lib/chart.lib'
import { historyDaysToLoad, QuantumChartDataType, toChartData, toLineChartData, toScales } from '../../lib/quantum.lib'
import { useMemo, useState } from 'react'

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
  const [showsQuantumData, setShowsQuantumData] = useState(false)

  const charts = useMemo(
    () => [
      {
        title: 'Liquidity in $',
        type: showsQuantumData ? QuantumChartDataType.QUANTUM_LIQUIDITY : QuantumChartDataType.LIQUIDITY,
        inDollar: true,
        sort: false,
        showTable: false,
      },
      {
        title: 'Volume to Ethereum',
        type: showsQuantumData ? QuantumChartDataType.QUANTUM_VOLUME_ETH : QuantumChartDataType.VOLUME_ETH,
        inDollar: true,
        sort: true,
        showTable: true,
      },
      {
        title: 'Volume to defichain',
        type: showsQuantumData ? QuantumChartDataType.QUANTUM_VOLUME_DFC : QuantumChartDataType.VOLUME_DFC,
        inDollar: true,
        sort: true,
        showTable: true,
      },
    ],
    [showsQuantumData],
  )

  const historyItems = useMemo(() => {
    const entries = [
      {
        label: 'Liquidity on defichain in $',
        type: showsQuantumData ? QuantumChartDataType.QUANTUM_LIQUIDITY_DFC : QuantumChartDataType.LIQUIDITY_DFC,
      },
      {
        label: 'Liquidity on Ethereum in $',
        type: showsQuantumData ? QuantumChartDataType.QUANTUM_LIQUIDITY_ETH : QuantumChartDataType.LIQUIDITY_ETH,
      },
      {
        label: 'Volume to defichain in $',
        type: showsQuantumData ? QuantumChartDataType.QUANTUM_VOLUME_DFC : QuantumChartDataType.VOLUME_DFC,
      },
      {
        label: 'Volume to Ethereum in $',
        type: showsQuantumData ? QuantumChartDataType.QUANTUM_VOLUME_ETH : QuantumChartDataType.VOLUME_ETH,
      },
    ]
    return entries.concat(
      showsQuantumData
        ? [
            { label: 'Total volume to defichain in $', type: QuantumChartDataType.QUANTUM_TOTAL_VOLUME_DFC },
            { label: 'Total volume to Ethereum in $', type: QuantumChartDataType.QUANTUM_TOTAL_VOLUME_ETH },
          ]
        : [],
    )
  }, [showsQuantumData])

  const infoText = `Displayed values were taken at block ${statistics.meta.analysedAt}. Technically the last 24 hours are 2880 blocks and 30 days are 86400 blocks. Prices are taken from defichain oracles'`

  return (
    <Layout page="Quantum" full maxWidth withoutSupport>
      <h1 className="pb-8">Quantum</h1>
      <StaticEntry type="info" text={infoText} variableHeight />
      <div className="py-8">
        <Slider
          value={showsQuantumData}
          titleOff="Analysed data"
          titleOn="Quantum data"
          onChange={setShowsQuantumData}
        />
      </div>
      <div className="flex flex-row flex-wrap py-8 gap-16 flex-grow justify-center items-start w-full">
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

function Slider({
  value,
  titleOff,
  titleOn,
  onChange,
}: {
  value: boolean
  titleOff: string
  titleOn: string
  onChange: (value: boolean) => void
}): JSX.Element {
  const [isOn, setIsOn] = useState(value)

  function getTextColor(type: 'on' | 'off'): string {
    return (type === 'on' && isOn) || (type === 'off' && !isOn) ? 'text-white' : 'text-light'
  }

  return (
    <button
      className="flex flex-row gap-2 items-center"
      onClick={() => {
        onChange(!isOn)
        setIsOn(!isOn)
      }}
    >
      <p className={getTextColor('off')}>{titleOff}</p>
      <div
        className={`rounded-full bg-main h-3 w-6 flex flex-row items-center px-0.5 ${
          isOn ? 'justify-end' : 'justify-start'
        }`}
      >
        <div className="rounded-full bg-dark h-2 w-2" />
      </div>
      <p className={getTextColor('on')}>{titleOn}</p>
    </button>
  )
}
