export interface DUSDVolumeStats {
  meta: { tstamp: string; startHeight: number; endHeight: number }
  bots: DUSDVolume
  organic: DUSDVolume
}

export interface DUSDVolume {
  buying: string
  selling: string
}
