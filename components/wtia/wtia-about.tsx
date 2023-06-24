import { useWTIA } from '../../hooks/wtia.hook'

export function WTIAAbout(): JSX.Element {
  const { waitBlocks } = useWTIA()
  return (
    <>
      <p>On Changi network and with this SmartContract you can gamble away your TestNet DFI</p>
      <p className="py-2">
        If nobody gambles new DFI for {waitBlocks} blocks. The last one who gambled, can claim half of all gambled DFI,
        the other half will be burned. If the gambler is not claiming a new gamble starts the {waitBlocks} blocks to
        wait again.
      </p>
    </>
  )
}
