import Web3 from 'web3'
import ABI from '../lib/DUSDLock.abi.json'
import TOKEN_ABI from '../lib/DUSDBondToken.abi.json'
import { Contract } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useWalletContext } from './wallet.context'
import { testnet } from '../lib/meta-chain-network.lib'

interface DUSDLockContextInterface {
  tab: Tab
  setTab: (t: Tab) => void
  tabs: Tab[]
  isDepositing: boolean
  isClaimable: boolean
  isClaiming: boolean
  isWithdrawing: boolean
  isChecking: boolean
  tvl?: BigNumber
  lockupPeriod?: BigNumber
  rewardsPerDeposit?: BigNumber
  totalClaimed?: BigNumber
  totalInvest?: BigNumber
  totalInvestCap?: BigNumber
  totalRewards?: BigNumber
  totalWithdrawn?: BigNumber
  availableRewards?: BigNumber
  contractAddress: string
  coinAddress?: string
  earliestUnlock?: Unlock
  investments?: Investment[]
  isExitCriteriaTriggered: boolean
  deposit: (amount: string) => Promise<void>
  claimRewards: () => Promise<void>
  withdraw: (index: number) => Promise<void>
  check: (batchId: string) => Promise<Investment | undefined>
}

export enum Tab {
  deposit,
  claim,
  withdraw,
  stats,
  check,
}

export interface Unlock {
  timestamp: number
  batchId: number
}

export interface Investment {
  amount: BigNumber
  lockedUntil: number
  initialRewardsPerDeposit: BigNumber
  claimedRewards: BigNumber
  claimableRewards: BigNumber
  batchId: number
}

const DUSDLockContext = createContext<DUSDLockContextInterface>(undefined as any)

export function useDUSDLockContext(): DUSDLockContextInterface {
  return useContext(DUSDLockContext)
}

export function DUSDLockContextProvider(props: PropsWithChildren): JSX.Element {
  const { address, isConnected, block, chain } = useWalletContext()
  const web3 = new Web3(Web3.givenProvider)

  const [tab, setTab] = useState<Tab>(Tab.deposit)
  const tabs = [Tab.deposit, Tab.claim, Tab.withdraw, Tab.check, Tab.stats]

  const contractAddress = '0xEbC26f8c4c066A697064FFD42a3b04708910e0d5'
  const [isDepositing, setIsDepositing] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isExitCriteriaTriggered, setIsExitCriteriaTriggered] = useState(false)
  const [tvl, setTvl] = useState<BigNumber>()
  const [rewardsPerDeposit, setRewardsPerDeposit] = useState<BigNumber>()
  const [totalClaimed, setTotalClaimed] = useState<BigNumber>()
  const [totalInvest, setTotalInvest] = useState<BigNumber>()
  const [totalInvestCap, setTotalInvestCap] = useState<BigNumber>()
  const [totalRewards, setTotalRewards] = useState<BigNumber>()
  const [totalWithdrawn, setTotalWithdrawn] = useState<BigNumber>()
  const [lockupPeriod, setLockupPeriod] = useState<BigNumber>()
  const [availableRewards, setAvailableRewards] = useState<BigNumber>()
  const [earliestUnlock, setEarliestUnlock] = useState<Unlock>()
  const [investments, setInvestments] = useState<Investment[]>()
  const [coinAddress, setCoinAddress] = useState<string>()
  const [isClaimable, setIsClaimable] = useState(false)
  const [lastDepositBlock, setLastDepositBlock] = useState<number>()
  const [lastClaimBlock, setLastClaimBlock] = useState<number>()
  const [lastWithdrawBlock, setLastWithdrawBlock] = useState<number>()
  const [lastStatsBlock, setLastStatsBlock] = useState<number>()

  const contract = new web3.eth.Contract(ABI as any, contractAddress)

  function createBondTokenContract(address: string): Contract {
    return new web3.eth.Contract(TOKEN_ABI as any, address)
  }

  function handleError(e: any, method: string) {
    console.error(method, e)
  }

  function reload() {
    switch (tab) {
      case Tab.stats:
        if ((block ?? 0) <= (lastStatsBlock ?? 0)) return
        getTvl()
          .then(setTvl)
          .catch((e) => handleError(e, 'tvl'))
        getRewardsPerDeposit()
          .then(setRewardsPerDeposit)
          .catch((e) => handleError(e, 'rewardsPerDeposit'))
        getTotalClaimed()
          .then(setTotalClaimed)
          .catch((e) => handleError(e, 'totalClaimed'))
        getTotalRewards()
          .then(setTotalRewards)
          .catch((e) => handleError(e, 'totalRewards'))
        getTotalWithdrawn()
          .then(setTotalWithdrawn)
          .catch((e) => handleError(e, 'totalWithdrawn'))
        setLastStatsBlock(block)
        break
      case Tab.deposit:
        if ((block ?? 0) <= (lastDepositBlock ?? 0)) return
        getTotalInvest()
          .then(setTotalInvest)
          .catch((e) => handleError(e, 'totalInvest'))
        getTotalInvestCap()
          .then(setTotalInvestCap)
          .catch((e) => handleError(e, 'totalInvestCap'))
        setLastDepositBlock(block)
        break
      case Tab.claim:
        if ((block ?? 0) <= (lastClaimBlock ?? 0)) return
        getInvestments()
          .then(setInvestments)
          .catch((e) => handleError(e, 'investments'))
        getAvailableRewards()
          .then(setAvailableRewards)
          .catch((e) => handleError(e, 'availableRewards'))
        getClaimable()
          .then(setIsClaimable)
          .catch((e) => handleError(e, 'isClaimable'))
        setLastClaimBlock(block)
        break
      case Tab.withdraw:
        if ((block ?? 0) <= (lastWithdrawBlock ?? 0)) return
        getInvestments()
          .then(setInvestments)
          .catch((e) => handleError(e, 'investments'))
        getEarliestUnlock()
          .then(setEarliestUnlock)
          .catch((e) => handleError(e, 'earliestUnlock'))
        getExitCriteriaTriggered()
          .then(setIsExitCriteriaTriggered)
          .catch((e) => handleError(e, 'exitCriteriaTriggered'))
        setLastWithdrawBlock(block)
        break
    }

    if (!coinAddress)
      getCoinAddress()
        .then(setCoinAddress)
        .catch((e) => handleError(e, 'coinAddress'))
    if (!lockupPeriod)
      getLockupPeriod()
        .then(setLockupPeriod)
        .catch((e) => handleError(e, 'lockupPeriod'))
  }

  useEffect(() => {
    if (isConnected && chain == testnet.chainId) {
      reload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, tab, block, chain])

  async function getTvl(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await contract.methods.currentTvl().call(), 'ether'))
  }

  async function getRewardsPerDeposit(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await contract.methods.rewardsPerDeposit().call(), 'ether'))
  }

  async function getTotalClaimed(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await contract.methods.totalClaimed().call(), 'ether'))
  }

  async function getTotalInvest(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await contract.methods.totalInvest().call(), 'ether'))
  }

  async function getTotalInvestCap(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await contract.methods.totalInvestCap().call(), 'ether'))
  }

  async function getTotalRewards(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await contract.methods.totalRewards().call(), 'ether'))
  }

  async function getTotalWithdrawn(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await contract.methods.totalWithdrawn().call(), 'ether'))
  }

  async function getAvailableRewards(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await contract.methods.allAvailableRewards(address).call(), 'ether'))
  }

  async function getClaimable(): Promise<boolean> {
    return (await contract.methods.currentRewardsClaimable().call()) !== '0'
  }

  async function getLockupPeriod(): Promise<BigNumber> {
    return new BigNumber(await contract.methods.lockupPeriod().call())
  }

  async function getExitCriteriaTriggered(): Promise<boolean> {
    return await contract.methods.exitCriteriaTriggered().call()
  }

  async function getCoinAddress(): Promise<string> {
    return await contract.methods.coin().call()
  }

  async function deposit(amount: string) {
    setIsDepositing(true)
    try {
      return await contract.methods
        .lockup(web3.utils.toWei(amount, 'ether'))
        .send({ from: address })
        .catch(console.error)
        .finally(() => {
          setIsDepositing(false)
          reload()
        })
    } finally {
      setIsDepositing(false)
      reload()
    }
  }

  async function claimRewards() {
    setIsClaiming(true)
    try {
      return await contract.methods
        .claimAllRewards()
        .send({ from: address })
        .catch(console.error)
        .finally(() => {
          setIsClaiming(false)
          reload()
        })
    } finally {
      setIsClaiming(false)
      reload()
    }
  }

  async function withdraw(batchId: number) {
    setIsWithdrawing(true)
    try {
      return await contract.methods
        .withdraw(batchId)
        .send({ from: address })
        .catch(console.error)
        .finally(() => {
          setIsWithdrawing(false)
          reload()
        })
    } finally {
      setIsWithdrawing(false)
      reload()
    }
  }

  function toInvestment(inv: any, batchId: number, claimableRewards: string): Investment {
    return {
      amount: new BigNumber(web3.utils.fromWei(inv.amount, 'ether')),
      lockedUntil: inv.lockedUntil,
      initialRewardsPerDeposit: new BigNumber(web3.utils.fromWei(inv.initialRewardsPerDeposit, 'ether')),
      claimedRewards: new BigNumber(web3.utils.fromWei(inv.claimedRewards, 'ether')),
      claimableRewards: new BigNumber(web3.utils.fromWei(claimableRewards, 'ether')),
      batchId,
    }
  }

  async function check(batchId: string): Promise<Investment | undefined> {
    if (isNaN(+batchId)) return undefined
    setIsChecking(true)
    const inv: any = await contract.methods.getBatchData(batchId).call()
    return await contract.methods
      .availableRewards(batchId)
      .call()
      .then((claimableRewards: any) => toInvestment(inv, +batchId, claimableRewards))
      .finally(() => setIsChecking(false))
  }

  async function getEarliestUnlock(): Promise<Unlock> {
    return await contract.methods.earliestUnlock(address).call()
  }

  async function getInvestments(): Promise<Investment[]> {
    const bondTokenAddress = await contract.methods.bondToken().call()
    const bondTokenContract = createBondTokenContract(bondTokenAddress)
    const numberOfBatches = await bondTokenContract.methods.balanceOf(address).call()
    const investments: Investment[] = []
    for (let i = 0; i < numberOfBatches; i++) {
      const batchId = await bondTokenContract.methods.tokenOfOwnerByIndex(address, i).call()
      const inv = await contract.methods.investments(batchId).call({ from: address })
      const claimableRewards = await contract.methods.availableRewards(batchId).call()
      investments.push(toInvestment(inv, batchId, claimableRewards))
    }
    return investments
  }
  const context = useMemo(
    () => ({
      tab,
      tabs,
      setTab,
      isDepositing,
      isClaimable,
      isClaiming,
      isWithdrawing,
      isChecking,
      tvl,
      rewardsPerDeposit,
      totalClaimed,
      totalInvest,
      totalInvestCap,
      totalRewards,
      totalWithdrawn,
      availableRewards,
      lockupPeriod,
      contractAddress,
      coinAddress,
      deposit,
      claimRewards,
      withdraw,
      check,
      earliestUnlock,
      investments,
      isExitCriteriaTriggered,
    }),
    [
      tab,
      tabs,
      isDepositing,
      isClaimable,
      isClaiming,
      isWithdrawing,
      isChecking,
      tvl,
      rewardsPerDeposit,
      totalClaimed,
      totalInvest,
      totalInvestCap,
      totalRewards,
      totalWithdrawn,
      availableRewards,
      lockupPeriod,
      contractAddress,
      coinAddress,
      earliestUnlock,
      investments,
      isExitCriteriaTriggered,
    ],
  )

  return <DUSDLockContext.Provider value={context}>{props.children}</DUSDLockContext.Provider>
}
