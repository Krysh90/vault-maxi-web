import type { NextPage } from 'next'
import Layout from '../components/layout'

// m-4 p-6 text-left rounded-lg border border-solid border-zinc-900 max-w-xs hover:text-pink-300 hover:border-pink-300 transition-colors ease-in-out delay-150

const Home: NextPage = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold underline">Welcome to Vault-maxi</h1>
    </Layout>
  )
}

export default Home
