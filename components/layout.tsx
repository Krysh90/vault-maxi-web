import Head from 'next/head'
import styles from './layout.module.css'
import Navigation from './navigation'

export const siteTitle = 'Vault Maxi'

interface LayoutProps {
  children: any
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.page}>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Learn how vault-maxi works and what it can do for you" />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Navigation />
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
      <footer className={styles.footer}>TODO write something cool in the footer</footer>
    </div>
  )
}
