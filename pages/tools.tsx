import { NextPage } from 'next'
import CardOverview from '../components/base/card-overview'
import Layout from '../components/core/layout'
import { ToolRepository } from '../lib/tool.repository'

const Tools: NextPage = () => {
  return (
    <Layout page="Tools" full>
      <h1 className="text-4xl text-main">Tools</h1>
      <CardOverview
        items={ToolRepository.all().map((t) => ({
          title: t.name,
          ...t,
        }))}
      />
    </Layout>
  )
}

export default Tools
