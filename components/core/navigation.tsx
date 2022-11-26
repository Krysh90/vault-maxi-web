import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import styles from './navigation.module.css'
import vaultMaxi from '../../public/vault-maxi.png'

export default function Navigation(): JSX.Element {
  const [isChecked, setChecked] = useState(false)

  return (
    <nav className={styles.container}>
      <Link href="/">
        <a className={styles['container-logo']}>
          <Image src={vaultMaxi} width={40} height={40} alt="clickable image" />
          <p className={styles.logo}>Vault Maxi</p>
        </a>
      </Link>
      <ul className={styles.nav}>
        <label htmlFor="checkbox_toggle" className={styles.hamburger}>
          {isChecked ? <>&#215;</> : <>&#9776;</>}
        </label>
        <input type="checkbox" id="checkbox_toggle" className={styles.input} onClick={() => setChecked(!isChecked)} />
        <div className={styles.menu}>
          <li>
            <a
              target="_blank"
              href="https://docs.google.com/document/d/1sb9VgeVHGYZpyLWQx8VsxsoeHO4JRz3fACj5_JjoVNs"
              rel="noopener noreferrer"
            >
              Guide
            </a>
          </li>
          <li>
            <Link href="/features">Features</Link>
          </li>
          <li>
            <Link href="/tools">Tools</Link>
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
