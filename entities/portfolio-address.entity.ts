import { regex } from '../definitions/regex'

export class PortfolioAddress {
  private readonly address: string
  label?: string
  isLOCKUserAddress: boolean

  private constructor(address: string = '') {
    this.address = address
    this.isLOCKUserAddress = false
  }

  static new(): PortfolioAddress {
    return new PortfolioAddress()
  }

  static from({ address }: { address: string }): PortfolioAddress {
    return new PortfolioAddress(address)
  }

  isValid(): boolean {
    return regex.address.test(this.address)
  }
}
