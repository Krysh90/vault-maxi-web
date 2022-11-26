import 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import { toChartData } from '../../lib/reinvest.lib'
import { useReinvestContext } from '../../contexts/reinvest.context'

export interface ChartProps {}

export default function Chart({}: ChartProps): JSX.Element {
  const { entries } = useReinvestContext()

  return (
    <div className="flex flex-col gap-8 items-center w-64">
      <Doughnut
        className="self-center"
        data={toChartData(entries)}
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
