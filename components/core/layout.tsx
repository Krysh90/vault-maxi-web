import Head from 'next/head'
import Support from '../home/support'
import styles from './layout.module.css'
import Navigation from './navigation'

export const siteTitle = 'Vault Maxi'

interface LayoutProps {
  page?: string
  children: any
}

export default function Layout({ page, children }: LayoutProps) {
  return (
    <div className={styles.page}>
      <Head>
        <title>{page ? `${siteTitle} - ${page}` : siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Learn what vault maxi is and how it works" />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Navigation />
      <div className={styles.container}>
        <main className={styles.main}>
          {children}
          <Support />
        </main>
      </div>
      {/* <footer className={styles.footer}>
        <FooterLogo
          style={styles.twitter}
          href="https://twitter.com/mkuegi"
          src="/twitter.svg"
          srcHovered="/twitter_hover.svg"
          title="Kügi"
        />
        <FooterLogo
          style={styles.twitter}
          href="https://twitter.com/krysh90"
          src="/twitter.svg"
          srcHovered="/twitter_hover.svg"
          title="Krysh"
        />
      </footer> */}
    </div>
  )
}
