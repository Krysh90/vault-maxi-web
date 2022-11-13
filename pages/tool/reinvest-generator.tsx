import { NextPage } from 'next'
import React, { useState } from 'react'
import Layout from '../../components/core/layout'
import Chart from '../../components/tool/chart'
import ReinvestEntries from '../../components/tool/reinvest-entries'
import { ReinvestContextProvider } from '../../contexts/reinvest.context'

const ReinvestGenerator: NextPage = () => {
  return (
    <Layout page="Tool - Reinvest generator" maxWidth withoutSupport>
      <ReinvestContextProvider>
        <h1 className="text-4xl text-main">Reinvest generator</h1>
        <div className="flex flex-col md:flex-row p-8 gap-8 flex-grow justify-center w-full">
          <Chart />
          <ReinvestEntries />
        </div>
        <div>
          <p>some text to copy in future</p>
        </div>
      </ReinvestContextProvider>
    </Layout>
  )
}

export default ReinvestGenerator
