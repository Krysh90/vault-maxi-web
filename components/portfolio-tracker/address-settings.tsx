import { usePortfolioTrackerContext } from '../../contexts/portfolio-tracker.context'
import { Button, ButtonStyle } from '../base/button'
import { StaticEntry } from '../base/static-entry'

export function AddressSettings(): JSX.Element {
  const { addresses, loadAddresses } = usePortfolioTrackerContext()
  function onAdd(): void {
    console.log('clicked')
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <div className="flex flex-row justify-between">
        <h3>Addresses</h3>
        <Button title="Load" style={ButtonStyle.PRIMARY} onClick={() => loadAddresses(addresses)} />
      </div>
      <StaticEntry type="add" add={onAdd} />
    </div>
  )
}
