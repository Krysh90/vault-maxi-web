import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import { VaultStats } from '../../dtos/vault-stats.dto'
import { StatisticsChartDataType, toLineChartData } from '../../lib/statistics.lib'

interface HistoryChartProps {
  history: VaultStats[]
}

export default function HistoryChart({ history }: HistoryChartProps): JSX.Element {
  return (
    <div className="flex flex-row flex-wrap items-start justify-between">
      <Line
        className="self-center"
        data={toLineChartData(history, StatisticsChartDataType.NUMBER_OF_VAULTS)}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom' as const,
              labels: { usePointStyle: true, color: '#fff' },
            },
          },
        }}
      />
      <div>
        <h3>History data</h3>
        <ul className="list">
          <li>number of vaults</li>
          <li>avg coll ratio</li>
          <li>strategy</li>
          <li>donations</li>
        </ul>
      </div>
    </div>
  )
}
