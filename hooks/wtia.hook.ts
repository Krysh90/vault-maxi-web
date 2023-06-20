import Web3 from 'web3'
import WTIA_ABI from '../public/sc/winnerTakesItAll120.json'
import { useWalletContext } from '../contexts/wallet.context'
import { Contract } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'

export interface WTIAInterface {
  reload: () => void
  waitBlocks?: number
  balance?: BigNumber
  lastGambler?: string
  lastInputBlock?: BigNumber
  nextMinAmount?: BigNumber
  gamble: (amount: string) => Promise<void>
  claim: () => Promise<void>
}

export function useWTIA(): WTIAInterface {
  const { address, isConnected } = useWalletContext()
  const web3 = new Web3(Web3.givenProvider)

  const [waitBlocks, setWaitBlocks] = useState<number>()
  const [balance, setBalance] = useState<BigNumber>()
  const [lastGambler, setLastGambler] = useState<string>()
  const [lastInputBlock, setLastInputBlock] = useState<BigNumber>()
  const [nextMinAmount, setNextMinAmount] = useState<BigNumber>()

  function createContract(): Contract {
    return new web3.eth.Contract(WTIA_ABI as any, '0x67488912788Bf6C634909f4411047aE0136C801A')
  }

  function reload() {
    getWaitBlocks().then(setWaitBlocks).catch(console.error)
    getBalance().then(setBalance).catch(console.error)
    getLastGambler().then(setLastGambler).catch(console.error)
    getLastInputBlock().then(setLastInputBlock).catch(console.error)
    getNextMinAmount().then(setNextMinAmount).catch(console.error)
  }

  useEffect(() => {
    if (isConnected) {
      reload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  async function getWaitBlocks(): Promise<number> {
    return await createContract().methods.WAIT_TIME_BLOCKS().call()
  }

  async function getBalance(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await createContract().methods.balance().call(), 'ether'))
  }

  async function getLastGambler(): Promise<string> {
    return await createContract().methods.lastInput().call()
  }

  async function getLastInputBlock(): Promise<BigNumber> {
    return new BigNumber(await createContract().methods.lastInputBlock().call())
  }

  async function getNextMinAmount(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await createContract().methods.nextMinAmount().call(), 'ether'))
  }

  async function gamble(amount: string): Promise<void> {
    return createContract()
      .methods.gamble()
      .send({
        from: address,
        value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
      })
  }

  async function claim(): Promise<void> {
    return createContract().methods.claim().send({ from: address })
  }

  return useMemo(
    () => ({ reload, waitBlocks, balance, lastGambler, lastInputBlock, nextMinAmount, gamble, claim }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [waitBlocks, balance, lastGambler, lastInputBlock, nextMinAmount],
  )
}
