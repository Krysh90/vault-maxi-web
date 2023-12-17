import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import { useWalletContext } from '../contexts/wallet.context'
import ERC20 from '../lib/erc20.abi.json'

interface DUSDInterface {
  isApproving: boolean
  balance?: BigNumber
  approvedAmount?: BigNumber
  approve: (amount: string) => Promise<void>
}

export function useDUSD(contractAddress?: string, dusdLocksAddress?: string): DUSDInterface {
  const { address } = useWalletContext()
  const web3 = new Web3(Web3.givenProvider)
  const [isApproving, setIsApproving] = useState(false)
  const [balance, setBalance] = useState<BigNumber>()
  const [approvedAmount, setApprovedAmount] = useState<BigNumber>()

  function createContract(): Contract {
    return new web3.eth.Contract(ERC20 as any, contractAddress)
  }

  useEffect(() => {
    if (contractAddress && dusdLocksAddress) {
      reload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress, dusdLocksAddress])

  function reload() {
    getBalance().then(setBalance).catch(console.error)
    getApprovedAmount().then(setApprovedAmount).catch(console.error)
  }

  async function getBalance(): Promise<BigNumber> {
    return new BigNumber(web3.utils.fromWei(await createContract().methods.balanceOf(address).call(), 'ether'))
  }

  async function getApprovedAmount(): Promise<BigNumber> {
    return new BigNumber(
      web3.utils.fromWei(await createContract().methods.allowance(address, dusdLocksAddress).call(), 'ether'),
    )
  }

  async function approve(amount: string) {
    setIsApproving(true)
    try {
      return await createContract()
        .methods.approve(dusdLocksAddress, web3.utils.toWei(amount, 'ether'))
        .send({
          from: address,
        })
        .catch(console.error)
        .finally(() => {
          setIsApproving(false)
          reload()
        })
    } finally {
      setIsApproving(false)
      reload()
    }
  }

  return useMemo(
    () => ({ isApproving, balance, approvedAmount, approve }),
    [isApproving, balance, approvedAmount, contractAddress, dusdLocksAddress],
  )
}
