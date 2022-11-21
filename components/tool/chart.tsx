import { useContext } from 'react'
import { ReinvestContext } from '../../contexts/reinvest.context'
import 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import { toChartData } from '../../lib/reinvest.lib'

export interface ChartProps {}

export default function Chart({}: ChartProps) {
  const reinvestContext = useContext(ReinvestContext)

  return (
    <div className="flex flex-col gap-8 items-center w-64">
      <Doughnut
        className="self-center"
        data={toChartData(reinvestContext.entries)}
        options={{
          cutout: '66%',
          elements: { arc: { borderWidth: 0 } },
          plugins: { legend: { display: false } },
          resizeDelay: 500,
        }}
      />
    </div>
  )
}
