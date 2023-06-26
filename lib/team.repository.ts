import { HandleType, TeamDto } from '../dtos/team.dto'
import imgKuegi from '../public/team/kuegi.jpeg'
import imgKrysh from '../public/team/krysh.jpeg'

export class TeamRepository {
  static all(): TeamDto[] {
    return [kuegi, krysh]
  }
}

const kuegi: TeamDto = {
  name: 'Kuegi',
  image: imgKuegi,
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
  image: imgKrysh,
  imageAlt: 'Profile picture of Krysh',
  description: ['Developer', 'Defichain bot creator'],
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
