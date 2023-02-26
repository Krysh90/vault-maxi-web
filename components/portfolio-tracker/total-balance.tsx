import DonutChart from '../base/donut-chart'

export function TotalBalance(): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-4">
      <h3>Total balance</h3>
      <DonutChart
        chartData={{
          labels: ['loading'],
          datasets: [{ data: [1], backgroundColor: ['#222'], hoverOffset: 4 }],
        }}
      />
    </div>
  )
}
