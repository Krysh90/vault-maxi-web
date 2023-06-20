import { useEffect } from 'react'
import { useWalletContext } from '../../contexts/wallet.context'
import { useWTIA } from '../../hooks/wtia.hook'

export function WTIAOverview(): JSX.Element {
  const { block } = useWalletContext()
  const { balance, lastGambler, lastInputBlock, nextMinAmount, reload } = useWTIA()
  function blank(value?: string): string | undefined {
    if (!value) return undefined
    return `${value.substring(0, 6)}...${value.slice(-4)}`
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block])

  const data = [
    { id: 0, title: 'Current block', value: block },
    { id: 1, title: 'Balance', value: `${balance?.toString()} DFI` },
    { id: 2, title: 'Last gambler', value: blank(lastGambler) },
    { id: 3, title: 'Last input block', value: lastInputBlock?.toString() },
    { id: 4, title: 'Next min amount', value: `${nextMinAmount?.toString()} DFI` },
  ]

  return (
    <>
      {data.map((entry) => (
        <div key={entry.id} className="flex flex-row justify-between">
          <p>{entry.title}</p>
          <p>{entry.value}</p>
        </div>
      ))}
    </>
  )
}
