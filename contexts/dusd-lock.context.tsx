import Web3 from 'web3'
import ABI from '../lib/DUSDLock.abi.json'
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
  isClaiming: boolean
  isWithdrawing: boolean
  tvl?: BigNumber
  lockupPeriod?: BigNumber
  numberOfAddresses?: BigNumber
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
}

export enum Tab {
  deposit,
  claim,
  withdraw,
  stats,
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
}

const DUSDLockContext = createContext<DUSDLockContextInterface>(undefined as any)

export function useDUSDLockContext(): DUSDLockContextInterface {
  return useContext(DUSDLockContext)
}

export function DUSDLockContextProvider(props: PropsWithChildren): JSX.Element {
  const { address, isConnected, block, chain } = useWalletContext()
  const web3 = new Web3(Web3.givenProvider)

  const [tab, setTab] = useState<Tab>(Tab.deposit)
  const tabs = [Tab.deposit, Tab.claim, Tab.withdraw, Tab.stats]

  const contractAddress = '0x03812a485f2acCafbF1E57b050ed85Ca5D3277a0'
  const [isDepositing, setIsDepositing] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isExitCriteriaTriggered, setIsExitCriteriaTriggered] = useState(false)
  const [tvl, setTvl] = useState<BigNumber>()
  const [numberOfAddresses, setNumberOfAddresses] = useState<BigNumber>()
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
  const [lastDepositBlock, setLastDepositBlock] = useState<number>()
  const [lastClaimBlock, setLastClaimBlock] = useState<number>()
  const [lastWithdrawBlock, setLastWithdrawBlock] = useState<number>()
  const [lastStatsBlock, setLastStatsBlock] = useState<number>()

  function createContract(): Contract {
    return new web3.eth.Contract(ABI as any, contractAddress)
  }

  function reload() {
    switch (tab) {
      case Tab.stats:
        if ((block ?? 0) <= (lastStatsBlock ?? 0)) return
        getTvl().then(setTvl).catch(console.error)
        getNumberOfAddresses().then(setNumberOfAddresses).catch(console.error)
        getRewardsPerDeposit().then(setRewardsPerDeposit).catch(console.error)
        getTotalClaimed().then(setTotalClaimed).catch(console.error)
        getTotalRewards().then(setTotalRewards).catch(console.error)
        getTotalWithdrawn().then(setTotalWithdrawn).catch(console.error)
        setLastStatsBlock(block)
        break
      case Tab.deposit:
        if ((block ?? 0) <= (lastDepositBlock ?? 0)) return
        getTotalInvest().then(setTotalInvest).catch(console.error)
        getTotalInvestCap().then(setTotalInvestCap).catch(console.error)
        setLastDepositBlock(block)
        break
      case Tab.claim:
        if ((block ?? 0) <= (lastClaimBlock ?? 0)) return
        getInvestments().then(setInvestments).catch(console.error)
        getAvailableRewards().then(setAvailableRewards).catch(console.error)
        setLastClaimBlock(block)
        break
      case Tab.withdraw:
        if ((block ?? 0) <= (lastWithdrawBlock ?? 0)) return
        getInvestments().then(setInvestments).catch(console.error)
        getEarliestUnlock().then(setEarliestUnlock).catch(console.error)
        getExitCriteriaTriggered().then(setIsExitCriteriaTriggered).catch(console.error)
        setLastWithdrawBlock(block)
        break
    }

    if (!coinAddress) getCoinAddress().then(setCoinAddress).catch(console.error)
    if (!lockupPeriod) getLockupPeriod().then(setLockupPeriod).catch(console.error)
  }

  useEffect(() => {
    if (isConnected && chain == testnet.chainId) {
      reload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, tab, block, chain])

  async function getTvl(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await createContract().methods.currentTvl().call(), 'ether'))
  }

  async function getNumberOfAddresses(): Promise<BigNumber> {
    return new BigNumber(await createContract().methods.nrOfAddresses().call())
  }

  async function getRewardsPerDeposit(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await createContract().methods.rewardsPerDeposit().call(), 'ether'))
  }

  async function getTotalClaimed(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await createContract().methods.totalClaimed().call(), 'ether'))
  }

  async function getTotalInvest(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await createContract().methods.totalInvest().call(), 'ether'))
  }

  async function getTotalInvestCap(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await createContract().methods.totalInvestCap().call(), 'ether'))
  }

  async function getTotalRewards(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await createContract().methods.totalRewards().call(), 'ether'))
  }

  async function getTotalWithdrawn(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await createContract().methods.totalWithdrawn().call(), 'ether'))
  }

  async function getAvailableRewards(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await createContract().methods.availableOwnRewards().call(), 'ether'))
  }

  async function getLockupPeriod(): Promise<BigNumber> {
    return new BigNumber(await createContract().methods.lockupPeriod().call())
  }

  async function getExitCriteriaTriggered(): Promise<boolean> {
    return await createContract().methods.exitCriteriaTriggered().call()
  }

  async function getCoinAddress(): Promise<string> {
    return await createContract().methods.coin().call()
  }

  async function deposit(amount: string) {
    setIsDepositing(true)
    try {
      return await createContract()
        .methods.lockup(web3.utils.toWei(amount, 'ether'))
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
      return await createContract()
        .methods.claimAllRewards()
        .send({ from: address })
        .finally(() => {
          setIsClaiming(false)
          reload()
        })
    } finally {
      setIsClaiming(false)
      reload()
    }
  }

  async function withdraw(index: number) {
    setIsWithdrawing(true)
    try {
      return await createContract()
        .methods.withdraw(index)
        .send({ from: address })
        .finally(() => {
          setIsWithdrawing(false)
          reload()
        })
    } finally {
      setIsWithdrawing(false)
      reload()
    }
  }

  async function getEarliestUnlock(): Promise<Unlock> {
    return await createContract().methods.earliestUnlock(address).call()
  }

  async function getInvestments(): Promise<Investment[]> {
    const contract = createContract()
    const numberOfBatches = await contract.methods.batchesInAddress(address).call()
    const investments: Investment[] = []
    for (let i = 0; i < numberOfBatches; i++) {
      const inv = await contract.methods.investments(address, i).call()
      investments.push({
        amount: new BigNumber(web3.utils.fromWei(inv.amount, 'ether')),
        lockedUntil: inv.lockedUntil,
        initialRewardsPerDeposit: new BigNumber(web3.utils.fromWei(inv.initialRewardsPerDeposit, 'ether')),
        claimedRewards: new BigNumber(web3.utils.fromWei(inv.claimedRewards, 'ether')),
      })
    }
    return investments
  }
  const context = useMemo(
    () => ({
      tab,
      tabs,
      setTab,
      isDepositing,
      isClaiming,
      isWithdrawing,
      tvl,
      numberOfAddresses,
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
      earliestUnlock,
      investments,
      isExitCriteriaTriggered,
    }),
    [
      tab,
      tabs,
      isDepositing,
      isClaiming,
      isWithdrawing,
      tvl,
      numberOfAddresses,
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
