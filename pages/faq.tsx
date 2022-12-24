import { NextPage } from 'next'
import Layout from '../components/core/layout'
import ThemedSearch from '../components/faq/themed-search'

const Faq: NextPage = () => {
  return (
    <Layout page="FAQ" full maxWidth>
      <h1 className="mx-auto">FAQ</h1>
      <div className="w-full flex justify-end py-4 md:-translate-y-[3.75rem]">
        <ThemedSearch onChange={console.log} />
      </div>
    </Layout>
  )
}

export default Faq
