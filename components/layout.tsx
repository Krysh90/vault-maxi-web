import Head from 'next/head'
import styles from './layout.module.css'

export const siteTitle = 'Vault-Maxi'

interface LayoutProps {
  children: any
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Learn how vault-maxi works and what it can do for you" />
        <meta name="og:title" content="Vault Maxi" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
