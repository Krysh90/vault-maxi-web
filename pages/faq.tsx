import { NextPage } from 'next'
import Layout from '../components/core/layout'
import { Faq, FaqContextProvider } from '../contexts/faq.context'
import { FaqContent } from '../components/faq/faq-content'

export async function getStaticProps(): Promise<{ props: FaqProps; revalidate: number }> {
  const res = await fetch('https://defichain-maxi-public.s3.eu-central-1.amazonaws.com/web/faq.json')
  const entries: Faq[] = await res.json()
  return { props: { entries }, revalidate: 3600 }
}

interface FaqProps {
  entries: Faq[]
}

const Faq: NextPage<FaqProps> = ({ entries }: FaqProps) => {
  return (
    <Layout page="FAQ" full maxWidth adjustWidth>
      <h1 className="mx-auto">FAQ</h1>
      <FaqContextProvider>
        <FaqContent content={entries} />
      </FaqContextProvider>
    </Layout>
  )
}

export default Faq
