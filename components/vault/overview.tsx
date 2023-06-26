import { TokenDropZone } from './token-drop-zone'

export function VaultOverview(): JSX.Element {
  return (
    <div className="p-2 w-full lg:w-half">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl text-white">Your vault</h1>
        <p>TODO vault scheme</p>
      </div>
      <div className="flex flex-col p-4 gap-2">
        <TokenDropZone type="Collateral" />
        <TokenDropZone type="Loan" />
      </div>
    </div>
  )
}
