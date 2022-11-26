import { faClipboard } from '@fortawesome/free-solid-svg-icons'
import { useReinvestContext } from '../../contexts/reinvest.context'
import { generateReinvestStringBasedOn } from '../../lib/reinvest.lib'
import { ThemedIconButton } from '../base/themed-icon-button'

export default function ReinvestResult(): JSX.Element {
  const { entries } = useReinvestContext()

  const copyToClipboard = () => {
    const textToCopy = generateReinvestStringBasedOn(entries)
    if (window.isSecureContext && navigator && navigator.clipboard) navigator.clipboard.writeText(textToCopy)
  }

  return (
    <div className="bg-light rounded-lg h-12 w-full px-2 py-1 md:w-96">
      <div className="bg-dark rounded-lg w-full h-full flex flex-row items-center gap-1 px-2">
        {entries.length === 0 ? (
          <p className="grow text-center">Please add targets</p>
        ) : (
          <p className="grow truncate">{generateReinvestStringBasedOn(entries)}</p>
        )}

        <ThemedIconButton
          className="w-10 h-full"
          color="#fff"
          hoverColor="#ff00af"
          icon={faClipboard}
          onClick={() => copyToClipboard()}
          useCheckmarkAnimation
        />
      </div>
    </div>
  )
}
