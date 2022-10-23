import Image from 'next/future/image'
import Link from 'next/link'
import { FeatureRepository } from '../../lib/feature.repository'
import styles from './feature-overview.module.css'

export default function FeatureOverview() {
  return (
    <div className={styles.container}>
      {FeatureRepository.all().map((member, index) => (
        <div key={index} className="flex flex-col w-full items-start bg-[#333] rounded-lg px-4 py-6">
          {member.image && (
            <div className="relative m-auto w-full">
              <Image
                className="absolute top-0 right-0 opacity-20"
                src={member.image}
                alt={member.imageAlt}
                height={100}
                width={100}
              />
            </div>
          )}
          <h3>{member.name}</h3>
          <p className={member.image ? 'w-3/5' : ''}>{member.description}</p>
          <div className="flex flex-col pt-4">
            {member.links.map((link, linkIndex) => (
              <Link key={linkIndex} href={link.url}>
                <a>{link.display} &rarr;</a>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
