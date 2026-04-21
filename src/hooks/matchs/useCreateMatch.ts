import { useMutation, useQueryClient } from '@tanstack/react-query'

import { matchesQueryKey } from './useMatches'

import type { ICreateMatch } from '@/types'

import { supabase } from '@/lib/supabase'
import { MatchStatus } from '@/types'

const parseTeamId = (teamId: string) => {
  const parsedId = Number(teamId)

  if (!Number.isFinite(parsedId)) {
    throw new Error('El id del equipo no es valido')
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

const createMatch = async (payload: ICreateMatch) => {
  const homeTeamId = parseTeamId(payload.homeTeamId)
  const awayTeamId = parseTeamId(payload.awayTeamId)

  const { data: createdMatch, error: createMatchError } = await supabase
    .from('match')
    .insert({
      date: payload.date,
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      status: MatchStatus.PENDING,
    })
    .select('id')
    .single()

  if (createMatchError) {
    throw createMatchError
  }

  const matchId = createdMatch?.id

  if (!matchId) {
    throw new Error('No se pudo obtener el id del partido creado')
  }

  const rows = payload.matchMarkets.map((market) => ({
    match_id: matchId,
    market_id: parseMarketId(market.marketId),
    odd_home: market.oddHome,
    odd_away: market.oddAway,
  }))

  const { error: createMatchMarketsError } = await supabase.from('match_market').insert(rows)

  if (createMatchMarketsError) {
    throw createMatchMarketsError
  }
}

export const useCreateMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMatch,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: matchesQueryKey })
    },
  })
}