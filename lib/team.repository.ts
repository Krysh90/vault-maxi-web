import { HandleType, TeamDto } from '../dtos/team.dto'

export class TeamRepository {
  static all(): TeamDto[] {
    return [kuegi, krysh]
  }
}

const kuegi: TeamDto = {
  name: 'Kuegi',
  image: '/team/kuegi.jpeg',
  imageAlt: 'Profile picture of Kuegi',
  description: ['Developer', 'Defichain bot creator'],
  handles: [
    {
      type: HandleType.TWITTER,
      url: 'https://twitter.com/mkuegi',
    },
    {
      type: HandleType.GITHUB,
      url: 'https://github.com/kuegi',
    },
  ],
}

const krysh: TeamDto = {
  name: 'Krysh',
  image: '/team/krysh.jpeg',
  imageAlt: 'Profile picture of Krysh',
  description: ['Developer @ DFX', 'Defichain bot creator'],
  handles: [
    {
      type: HandleType.TWITTER,
      url: 'https://twitter.com/Krysh90',
    },
    {
      type: HandleType.GITHUB,
      url: 'https://github.com/Krysh90',
    },
  ],
}
