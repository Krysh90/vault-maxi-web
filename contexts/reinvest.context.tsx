import { Component, createContext, ReactNode } from 'react'
import { ReinvestTarget } from '../dtos/reinvest-target.dto'

interface ReinvestContextProviderState {
  targets: ReinvestTarget[]
}

interface ReinvestContextUpdateStateArg {
  key: keyof ReinvestContextProviderState
  value: ReinvestTarget[]
}

interface ReinvestContext {
  state: ReinvestContextProviderState
  update: (arg: ReinvestContextUpdateStateArg) => void
}

export const ReinvestContext = createContext({} as ReinvestContext)

export class ReinvestContextProvider extends Component<{ children?: ReactNode }, ReinvestContextProviderState> {
  public readonly state = {
    targets: [],
  }

  private update = ({ key, value }: ReinvestContextUpdateStateArg) => {
    this.setState({ [key]: value })
  }

  public render() {
    const store: ReinvestContext = {
      state: this.state,
      update: this.update,
    }

    return <ReinvestContext.Provider value={store}>{this.props.children}</ReinvestContext.Provider>
  }
}

export const ReinvestContextConsumer = ReinvestContext.Consumer
