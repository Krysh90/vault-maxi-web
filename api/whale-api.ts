import { ApiPagedResponse, WhaleApiClient } from '@defichain/whale-api-client'
import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import {
  CollateralToken,
  LoanToken,
  LoanVaultActive,
  LoanVaultLiquidated,
} from '@defichain/whale-api-client/dist/api/loan'
import { PriceTicker } from '@defichain/whale-api-client/dist/api/prices'

export function createClient(): WhaleApiClient {
  return new WhaleApiClient({
    version: 'v0',
    network: 'mainnet',
    url: 'https://ocean.mydefichain.com',
  })
}

export async function getPoolPairs(client: WhaleApiClient): Promise<PoolPairData[]> {
  return getAll(() => client.poolpairs.list(), client)
}

export async function getCollateralTokens(client: WhaleApiClient): Promise<CollateralToken[]> {
  return getAll(() => client.loan.listCollateralToken(), client)
}

export async function getLoanTokens(client: WhaleApiClient): Promise<LoanToken[]> {
  return getAll(() => client.loan.listLoanToken(), client)
}

export async function getPrices(client: WhaleApiClient): Promise<PriceTicker[]> {
  return getAll(() => client.prices.list(), client)
}

export async function getVault(client: WhaleApiClient, id: string): Promise<LoanVaultActive | LoanVaultLiquidated> {
  return client.loan.getVault(id)
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
