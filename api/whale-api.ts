import { ApiPagedResponse, WhaleApiClient } from '@defichain/whale-api-client'
import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { CollateralToken } from '@defichain/whale-api-client/dist/api/loan'

export function createClient(): WhaleApiClient {
  return new WhaleApiClient({
    version: 'v0',
    network: 'mainnet',
    url: 'https://ocean.defichain.com',
  })
}

export async function getPoolPairs(client: WhaleApiClient): Promise<PoolPairData[]> {
  return getAll(() => client.poolpairs.list(200), client)
}

export async function getTokens(client: WhaleApiClient): Promise<CollateralToken[]> {
  return getAll(() => client.loan.listCollateralToken(200), client)
}

async function getAll<T>(method: () => Promise<ApiPagedResponse<T>>, client: WhaleApiClient): Promise<T[]> {
  const batches = [await method()]
  while (batches[batches.length - 1].hasNext) {
    try {
      batches.push(await client.paginate(batches[batches.length - 1]))
    } catch (e) {
      break
    }
  }

  return batches.reduce((prev, curr) => prev.concat(curr), [] as T[])
}
