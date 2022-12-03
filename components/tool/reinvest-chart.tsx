import { useReinvestContext } from '../../contexts/reinvest.context'
import { toChartData } from '../../lib/reinvest.lib'
import DonutChart from '../base/donut-chart'

export default function ReinvestChart(): JSX.Element {
  const { entries, showWarning } = useReinvestContext()
  return <DonutChart chartData={toChartData(entries)} disabled={showWarning} />
}
