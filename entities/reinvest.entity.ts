import uuid from 'react-uuid'

const addressRegex = /^(8\w{33}|d\w{33}|d\w{41})$/
const vaultRegex = /^[a-f0-9]{64}$/i

export enum ReinvestTargetType {
  WALLET,
  VAULT,
}

export class Reinvest {
  public readonly id: string
  public readonly value: number
  public readonly token?: string
  public readonly target?: string

  private constructor() {
    this.id = uuid()
    this.value = 0
  }

  public update(values: Partial<Reinvest>): this {
    Object.assign(this, { ...values })
    return this
  }

  public getReinvestString(): string {
    return `${this.token}${this.reinvestValuePart()}${this.reinvestTargetPart()}`
  }

  public isValid(): boolean {
    return this.token !== undefined && this.isTargetValid()
  }

  public isTargetValid(): boolean {
    return this.target === undefined || this.target.match(addressRegex) != null || this.target.match(vaultRegex) != null
  }

  public getTargetType(): ReinvestTargetType | undefined {
    if (this.target && this.target.match(addressRegex)) return ReinvestTargetType.WALLET
    else if (this.target && this.target.match(vaultRegex)) return ReinvestTargetType.VAULT
    else return undefined
  }

  public static create(): Reinvest {
    return new Reinvest()
  }

  private reinvestValuePart(): string {
    return this.value > 0 ? `:${this.value}` : ''
  }

  private reinvestTargetPart(): string {
    const divider = this.reinvestValuePart().length > 0 ? ':' : '::'
    return this.target ? `${divider}${this.target}` : ''
  }
}
