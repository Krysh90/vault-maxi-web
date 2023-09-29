import dynamic from 'next/dynamic'
import Layout from '../../components/core/layout'
import { NextPage } from 'next'
import { DUSDContextProvider, useDUSDContext } from '../../contexts/dusd.context'
import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { getAssetIcon } from '../../defiscan'
import { useState } from 'react'
import { DUSDResult } from '../../dtos/dusd-result.dto'
import { formatNumber } from '../../lib/chart.lib'
import BigNumber from 'bignumber.js'

const dUSDSwaps: NextPage = () => {
  return (
    <DUSDContextProvider>
      <Content />
    </DUSDContextProvider>
  )
}

const rangeValues = {
  min: 0,
  max: new BigNumber(100_000_000),
  defaultValue: new BigNumber(50_000_000),
  step: new BigNumber(1_000_000),
}

function Content(): JSX.Element {
  const { isLoading, gatewayPools, disabledPoolIds, analyze, changePool } = useDUSDContext()
  const [amount, setAmount] = useState<BigNumber>(rangeValues.defaultValue)
  const [result, setResult] = useState<DUSDResult>()
  const DUSD = getAssetIcon('DUSD')({ height: 24, width: 24 })

  function renderInfo() {
    return (
      <div className="card w-full lg:w-half bg-neutral text-neutral-content">
        <div className="card-body items-center justify-center w-full">
          {result ? (
            <div className="w-full flex flex-col gap-2">
              <h3>dUSD prices</h3>
              <div className="flex flex-row gap-2">
                <p className="flex-grow-0">after a sell of</p>
                <div className="flex flex-row gap-2">
                  {formatNumber(result.amountSold.decimalPlaces(0).toNumber())} {DUSD}
                </div>
              </div>
              {Object.entries(result.dUSDAfterSell).map(([coin, price]) => (
                <DUSDAfterSellInfo key={coin} coin={coin} price={price} />
              ))}
              <h3 className="mt-4">to reach PEG (1 DUSD = 1$)</h3>
              <div className="flex flex-row gap-2">
                <div className="flex flex-row gap-2">
                  {formatNumber(result.totalDUSDNeeded.decimalPlaces(0).toNumber())} {DUSD}
                </div>
                <p>in total need to be bought</p>
              </div>
              <p>This would be split into following pools</p>
              <NeedForPegInfo result={result} />
            </div>
          ) : (
            <ol>
              <li className="list-decimal">Please select which gateway pools should be analyzed</li>
              <li className="list-decimal">Enter an amount of dUSD which should be sold</li>
              <li className="list-decimal">Press the button and see the results</li>
            </ol>
          )}
        </div>
      </div>
    )
  }

  function renderBody() {
    return (
      <div className="w-full flex flex-row flex-wrap gap-8 py-8">
        {renderInfo()}
        <div className="flex flex-col flex-wrap gap-4 lg:w-half">
          {isLoading ? (
            <span className="loading loading-spinner loading-lg text-primary" />
          ) : (
            <div className="flex flex-row flex-wrap gap-4">
              {gatewayPools.map((pp) => (
                <GatewayPoolSelection
                  key={pp.id}
                  poolPair={pp}
                  isChecked={!disabledPoolIds.includes(pp.id)}
                  onChanged={(p, c) => changePool(p, c)}
                  disabled={pp.symbol.includes('XCHF')}
                />
              ))}
            </div>
          )}
          <div className="flex flex-row gap-2">
            <p>{rangeValues.min}</p>
            <input
              type="range"
              min={rangeValues.min}
              max={rangeValues.max.toNumber()}
              defaultValue={amount.toNumber()}
              step={rangeValues.step.toNumber()}
              onChange={(e) => setAmount(new BigNumber(e.target.value))}
              className="range range-primary"
            />
            <p>{formatNumber(rangeValues.max.toNumber())}</p>
          </div>
          <div className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-row gap-2">
              <p className="flex-grow-0">Selected amount</p>
              <div className="flex flex-row gap-2">
                {formatNumber(amount.decimalPlaces(0).toNumber())} {DUSD}
              </div>
            </div>
            <input
              type="number"
              defaultValue={amount.toNumber()}
              onChange={(e) => setAmount(new BigNumber(e.target.value))}
              className="input input-bordered text-end"
            />
          </div>
          <button className="btn btn-primary" onClick={() => setResult(analyze(amount))}>
            Analyze
          </button>
        </div>
      </div>
    )
  }

  return (
    <Layout page="dUSD swaps" full maxWidth withoutSupport>
      <h1>dUSD swaps</h1>
      <div className="w-full flex flex-col gap-4 pt-8 items-center">{renderBody()}</div>
    </Layout>
  )
}

interface DUSDAfterSellInfoProps {
  coin: string
  price: BigNumber
}

function DUSDAfterSellInfo({ coin, price }: DUSDAfterSellInfoProps) {
  const Pool = getAssetIcon(coin === 'DFI' ? `DUSD-${coin}` : `${coin}-DUSD`)({ height: 24, width: 24 })
  const DUSD = getAssetIcon('DUSD')({ height: 24, width: 24 })
  return (
    <div className="flex flex-row gap-2">
      <p className="flex-grow-0">inside</p>
      {Pool}
      <p className="flex-grow-0">there would be a</p>
      {DUSD}
      <p className="flex-grow-0">price of</p>
      {price.decimalPlaces(3).toString()}$
    </div>
  )
}

interface NeedForPegInfoProps {
  result: DUSDResult
}

function NeedForPegInfo({ result }: NeedForPegInfoProps) {
  return (
    <>
      {Object.entries(result.neededDUSDForPeg).map(([coin, info]) => (
        <NeededForPegInfoEntry key={coin} coin={coin} info={info} />
      ))}
    </>
  )
}

interface NeededForPegInfoEntryProps {
  coin: string
  info: { coin: BigNumber; dusd: BigNumber }
}

function NeededForPegInfoEntry({ coin, info }: NeededForPegInfoEntryProps) {
  const Coin = getAssetIcon(coin)({ height: 24, width: 24 })
  const DUSD = getAssetIcon('DUSD')({ height: 24, width: 24 })
  return (
    <div className="flex flex-row gap-2">
      <p className="flex-grow-0">swap</p>
      <div className="flex flex-row gap-2">
        {formatNumber(info.coin.decimalPlaces(0).toNumber())} {Coin}
      </div>
      <p className="flex-grow-0">to</p>
      <div className="flex flex-row gap-2">
        {formatNumber(info.dusd.decimalPlaces(0).toNumber())} {DUSD}
      </div>
    </div>
  )
}

interface GatewayPoolSelectionProps {
  poolPair: PoolPairData
  isChecked: boolean
  onChanged: (poolPair: PoolPairData, checked: boolean) => void
  disabled: boolean
}

function GatewayPoolSelection({ poolPair, isChecked, onChanged, disabled }: GatewayPoolSelectionProps) {
  const AssetIcon = getAssetIcon(poolPair.symbol)({ height: 24, width: 24 })
  return (
    <div className="flex flex-row gap-2 rounded-lg bg-light py-2 px-4 items-center">
      <input
        type="checkbox"
        defaultChecked={isChecked && !disabled}
        onChange={(e) => onChanged(poolPair, e.target.checked)}
        className="checkbox checkbox-primary"
        disabled={disabled}
      />
      {AssetIcon}
      {poolPair.symbol}
    </div>
  )
}

export default dynamic(() => Promise.resolve(dUSDSwaps), { ssr: false })
