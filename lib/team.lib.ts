import { HandleType } from '../dtos/team.dto'
import twitter from '../public/twitter.svg'
import github from '../public/github.png'

export function imageOf(handleType: HandleType): any {
  switch (handleType) {
    case HandleType.TWITTER:
      return twitter
    case HandleType.GITHUB:
      return github
  }
}

export function imageAltOf(handleType: HandleType): string {
  switch (handleType) {
    case HandleType.TWITTER:
      return 'Opens new tab with twitter profile'
    case HandleType.GITHUB:
      return 'Opens new tab with github profile'
  }
}
