export interface VolumeStats {
  meta: { tstamp: string; analysedAt: number; startHeight: number; endHeight: number }
  dfiVolume: VolumeInfo[]
}

export interface VolumeInfo {
  symbol: string
  totalBuying: number
  totalSelling: number
  buyingFromBigSwaps: number
  sellingFromBigSwaps: number
}
