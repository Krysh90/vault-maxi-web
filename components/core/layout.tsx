import Head from 'next/head'
import Support from './support'
import Navigation from './navigation'

export const siteTitle = 'Vault Maxi'

interface LayoutProps {
  page?: string
  full?: boolean
  withoutSupport?: boolean
  children: any
}

export default function Layout({ page, full, withoutSupport, children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>{page ? `${siteTitle} - ${page}` : siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Learn what vault maxi is and how it works" />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Navigation />
      <div className="flex justify-center px-8">
        <main
          className={`flex flex-col justify-center items-center py-8 ${full ? 'max-w-screen-2xl' : 'max-w-screen-md'}`}
        >
          {children}
          {!withoutSupport && <Support />}
        </main>
      </div>
    </div>
  )
}
