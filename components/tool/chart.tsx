import { useContext, useEffect } from 'react'
import { ReinvestContext } from '../../contexts/reinvest.context'
import { toChartEntry } from '../../lib/reinvest-generator.lib'

export interface ChartProps {}

export default function Chart({}: ChartProps) {
  const reinvestContext = useContext(ReinvestContext)

  useEffect(() => {
    console.log('chart', reinvestContext.entries)
  }, [reinvestContext.entries])

  return (
    <div className="flex flex-col gap-8 items-center">
      <h1 className="text-main">DonutChart under construction</h1>
      {/* <DonutChart
        items={items}
        size="sm"
        trackWidth="sm"
        trackColor="#333"
        totalTextColor="#fff"
        tooltipSx={{ display: 'none' }}
      /> */}
      <table className="w-[216px]">
        <tbody>
          {reinvestContext.entries
            .filter((entry) => entry.token && entry.value > 0)
            .map((entry) => toChartEntry(entry))
            .map((item, key) => (
              <tr key={key} className="h-10">
                {/* <td>
                  <div className={`w-8 h-8 rounded-full ${item.background}`}></div>
                </td> */}
                <td className="text-center">{item.label}</td>
                <td className="text-center">{item.value}%</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
