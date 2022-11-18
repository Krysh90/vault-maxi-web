export interface ReinvestTarget {
  id: string
  value: number
  name?: string
  target: {
    type?: ReinvestTargetType
    value?: string
    isValid: boolean
  }
}

export enum ReinvestTargetType {
  WALLET,
  VAULT,
}
