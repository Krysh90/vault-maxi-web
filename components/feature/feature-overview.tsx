import Image from 'next/future/image'
import Link from 'next/link'
import { FeatureRepository } from '../../lib/feature.repository'

export default function FeatureOverview() {
  return (
    <div className="flex flex-col items-center pt-4 gap-4 lg:flex-row lg:flex-wrap lg:justify-center lg:items-start">
      {FeatureRepository.all().map((member, index) => (
        <div key={index} className="flex flex-col w-full items-start bg-light rounded-lg px-4 py-6 lg:w-96 lg:h-56">
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
          <div className="flex flex-col pt-4 mt-auto">
            {member.links.map((link, linkIndex) => (
              <Link key={linkIndex} href={link.url}>
                <a className="hover:text-main ease-in duration-100">{link.display} &rarr;</a>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
