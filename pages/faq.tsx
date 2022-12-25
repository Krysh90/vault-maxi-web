import { NextPage } from 'next'
import Layout from '../components/core/layout'
import { FaqContextProvider } from '../contexts/faq.context'
import { FaqContent } from '../components/faq/faq-content'

const Faq: NextPage = () => {
  return (
    <Layout page="FAQ" full maxWidth adjustWidth>
      <h1 className="mx-auto">FAQ</h1>
      <FaqContextProvider>
        <FaqContent />
      </FaqContextProvider>
    </Layout>
  )
}

export default Faq
