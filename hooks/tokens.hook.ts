import { useEffect, useRef, useState } from 'react'
import { createClient, getPoolPairs, getCollateralTokens } from '../api/whale-api'
import { Token } from '../dtos/token.dto'
import { toTokens } from '../lib/token.lib'

interface TokensInterface {
  tokens: Token[]
  isLoading: boolean
}

export function useTokens(): TokensInterface {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setLoading] = useState(true)
  const dataFetchedRef = useRef(false)

  const client = createClient()

  useEffect(() => {
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    Promise.all([getPoolPairs(client), getCollateralTokens(client)]).then(([poolpairs, collateralTokens]) => {
      setTokens(toTokens(poolpairs, collateralTokens))
      setLoading(false)
    })
  }, [client])

  return { tokens, isLoading }
}
