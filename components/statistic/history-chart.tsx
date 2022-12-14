import 'chart.js/auto'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { VaultStats } from '../../dtos/vault-stats.dto'
import { LineChartTimeFrame, StatisticsChartDataType, toLineChartData, toScales } from '../../lib/statistics.lib'
import RadioButtons from '../base/radio-buttons'
import Selection from '../base/selection'

interface HistoryChartProps {
  history: VaultStats[]
}

interface HistoryChartItem {
  label: string
  type: StatisticsChartDataType
}

export default function HistoryChart({ history }: HistoryChartProps): JSX.Element {
  const items = [
    { label: 'number of vaults', type: StatisticsChartDataType.NUMBER_OF_VAULTS },
    { label: 'average collateral ratio', type: StatisticsChartDataType.AVERAGE_COLLATERAL_RATIO },
    { label: 'collateral per strategy', type: StatisticsChartDataType.COLLATERAL },
    { label: 'vaults per strategy', type: StatisticsChartDataType.STRATEGY },
    { label: 'number of donating Vault Maxis', type: StatisticsChartDataType.DONATION },
  ]
  const [currentChartData, setCurrentChartData] = useState<HistoryChartItem>(items[0])
  const [currentTimeFrame, setCurrentTimeFrame] = useState<LineChartTimeFrame>(LineChartTimeFrame.ALL)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 md:pl-14">
        <p>Shown time frame:</p>
        <Selection
          items={Object.values(LineChartTimeFrame)}
          onChanged={(item) => setCurrentTimeFrame(item as LineChartTimeFrame)}
          selectedItem={currentTimeFrame}
        />
      </div>
      <div className="flex flex-row flex-wrap items-start justify-between">
        <Line
          className="self-center"
          data={toLineChartData(history, { type: currentChartData.type, timeFrame: currentTimeFrame })}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom' as const,
                labels: { usePointStyle: true, color: '#fff' },
              },
            },
            scales: toScales(currentChartData.type),
          }}
        />
        <div className="flex flex-col gap-2 pl-10">
          <h3 className="text-white">History of</h3>
          <RadioButtons items={items} onChanged={(index) => setCurrentChartData(items[index])} preselectIndex={0} />
        </div>
      </div>
    </div>
  )
}
