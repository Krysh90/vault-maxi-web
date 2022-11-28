import 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import { toChartData } from '../../lib/reinvest.lib'
import { useReinvestContext } from '../../contexts/reinvest.context'
import { ChartData } from '../../dtos/chart-data.dto'
import { useRef } from 'react'

export default function Chart(): JSX.Element {
  const { entries, showWarning } = useReinvestContext()
  const chartRef = useRef()

  function getChartData(): ChartData {
    const chartInfo = chartRef.current as any
    const data = toChartData(entries, { ...chartInfo })
    if (showWarning) {
      data.datasets = data.datasets.map((c) => {
        c.backgroundColor = ['#333']
        return c
      })
    }
    return data
  }

  return (
    <div className="flex flex-col gap-8 items-center w-64">
      <Doughnut
        ref={chartRef}
        className="self-center"
        data={getChartData()}
        options={{
          cutout: '66%',
          elements: { arc: { borderWidth: 0 } },
          plugins: { legend: { display: false } },
          resizeDelay: 500,
          events: showWarning ? [] : undefined,
        }}
      />
    </div>
  )
}
