import styles from './support.module.css'

interface SupportProps {
  openDonation: () => void
}

export default function Support({ openDonation }: SupportProps): JSX.Element {
  return (
    <div className={styles.container}>
      <h3>Need support or have questions?</h3>
      <ul>
        <li className={styles.discord}>
          <a target="_blank" href="https://discord.gg/DBUp4cqzBb" rel="noopener noreferrer">
            Join our community &rarr;
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://docs.google.com/document/d/1sb9VgeVHGYZpyLWQx8VsxsoeHO4JRz3fACj5_JjoVNs"
            rel="noopener noreferrer"
          >
            Read our guide &rarr;
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.youtube.com/playlist?list=PLgSw0rik-znfQa3wVO-EJ_6Of7RnWZm3_"
            rel="noopener noreferrer"
          >
            Watch video series &rarr;
          </a>
        </li>
        <li>
          <a target="_blank" href="https://github.com/kuegi/defichain_maxi/issues/new" rel="noopener noreferrer">
            Report a bug &rarr;
          </a>
        </li>
        <li>
          <a className="cursor-pointer" onClick={() => openDonation()}>
            Support us by donating
          </a>
        </li>
      </ul>
    </div>
  )
}
