import { ToolDto } from '../dtos/tool.dto'
import { faDollar, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import JSXStyle from 'styled-jsx/style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class ToolRepository {
  static all(): ToolDto[] {
    return [reinvestPattern]
  }
}

const reinvestPattern: ToolDto = {
  name: 'Reinvest pattern',
  description: 'Generate a reinvest pattern that fits your needs',
  specialIcon: (): JSX.Element => (
    <div className="relative ml-auto w-20">
      <FontAwesomeIcon className="absolute inset-y-0" icon={faRotateRight} color={'#666'} size={'5x'} />

      <div className="absolute rounded-full flex items-center justify-center" style={{ left: 30, top: 24 }}>
        <FontAwesomeIcon icon={faDollar} color={'#aaa'} size={'2x'} />
      </div>
    </div>
  ),
  links: [{ url: '/tool/reinvest-pattern', display: 'Open tool' }],
}
