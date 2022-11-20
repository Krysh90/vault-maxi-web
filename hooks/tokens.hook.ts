import { useEffect, useRef, useState } from 'react'
import { createClient, getPoolPairs, getTokens } from '../api/whale-api'
import { Token } from '../dtos/token.dto'
import { toTokens } from '../lib/token.lib'

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>()
  const [isLoading, setLoading] = useState(true)
  const dataFetchedRef = useRef(false)

  const client = createClient()

  useEffect(() => {
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    Promise.all([getPoolPairs(client), getTokens(client)]).then(([poolpairs, collateralTokens]) => {
      setTokens(toTokens(poolpairs, collateralTokens))
      setLoading(false)
    })
  }, [client])

  return { tokens, isLoading }
}
