import { useMutation, useQueryClient } from '@tanstack/react-query'

import { matchesQueryKey } from './useMatches'

import { supabase } from '@/lib/supabase'

const parseMatchId = (matchId: string) => {
  const parsedId = Number(matchId)

  if (!Number.isFinite(parsedId)) {
    throw new Error('El id del partido no es valido')
  }

  return parsedId
}

const deleteMatch= async (matchId: string) => {
  const parsedId = parseMatchId(matchId)

  const { error } = await supabase.from('match').delete().eq('id', parsedId)

  if (error) {
    throw error
  }
}

export const useDeleteMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMatch,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: matchesQueryKey })
    },
  })
}
