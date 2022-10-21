import { HandleType } from '../dtos/team.dto'

export function imageOf(handleType: HandleType): string {
  switch (handleType) {
    case HandleType.TWITTER:
      return '/twitter.svg'
    case HandleType.GITHUB:
      return '/github.png'
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
