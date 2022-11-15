import { Component, createContext, ReactNode } from 'react'
import { ReinvestTarget } from '../dtos/reinvest-target.dto'

interface ReinvestContextProps {
  targets: ReinvestTarget[]
  update: (targets: ReinvestTarget[]) => void
}

export const ReinvestContext = createContext({} as ReinvestContextProps)

export class ReinvestContextProvider extends Component<{ children?: ReactNode }, { targets: ReinvestTarget[] }> {
  private update = (targets: ReinvestTarget[]) => {
    this.setState({ targets })
  }

  public render() {
    const store: ReinvestContextProps = {
      targets: this.state?.targets ?? [],
      update: this.update,
    }

    return <ReinvestContext.Provider value={store}>{this.props.children}</ReinvestContext.Provider>
  }
}

export const ReinvestContextConsumer = ReinvestContext.Consumer
