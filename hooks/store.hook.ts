export interface StoreInterface {
  addresses: {
    get: () => string[] | undefined
    set: (addresses: string[]) => void
  }
}

enum StoreKey {
  ADDRESSES = 'addresses',
}

export function useStore(): StoreInterface {
  const delimiter = ','
  const { localStorage } = window

  function set(key: StoreKey, value: string) {
    localStorage.setItem(key, value)
  }

  function get(key: StoreKey): string | undefined {
    return localStorage.getItem(key) ?? undefined
  }

  return {
    addresses: {
      get: () => get(StoreKey.ADDRESSES)?.split(delimiter),
      set: (addresses: string[]) => set(StoreKey.ADDRESSES, addresses.join(delimiter)),
    },
  }
}
