import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import styles from './navigation.module.css'

export default function Navigation() {
  useEffect(() => {
    console.log(styles)
  }, [])

  return (
    <nav className={styles.container}>
      <Link href="/">
        <a className={styles['container-logo']}>
          <Image src="/vault-maxi.png" width={40} height={40} alt="clickable image" />
          <p className={styles.logo}>Vault Maxi</p>
        </a>
      </Link>
      <ul className={styles.nav}>
        <label htmlFor="checkbox_toggle" className={styles.hamburger}>
          &#9776;
        </label>
        <input type="checkbox" id="checkbox_toggle" className={styles.input} />
        <div className={styles.menu}>
          <li>
            <Link href="/disclaimer">Disclaimer</Link>
          </li>
          <li>
            <Link href="/vault-maxi">Bot</Link>
          </li>
          <li>
            <Link href="/lm-reinvest">LM reinvest</Link>
          </li>
          <li>
            <Link href="/statistics">Statistics</Link>
          </li>
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
        </div>
      </ul>
    </nav>
  )
}
