import 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import { ChartData } from '../../dtos/chart-data.dto'

interface DonutChartProps {
  chartData: ChartData
  disabled?: boolean
}

export default function DonutChart({ disabled, chartData }: DonutChartProps): JSX.Element {
  function getChartData(): ChartData {
    const data = chartData
    if (disabled) {
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
        className="self-center"
        data={getChartData()}
        options={{
          cutout: '66%',
          elements: { arc: { borderWidth: 0 } },
          plugins: { legend: { display: false } },
          resizeDelay: 500,
          events: disabled ? [] : undefined,
        }}
      />
    </div>
  )
}
