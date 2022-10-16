import Head from 'next/head'
import FooterLogo from './footer-logo'
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
        <meta name="description" content="Learn how vault-maxi works and what it can do for you" />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Navigation />
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
      <footer className={styles.footer}>
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
        <FooterLogo
          style={styles.discord}
          href="https://discord.gg/DBUp4cqzBb"
          src="/discord.svg"
          srcHovered="/discord_hover.svg"
          title="Community server"
        />
      </footer>
    </div>
  )
}
