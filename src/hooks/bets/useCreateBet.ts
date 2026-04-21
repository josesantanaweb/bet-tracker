import { useMutation, useQueryClient } from '@tanstack/react-query'

import { betsQueryKey } from './useBets'

import type { ICreateBet } from '@/types'

import { supabase } from '@/lib/supabase'
import { BetStatus } from '@/types'

const parseMatchId = (matchId: string) => {
  const parsedId = Number(matchId)

  if (!Number.isFinite(parsedId)) {
    throw new Error('El id del partido no es valido')
  }

  return parsedId
}

const parseMarketId = (marketId: string) => {
  const parsedId = Number(marketId)

  if (!Number.isFinite(parsedId)) {
    throw new Error('El id del mercado no es valido')
  }

  return parsedId
}

const createBet = async (payload: ICreateBet) => {
  const matchId = parseMatchId(payload.matchId)
  const marketId = parseMarketId(payload.marketId)

  const { error } = await supabase.from('bet').insert({
    match_id: matchId,
    market_id: marketId,
    market: payload.market,
    selection: payload.selection,
    odd: payload.odd,
    stake: payload.stake,
    payout: payload.payout,
    status: BetStatus.PENDING,
  })

  if (error) {
    throw error
  }
}

export const useCreateBet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBet,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: betsQueryKey })
    },
  })
}
