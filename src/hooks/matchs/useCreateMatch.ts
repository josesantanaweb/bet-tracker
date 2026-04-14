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

const createMatch = async (payload: ICreateMatch) => {
  const homeTeamId = parseTeamId(payload.homeTeamId)
  const awayTeamId = parseTeamId(payload.awayTeamId)

  const { error } = await supabase.from('match').insert({
    date: payload.date,
    markets: payload.markets,
    home_team_id: homeTeamId,
    away_team_id: awayTeamId,
    status: MatchStatus.PENDING,
  })

  if (error) {
    throw error
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