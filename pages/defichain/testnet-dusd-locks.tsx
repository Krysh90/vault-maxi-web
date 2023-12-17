import { NextPage } from 'next'
import Layout from '../../components/core/layout'
import { WalletContextProvider, useWalletContext } from '../../contexts/wallet.context'
import dynamic from 'next/dynamic'
import { Button } from '../../components/base/button'
import { testnet } from '../../lib/meta-chain-network.lib'
import { formatNumber } from '../../lib/chart.lib'
import { useDUSD } from '../../hooks/dusd.hook'
import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { DUSDLockContextProvider, Tab, useDUSDLockContext, Investment } from '../../contexts/dusd-lock.context'

const TestNetDusdLocks: NextPage = () => {
  return (
    <WalletContextProvider>
      <DUSDLockContextProvider>
        <TestNetDusdLocksContent />
      </DUSDLockContextProvider>
    </WalletContextProvider>
  )
}

function secondsToTime(secs: number) {
  if (secs === 0) return undefined
  var days = Math.floor(secs / (24 * 60 * 60))

  var divisorForHours = secs % (24 * 60 * 60)
  var hours = Math.floor(divisorForHours / (60 * 60))

  var divisorForMinutes = divisorForHours % (60 * 60)
  var minutes = Math.floor(divisorForMinutes / 60)

  var obj = {
    d: days,
    h: hours,
    m: minutes,
  }
  return obj
}

function getTimeString(timeObj: { d: number; h: number; m: number }): string {
  if (timeObj.d > 0) {
    return `${timeObj.d} day${timeObj.d > 1 ? 's' : ''} ${timeObj.h} hour${timeObj.h > 1 ? 's' : ''}`
  } else if (timeObj.h > 0) {
    return `${timeObj.h} hour${timeObj.h > 1 ? 's' : ''} ${timeObj.m} minute${timeObj.m > 1 ? 's' : ''}`
  } else {
    return `${timeObj.m} minute${timeObj.m > 1 ? 's' : ''}`
  }
}

function Stats(): JSX.Element {
  const { tvl, rewardsPerDeposit, totalClaimed, totalRewards, totalSupply, totalWithdrawn, lockupPeriod } =
    useDUSDLockContext()

  const timeObj = secondsToTime(lockupPeriod?.toNumber() ?? 0)

  return (
    <div className="card-body items-center w-full text-sm">
      <div className="flex flex-row w-full justify-between">
        <p>TVL:</p>
        <p className="text-end">{formatNumber(tvl?.toNumber() ?? 0, 2)} DUSD</p>
      </div>
      <div className="flex flex-row w-full justify-between">
        <p>Lockup period:</p>
        <p className="text-end">
          {timeObj ? `${timeObj.d} day${timeObj.d > 1 ? 's' : ''} ${timeObj.h} hour${timeObj.h > 1 ? 's' : ''}` : 0}
        </p>
      </div>
      <div className="flex flex-row w-full justify-between">
        <p>Rewards per deposit:</p>
        <p className="text-end">{formatNumber(rewardsPerDeposit?.toNumber() ?? 0, 2)} DUSD</p>
      </div>
      <div className="flex flex-row w-full justify-between">
        <p>Total claimed:</p>
        <p className="text-end">{formatNumber(totalClaimed?.toNumber() ?? 0, 2)} DUSD</p>
      </div>
      <div className="flex flex-row w-full justify-between">
        <p>Total rewards:</p>
        <p className="text-end">{formatNumber(totalRewards?.toNumber() ?? 0, 2)} DUSD</p>
      </div>
      <div className="flex flex-row w-full justify-between">
        <p>Total supply:</p>
        <p className="text-end">{formatNumber(totalSupply?.toNumber() ?? 0, 2)} DUSD</p>
      </div>
      <div className="flex flex-row w-full justify-between">
        <p>Total withdrawn:</p>
        <p className="text-end">{formatNumber(totalWithdrawn?.toNumber() ?? 0, 2)} DUSD</p>
      </div>
    </div>
  )
}

function Deposit(): JSX.Element {
  const { totalInvest, totalInvestCap, contractAddress, coinAddress, deposit, isDepositing } = useDUSDLockContext()
  const { balance, approvedAmount, approve, isApproving } = useDUSD(coinAddress, contractAddress)

  const [amount, setAmount] = useState<string>('')

  function needsApproval(): boolean {
    return approvedAmount?.isLessThan(amount) ?? true
  }

  function hasEnteredAmount(): boolean {
    return amount !== '' && new BigNumber(amount).isGreaterThan(0)
  }

  function investedPercentage(): number {
    if (!totalInvest || !totalInvestCap) return 0
    return totalInvest.dividedBy(totalInvestCap).toNumber()
  }

  return (
    <div className="card-body items-center w-full gap-4">
      <div className="flex flex-col gap-1 w-full">
        <div className="flex flex-row w-full justify-between text-sm">
          <p>Invested</p>
          {totalInvest && totalInvestCap && (
            <p className="text-center">
              {formatNumber(totalInvest.toNumber())} of {formatNumber(totalInvestCap.toNumber())}
            </p>
          )}
          <p className="text-end">Cap</p>
        </div>
        <progress className="progress progress-primary w-full" value={investedPercentage()} max="1"></progress>
      </div>
      <div
        className="cursor-pointer flex flex-row w-full justify-between text-sm"
        onClick={() => setAmount(balance?.toString() ?? '0')}
        onKeyDown={() => {}}
      >
        <p>Balance:</p>
        <p className="text-end">{balance?.toFixed(2).toString() ?? '0'} DUSD</p>
      </div>
      <div className="flex flex-row items-center w-full -mt-3 text-sm">
        <input
          type="number"
          placeholder="Amount"
          className="input input-bordered w-full mr-4"
          onWheel={(e) => e.currentTarget.blur()}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />{' '}
        DUSD
      </div>
      <div className="flex flex-row gap-4 w-full">
        <button
          className="btn btn-primary flex-1 btn-bordered"
          disabled={!needsApproval() || isApproving}
          onClick={() => approve(amount)}
        >
          {isApproving ? <span className="loading loading-spinner loading-sm"></span> : 'Approve'}
        </button>
        <button
          className="btn btn-primary flex-1"
          disabled={!hasEnteredAmount() || needsApproval() || isDepositing}
          onClick={() => deposit(amount)}
        >
          {isDepositing ? <span className="loading loading-spinner loading-sm"></span> : 'Deposit'}
        </button>
      </div>
    </div>
  )
}

function DepositDisplay({
  investment,
  index,
  isOpen,
  handleOpen,
  withdrawable,
}: {
  investment: Investment
  index: number
  isOpen: (index: number) => boolean
  handleOpen: (value: boolean, index: number) => void
  withdrawable?: boolean
}): JSX.Element {
  const { isWithdrawing, withdraw, isExitCriteriaTriggered } = useDUSDLockContext()
  const diff = investment.lockedUntil - Math.floor(Date.now() / 1000)
  const timeObj = diff > 0 ? secondsToTime(diff) : undefined
  const isWithdrawn = investment.amount.isEqualTo(0)

  return (
    <div key={index} className="collapse collapse-arrow bg-transparent border deposit-border-color rounded-lg">
      <input type="checkbox" defaultChecked={isOpen(index)} onChange={(e) => handleOpen(e.target.checked, index)} />
      <div className="collapse-title flex flex-row items-center gap-2">
        Deposit #{index + 1}{' '}
        {isWithdrawn ? (
          <p className="text-xs text-success">withdrawn</p>
        ) : (
          <p className="text-xs">({formatNumber(investment.amount.toNumber(), 2)} DUSD)</p>
        )}
      </div>
      <div className="collapse-content text-xs">
        <div className="flex flex-row w-full justify-between">
          <p>Amount:</p>
          <p className="text-end">{formatNumber(investment.amount.toNumber(), 2)} DUSD</p>
        </div>
        <div className="flex flex-row w-full justify-between">
          <p>Claimed rewards:</p>
          <p className="text-end">{formatNumber(investment.claimedRewards.toNumber(), 2)} DUSD</p>
        </div>
        <div className="flex flex-row w-full justify-between">
          <p>Unlock status:</p>
          <p className="text-end">
            {isExitCriteriaTriggered
              ? 'unlocked'
              : isWithdrawn
              ? 'withdrawn'
              : timeObj
              ? `in ${getTimeString(timeObj)}`
              : 'withdrawable'}
          </p>
        </div>
        {withdrawable && !isWithdrawn && (
          <button
            className="btn btn-block btn-primary mt-2"
            onClick={() => withdraw(index)}
            disabled={isWithdrawing || (!!timeObj && !isExitCriteriaTriggered)}
          >
            {isWithdrawing ? <span className="loading loading-spinner loading-sm"></span> : 'Withdraw'}
          </button>
        )}
      </div>
    </div>
  )
}

function Claim(): JSX.Element {
  const { investments, availableRewards, claimRewards, isClaiming, isClaimable } = useDUSDLockContext()
  console.log('isClaimable', isClaimable, isClaiming || !isClaimable)

  const [accordions, setAccordions] = useState<boolean[]>(investments?.map(() => false) ?? [])

  function handleOpen(value: boolean, index: number) {
    if (index >= accordions.length) return
    accordions[index] = value
    setAccordions(accordions)
  }

  function isOpen(index: number): boolean {
    if (index >= accordions.length) return false
    return accordions[index]
  }

  return (
    <div className="card-body items-center w-full gap-4 text-sm">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row w-full justify-between">
          <p>Rewards:</p>
          <p className="text-end">{formatNumber(availableRewards?.toNumber() ?? 0, 2)} DUSD</p>
        </div>
        <button
          className="btn btn-block btn-primary"
          onClick={() => claimRewards()}
          disabled={isClaiming || !isClaimable}
        >
          {isClaiming ? <span className="loading loading-spinner loading-sm"></span> : 'Claim'}
        </button>
      </div>
      {investments?.map((i, index) => (
        <DepositDisplay key={index} investment={i} index={index} isOpen={isOpen} handleOpen={handleOpen} />
      ))}
    </div>
  )
}

function Withdraw(): JSX.Element {
  const { earliestUnlock, investments, isExitCriteriaTriggered } = useDUSDLockContext()

  const diff = earliestUnlock?.timestamp ? earliestUnlock.timestamp - Math.floor(Date.now() / 1000) : 0
  const timeObj = diff > 0 ? secondsToTime(diff) : undefined

  const [accordions, setAccordions] = useState<boolean[]>(investments?.map(() => false) ?? [])

  function handleOpen(value: boolean, index: number) {
    if (index >= accordions.length) return
    accordions[index] = value
    setAccordions(accordions)
  }

  function isOpen(index: number): boolean {
    if (index >= accordions.length) return false
    return accordions[index]
  }

  return (
    <div className="card-body items-center w-full gap-4">
      <div className="flex flex-row w-full justify-between">
        <p>{isExitCriteriaTriggered ? 'Exit criteria got triggered, you can withdraw' : 'Earliest unlock:'}</p>
        {!isExitCriteriaTriggered && (
          <p className="text-end">
            {earliestUnlock ? (timeObj ? `in ${getTimeString(timeObj)}` : 'now available') : 'loading ...'}
          </p>
        )}
      </div>
      {investments?.map((i, index) => (
        <DepositDisplay key={index} investment={i} index={index} isOpen={isOpen} handleOpen={handleOpen} withdrawable />
      ))}
      {investments?.length === 0 && <p className="text-sm text-start w-full">Deposit DUSD to see your deposits</p>}
    </div>
  )
}

function TestNetDusdLocksCard(): JSX.Element {
  const { tab, tabs, setTab } = useDUSDLockContext()

  const tabNames: Record<Tab, string> = {
    [Tab.deposit]: 'Deposit',
    [Tab.claim]: 'Claim',
    [Tab.withdraw]: 'Withdraw',
    [Tab.stats]: 'Info',
  }

  const tabContent: Record<Tab, JSX.Element> = {
    [Tab.deposit]: <Deposit />,
    [Tab.claim]: <Claim />,
    [Tab.withdraw]: <Withdraw />,
    [Tab.stats]: <Stats />,
  }

  return (
    <div className="flex flex-col gap-8 md:w-96">
      <div role="tablist" className="tabs tabs-boxed bg-neutral text-neutral-content justify-evenly">
        {tabs.map((t) => (
          <a
            key={t}
            role="tab"
            className={`tab${t === tab ? ' tab-active' : ''} flex-1 text-base`}
            onClick={() => setTab(t)}
          >
            {tabNames[t]}
          </a>
        ))}
      </div>
      <div className="card bg-neutral text-neutral-content">{tabContent[tab]}</div>
    </div>
  )
}

function TestNetDusdLocksContent(): JSX.Element {
  const { chain, isConnected, connect, requestChangeToChain } = useWalletContext()

  function reportIssue() {
    window.open('https://github.com/kuegi/dusd-lock-bot/issues/new', '_blank')
  }

  return (
    <Layout page="TestNet DUSD locks" full maxWidth withoutSupport>
      <h1>TestNet DUSD locks</h1>
      <div className="pt-8 flex w-full justify-end">
        <Button disabled={isConnected} onClick={connect} label={isConnected ? 'Connected' : 'Connect'} />
      </div>
      <div className="pt-8">
        {chain !== testnet.chainId ? (
          <div className="flex flex-col gap-4 items-center">
            <p>Please change your network to TestNet</p>
            <Button label="Change network" onClick={() => requestChangeToChain(testnet.chainId)} />
          </div>
        ) : (
          <>{isConnected && <TestNetDusdLocksCard />}</>
        )}
      </div>
      <div className="flex flex-col gap-8 md:w-96 pt-8 px-4 md:px-0">
        <p>
          This site has the sole purpose for testing the smart contract implementation of DUSD lock pools. Therefore it
          is only available on TestNet and this site has no intention offer an UI for MainNet.
        </p>
        <p> Testing is very appreciated, if you find anything please reach out to us. Happy testing.</p>
        <p>Note: rewards are not indicative for real DUSD lock pools.</p>
        <button className="btn btn-block btn-primary" onClick={() => reportIssue()}>
          Report an issue
        </button>
      </div>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(TestNetDusdLocks), { ssr: false })
