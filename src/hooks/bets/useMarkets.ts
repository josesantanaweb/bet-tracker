import { useQuery } from '@tanstack/react-query'

import type { IMarket } from '@/types'

import { supabase } from '@/lib/supabase'

export const marketsQueryKey = ['markets']

const fetchMarkets = async (): Promise<IMarket[]> => {
  const { data, error } = await supabase
    .from('market')
    .select(
      `
        id,
        name
      `,
    )
    .order('name', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map((market) => ({
    id: String(market.id),
    name: market.name ?? 'Sin nombre',
  }))
}

export const useMarkets = () => {
  return useQuery({
    queryKey: marketsQueryKey,
    queryFn: fetchMarkets,
  })
}