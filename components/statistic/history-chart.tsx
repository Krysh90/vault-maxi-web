import 'chart.js/auto'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { ChartData } from '../../dtos/chart-data.dto'
import { HistoryChartItem, LineChartInfo, LineChartTimeFrame } from '../../lib/chart.lib'
import RadioButtons from '../base/radio-buttons'
import Selection from '../base/selection'

interface HistoryChartProps {
  history: any[]
  items: HistoryChartItem[]
  toLineChartData: (history: any[], { type, timeFrame }: LineChartInfo, additionalHistory?: any[]) => ChartData
  toScales: (type: string) => any
  additionalHistory?: any[]
  showZeroLine?: boolean
}

export default function HistoryChart({
  history,
  items,
  toLineChartData,
  toScales,
  additionalHistory,
  showZeroLine,
}: HistoryChartProps): JSX.Element {
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
          data={toLineChartData(
            history,
            { type: currentChartData.type, timeFrame: currentTimeFrame },
            additionalHistory,
          )}
          options={getOptions(toScales(currentChartData.type), currentChartData.showZeroLine)}
        />
        <div className="flex flex-col gap-2 pl-10">
          <h3 className="text-white">History of</h3>
          <RadioButtons items={items} onChanged={(index) => setCurrentChartData(items[index])} preselectIndex={0} />
        </div>
      </div>
    </div>
  )
}

function getOptions(scales: any, showZeroLine?: boolean) {
  var options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, color: '#fff' },
      },
      annotation: {},
    },
    scales,
  }
  if (showZeroLine) {
    options = {
      ...options,
      plugins: {
        ...options.plugins,
        annotation: {
          annotations: {
            zeroLine: {
              type: 'line',
              yMin: 0,
              yMax: 0,
              borderColor: 'rgb(255, 255, 255)',
              borderWidth: 1,
            },
          },
        },
      },
    }
  }
  return options
}
