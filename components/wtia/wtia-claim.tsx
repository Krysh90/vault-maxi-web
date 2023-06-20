import BigNumber from 'bignumber.js'
import { useWalletContext } from '../../contexts/wallet.context'
import { useWTIA } from '../../hooks/wtia.hook'
import { Button } from '../base/button'

export function WTIAClaim(): JSX.Element {
  const { address, block } = useWalletContext()
  const { waitBlocks, lastGambler, lastInputBlock, claim } = useWTIA()

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        {lastGambler === address ? (
          <>
            <p>Blocks to wait</p>
            <p>
              {Math.max(
                0,
                new BigNumber(lastInputBlock ?? 0)
                  .plus(waitBlocks ?? 0)
                  .minus(block ?? 0)
                  .toNumber(),
              )}{' '}
              blocks
            </p>
          </>
        ) : (
          <p>You need to be the last gambler in order to claim</p>
        )}
      </div>
      <Button
        label="Claim"
        onClick={() => claim()}
        disabled={
          new BigNumber(lastInputBlock ?? 0)
            .plus(waitBlocks ?? 0)
            .minus(block ?? 0)
            .toNumber() > 0 || lastGambler !== address
        }
      />
    </>
  )
}
