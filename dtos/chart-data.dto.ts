export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  data: number[]
  backgroundColor: (string | CanvasGradient | undefined)[]
  hoverOffset: number
}
