import uuid from 'react-uuid'
import { regex } from '../definitions/regex'
import { Token } from '../dtos/token.dto'

export enum ReinvestTargetType {
  WALLET,
  VAULT,
}

export class Reinvest {
  public readonly id: string
  public readonly value: number
  public readonly token?: Token
  public readonly target?: string

  static Constants = { wallet: 'wallet', vault: 'vault' }

  private constructor(token?: Token) {
    this.id = uuid()
    this.value = 0
    this.token = token
  }

  public update(values: Partial<Reinvest>): this {
    Object.assign(this, { ...values })
    return this
  }

  public getReinvestString(): string {
    return `${this.token?.symbol}${this.reinvestValuePart()}${this.reinvestTargetPart()}`
  }

  public isValid(): boolean {
    return this.token !== undefined && this.isTargetValid()
  }

  public isTargetValid(): boolean {
    return (
      this.target === undefined ||
      this.target.match(regex.address) != null ||
      this.target === Reinvest.Constants.wallet ||
      this.isTargetVaultValid()
    )
  }

  public getTargetType(): ReinvestTargetType {
    if (
      (this.target && this.target.match(regex.vault)) ||
      this.target === Reinvest.Constants.vault ||
      (!this.target && (this.token?.canBeCollateral ?? false))
    )
      return ReinvestTargetType.VAULT
    else return ReinvestTargetType.WALLET
  }

  isTargetVaultValid(): boolean {
    return (
      ((this.target && this.target.match(regex.vault)) || this.target === Reinvest.Constants.vault) &&
      (this.token?.canBeCollateral ?? false)
    )
  }

  public static create(defaultToken?: Token): Reinvest {
    return new Reinvest(defaultToken)
  }

  private reinvestValuePart(): string {
    return this.value > 0 ? `:${this.value}` : ''
  }

  private reinvestTargetPart(): string {
    const divider = this.reinvestValuePart().length > 0 ? ':' : '::'
    return this.target ? `${divider}${this.target}` : ''
  }
}
