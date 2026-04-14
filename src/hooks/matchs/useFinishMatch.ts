import { useMutation, useQueryClient } from '@tanstack/react-query'

import { matchesQueryKey } from './useMatches'

import { supabase } from '@/lib/supabase'
import { MatchStatus } from '@/types'

const parseMatchId = (matchId: string) => {
  const parsedId = Number(matchId)

  if (!Number.isFinite(parsedId)) {
    throw new Error('El id del partido no es valido')
  }

  return parsedId
}

const finishMatch = async (matchId: string) => {
  const parsedId = parseMatchId(matchId)

  const { error } = await supabase
    .from('match')
    .update({ status: MatchStatus.FINISHED })
    .eq('id', parsedId)

  if (error) {
    throw error
  }
}

export const useFinishMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: finishMatch,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: matchesQueryKey })
    },
  })
}