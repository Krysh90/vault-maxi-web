import Image from 'next/image'
import { TeamDto } from '../../dtos/team.dto'
import { imageAltOf, imageOf } from '../../lib/team.lib'
import { TeamRepository } from '../../lib/team.repository'
import styles from './team.module.css'

function Description({ member }: { member: TeamDto }) {
  return (
    <div className={styles.descriptionContainer}>
      <h3>{member.name}</h3>
      <ul>
        {member.description.map((entry, entryIndex) => (
          <li key={entryIndex}>{entry}</li>
        ))}
      </ul>
      <ul className={styles.handles}>
        {member.handles.map((handle, handleIndex) => (
          <li key={handleIndex}>
            {' '}
            <a target="_blank" href={handle.url} rel="noopener noreferrer">
              <Image src={imageOf(handle.type)} width={32} height={32} alt={imageAltOf(handle.type)} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Team() {
  return (
    <div className={styles.container}>
      <h2>Team</h2>
      {TeamRepository.all().map((member, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.cardContainer}>
            <Description member={member} />
            <div style={{ marginTop: 'auto' }}>
              <Image src={member.image} width={150} height={150} alt={member.imageAlt} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
