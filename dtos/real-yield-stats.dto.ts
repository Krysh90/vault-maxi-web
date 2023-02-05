export interface RealYieldStats {
  meta: { tstamp: string; startHeight: number; endHeight: number }
  date: string
  totalUSD: RealYieldInfo
  tokens: Record<string, RealYieldInfo>
}

export interface RealYieldInfo {
  commission: number
  commissionInUSD: number
  fee: number
  feeInUSD: number
  usdValue?: number
}
