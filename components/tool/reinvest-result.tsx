import { faClipboard } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import { ReinvestContext } from '../../contexts/reinvest.context'
import { generateReinvestStringBasedOn } from '../../lib/reinvest-generator.lib'
import { ThemedIconButton } from '../base/themed-icon-button'

export interface ReinvestResultProps {}

export default function ReinvestResult({}: ReinvestResultProps) {
  const reinvestContext = useContext(ReinvestContext)

  return (
    <div className="bg-light rounded-lg h-12 w-full px-2 py-1 md:w-96">
      <div className="bg-dark rounded-lg w-full h-full flex flex-row items-center gap-1 px-2">
        {reinvestContext.entries.length === 0 ? (
          <p className="grow text-center">Please add targets</p>
        ) : (
          <p className="grow truncate">{generateReinvestStringBasedOn(reinvestContext.entries)}</p>
        )}

        <ThemedIconButton
          className="w-10 h-full"
          color="#fff"
          hoverColor="#ff00af"
          icon={faClipboard}
          onClick={() => console.log(generateReinvestStringBasedOn(reinvestContext.entries))}
        />
      </div>
    </div>
  )
}
