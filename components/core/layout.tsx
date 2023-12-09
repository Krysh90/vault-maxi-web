import Head from 'next/head'
import Support from './support'
import Navigation from './navigation'

export const siteTitle = 'Vault Maxi'

interface LayoutProps {
  page?: string
  full?: boolean
  adjustWidth?: boolean
  maxWidth?: boolean
  withoutSupport?: boolean
  children: any
}

export default function Layout({
  page,
  full,
  adjustWidth,
  maxWidth,
  withoutSupport,
  children,
}: LayoutProps): JSX.Element {
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
      <div className="flex justify-center px-2 md:px-8">
        <main
          className={`flex flex-col justify-center items-center py-8 ${full ? 'max-w-screen-2xl' : 'max-w-screen-md'} ${
            maxWidth ? 'w-full' : ''
          } ${adjustWidth ? 'md:w-3/4 lg:w-3/2' : ''}`}
        >
          {children}
          {!withoutSupport && <Support />}
        </main>
      </div>
    </div>
  )
}
