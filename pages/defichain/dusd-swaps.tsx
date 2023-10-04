import dynamic from 'next/dynamic'
import Layout from '../../components/core/layout'
import { NextPage } from 'next'
import { DUSDContextProvider, useDUSDContext } from '../../contexts/dusd.context'
import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { getAssetIcon } from '../../defiscan'
import { useEffect, useState } from 'react'
import { DUSDResult } from '../../dtos/dusd-result.dto'
import { formatNumber } from '../../lib/chart.lib'
import BigNumber from 'bignumber.js'
import { DUSDPeg } from '../../dtos/dusd-peg.dto'
import Selection from '../../components/base/selection'

const dUSDSwaps: NextPage = () => {
  return (
    <DUSDContextProvider>
      <Content />
    </DUSDContextProvider>
  )
}

const rangeValues = {
  min: 0,
  sellMax: new BigNumber(100_000_000),
  buyMax: new BigNumber(20_000_000),
  defaultValueBuy: new BigNumber(10_000_000),
  defaultValueSell: new BigNumber(50_000_000),
  step: new BigNumber(1_000_000),
}

function Content(): JSX.Element {
  const { isLoading, gatewayPools, disabledPoolIds, calculatePeg, analyze, changePool } = useDUSDContext()
  const [amount, setAmount] = useState<number>(rangeValues.defaultValueSell.toNumber())
  const [peg, setPeg] = useState<DUSDPeg>()
  const [result, setResult] = useState<DUSDResult>()
  const [tab, setTab] = useState<string>('Sell')
  const DUSD = getAssetIcon('DUSD')({ height: 24, width: 24 })
  const isBuy = tab === 'Buy'

  useEffect(() => {
    if (isLoading) return
    setPeg(calculatePeg())
  }, [isLoading, disabledPoolIds])

  useEffect(() => {
    isBuy ? setAmount(rangeValues.defaultValueBuy.toNumber()) : setAmount(rangeValues.defaultValueSell.toNumber())
  }, [isBuy])

  function renderPeg() {
    return (
      <div className="card w-full lg:w-half bg-neutral text-neutral-content">
        <div className="card-body items-center justify-center w-full">
          <h3>to reach PEG (1 DUSD = 1$)</h3>
          {peg ? (
            <>
              <div className="flex flex-row gap-2">
                <div className="flex flex-row gap-2">
                  {formatNumber(peg.totalDUSDNeeded.decimalPlaces(0).toNumber())} {DUSD}
                </div>
                <p>
                  in total need to be bought, which takes about{' '}
                  {formatNumber(peg.totalUSDNeeded.decimalPlaces(0).toNumber())}$
                </p>
              </div>
              <p>This would be split into following pools</p>
              <NeedForPegInfo peg={peg} />
            </>
          ) : (
            <span className="loading loading-spinner loading-lg text-primary" />
          )}
        </div>
      </div>
    )
  }

  function renderInfo() {
    return (
      <div className="card w-full lg:w-half bg-neutral text-neutral-content">
        <div className="card-body items-center justify-center w-full">
          {result ? (
            <>
              <h3>DUSD prices</h3>
              <div className="flex flex-row gap-2">
                <p className="flex-grow-0">{result.wording}</p>
                {DUSD}
              </div>
              {Object.entries(result.dUSDAfterSell).map(([coin, price]) => (
                <DUSDAfterSellInfo key={coin} coin={coin} price={price} />
              ))}
            </>
          ) : (
            <ol>
              <li className="list-decimal">Please select which gateway pools should be analyzed</li>
              <li className="list-decimal">Enter an amount of DUSD which should be sold</li>
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
          <div className="flex flex-row justify-evenly">
            <button className={`btn ${isBuy ? 'btn-success' : 'btn-neutral'} w-half`} onClick={() => setTab('Buy')}>
              Buy
            </button>
            <button className={`btn ${!isBuy ? 'btn-error' : 'btn-neutral'} w-half`} onClick={() => setTab('Sell')}>
              Sell
            </button>
          </div>
          <div className="flex flex-row gap-2">
            <p>{rangeValues.min}</p>
            <input
              type="range"
              min={rangeValues.min}
              max={isBuy ? rangeValues.buyMax.toNumber() : rangeValues.sellMax.toNumber()}
              defaultValue={amount}
              step={rangeValues.step.toNumber()}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="range range-primary"
            />
            <p>{formatNumber(isBuy ? rangeValues.buyMax.toNumber() : rangeValues.sellMax.toNumber())}</p>
          </div>
          <div className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-row gap-2">
              <p className="flex-grow-0">Selected amount</p>
              <div className="flex flex-row gap-2">
                {formatNumber(new BigNumber(amount).decimalPlaces(0).toNumber())} {DUSD}
              </div>
            </div>
            <input
              type="number"
              defaultValue={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input input-bordered text-end"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setResult(analyze(isBuy ? new BigNumber(amount).negated() : new BigNumber(amount)))}
          >
            Analyze
          </button>
        </div>
      </div>
    )
  }

  return (
    <Layout page="DUSD swaps simulator" full maxWidth withoutSupport>
      <h1>DUSD swaps simulator</h1>
      <div className="w-full flex flex-col gap-4 pt-8 items-center">
        {renderBody()}
        {renderPeg()}
      </div>
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
  peg: DUSDPeg
}

function NeedForPegInfo({ peg }: NeedForPegInfoProps) {
  return (
    <>
      {Object.entries(peg.neededDUSDForPeg).map(([coin, info]) => (
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
