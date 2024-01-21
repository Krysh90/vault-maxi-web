import dynamic from 'next/dynamic'
import Layout from '../../components/core/layout'
import { NextPage } from 'next'
import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { getAssetIcon } from '../../defiscan'
import { useEffect, useState } from 'react'
import { DFIResult } from '../../dtos/dfi-result.dto'
import { formatNumber } from '../../lib/chart.lib'
import BigNumber from 'bignumber.js'
import { DFIPeg } from '../../dtos/dfi-peg.dto'
import { DFIContextProvider, useDFIContext } from '../../contexts/dfi.context'

const dUSDSwaps: NextPage = () => {
  return (
    <DFIContextProvider>
      <Content />
    </DFIContextProvider>
  )
}

const rangeValues = {
  min: 0,
  sellMax: new BigNumber(100_000_000),
  buyMax: new BigNumber(100_000_000),
  defaultValueBuy: new BigNumber(50_000_000),
  defaultValueSell: new BigNumber(50_000_000),
  step: new BigNumber(1_000_000),
  percentage: {
    min: 0,
    max: 100,
    default: 10,
    step: 1,
  },
}

function Content(): JSX.Element {
  const {
    isLoading,
    pools,
    disabledPoolIds,
    calculateIncrease: calculateIncrease,
    analyze,
    changePool,
    dfiPrice,
  } = useDFIContext()
  const [amount, setAmount] = useState<number>(rangeValues.defaultValueBuy.toNumber())
  const [percentage, setPercentage] = useState<number>(rangeValues.percentage.default)
  const [peg, setPeg] = useState<DFIPeg>()
  const [result, setResult] = useState<DFIResult>()
  const [tab, setTab] = useState<string>('Buy')
  const DFI = getAssetIcon('DFI')({ height: 24, width: 24 })
  const isBuy = tab === 'Buy'

  useEffect(() => {
    if (isLoading) return
    setPeg(calculateIncrease(percentage / 100))
  }, [isLoading, disabledPoolIds, percentage])

  useEffect(() => {
    if (isLoading) return
    setResult(analyze(isBuy ? new BigNumber(amount).negated() : new BigNumber(amount)))
  }, [isLoading, disabledPoolIds, amount])

  useEffect(() => {
    isBuy ? setAmount(rangeValues.defaultValueBuy.toNumber()) : setAmount(rangeValues.defaultValueSell.toNumber())
  }, [isBuy])

  function renderIncrease() {
    return (
      <div className="card w-full lg:w-half bg-neutral text-neutral-content">
        <div className="card-body items-center justify-center w-full">
          <h3>
            to increase price by {percentage}% to{' '}
            {formatNumber(new BigNumber(dfiPrice ?? 0).times(1 + percentage / 100).toNumber(), 3)}$
          </h3>
          <div className="flex flex-row gap-2 w-full">
            <p>{rangeValues.percentage.min}%</p>
            <input
              type="range"
              min={rangeValues.percentage.min}
              max={rangeValues.percentage.max}
              defaultValue={percentage}
              step={rangeValues.percentage.step}
              onChange={(e) => setPercentage(+Number(e.target.value).toFixed(0))}
              className="range range-primary"
            />
            <p>{rangeValues.percentage.max}%</p>
          </div>
          {peg ? (
            <>
              <div className="flex flex-row gap-2">
                <p>
                  a buy of {formatNumber(peg.totalUSDNeeded.decimalPlaces(0).toNumber())}$ across all of the following
                  pools is needed
                </p>
              </div>
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
              <h3>DFI prices</h3>
              <div className="flex flex-row gap-2">
                <p className="flex-grow-0">{result.wording}</p>
                {DFI}
              </div>
              {Object.entries(result.dfiAfterSell).map(([coin, price]) => (
                <DFIAfterSellInfo key={coin} coin={coin} price={price} />
              ))}
            </>
          ) : (
            <ol>
              <li className="list-decimal">Please select which gateway pools should be analyzed</li>
              <li className="list-decimal">Enter an amount of DFI which should be sold</li>
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
              {pools.map((pp) => (
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
                {formatNumber(new BigNumber(amount).decimalPlaces(0).toNumber())} {DFI}
              </div>
            </div>
            <input
              type="number"
              defaultValue={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input input-bordered text-end"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout page="DFI swaps simulator" full maxWidth withoutSupport>
      <h1>DFI swaps simulator</h1>
      <div className="w-full flex flex-col gap-4 pt-8 items-center">
        {renderBody()}
        {renderIncrease()}
      </div>
    </Layout>
  )
}

interface DFIAfterSellInfoProps {
  coin: string
  price: BigNumber
}

function DFIAfterSellInfo({ coin, price }: DFIAfterSellInfoProps) {
  const Pool = getAssetIcon(coin)({ height: 24, width: 24 })
  const DFI = getAssetIcon('DFI')({ height: 24, width: 24 })
  return (
    <div className="flex flex-row gap-2">
      <p className="flex-grow-0">inside</p>
      {Pool}
      <p className="flex-grow-0">there would be a</p>
      {DFI}
      <p className="flex-grow-0">price of</p>
      {price.decimalPlaces(3).toString()}$
    </div>
  )
}

interface NeedForPegInfoProps {
  peg: DFIPeg
}

function NeedForPegInfo({ peg }: NeedForPegInfoProps) {
  return (
    <>
      {Object.entries(peg.neededDFIForPeg).map(([coin, info]) => (
        <NeededForPegInfoEntry key={coin} coin={coin} info={info} />
      ))}
    </>
  )
}

interface NeededForPegInfoEntryProps {
  coin: string
  info: { coin: BigNumber; dfi: BigNumber }
}

function NeededForPegInfoEntry({ coin, info }: NeededForPegInfoEntryProps) {
  const Coin = getAssetIcon(coin)({ height: 24, width: 24 })
  const DFI = getAssetIcon('DFI')({ height: 24, width: 24 })
  const coinDecimalPlaces = info.coin.gte(1000) ? 0 : 3

  return (
    <div className="flex flex-row gap-2">
      <p className="flex-grow-0">swap</p>
      <div className="flex flex-row gap-2">
        {formatNumber(info.coin.decimalPlaces(coinDecimalPlaces).toNumber(), coinDecimalPlaces)} {Coin}
      </div>
      <p className="flex-grow-0">to</p>
      <div className="flex flex-row gap-2">
        {formatNumber(info.dfi.decimalPlaces(0).toNumber())} {DFI}
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
