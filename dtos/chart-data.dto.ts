export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  data: number[]
  backgroundColor: string[]
  hoverOffset: number
  label?: string
  borderColor?: string[]
  yAxisID?: string
}
