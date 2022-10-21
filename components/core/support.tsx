import styles from './support.module.css'

export default function Support() {
  return (
    <div className={styles.container}>
      <h3>Need support or have questions?</h3>
      <ul>
        <li className={styles.discord}>
          Join our{' '}
          <a target="_blank" href="https://discord.gg/DBUp4cqzBb" rel="noopener noreferrer">
            community &rarr;
          </a>
        </li>
        <li>
          Read our{' '}
          <a
            target="_blank"
            href="https://docs.google.com/document/d/1sb9VgeVHGYZpyLWQx8VsxsoeHO4JRz3fACj5_JjoVNs"
            rel="noopener noreferrer"
          >
            guide &rarr;
          </a>
        </li>
        <li>
          Watch{' '}
          <a
            target="_blank"
            href="https://www.youtube.com/playlist?list=PLgSw0rik-znfQa3wVO-EJ_6Of7RnWZm3_"
            rel="noopener noreferrer"
          >
            video series &rarr;
          </a>
        </li>
        <li>
          Report a{' '}
          <a target="_blank" href="https://github.com/kuegi/defichain_maxi" rel="noopener noreferrer">
            bug &rarr;
          </a>
        </li>
      </ul>
    </div>
  )
}
