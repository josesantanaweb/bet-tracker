import { useMutation, useQueryClient } from '@tanstack/react-query'

import { betsQueryKey } from './useBets'

import { supabase } from '@/lib/supabase'

const parseBetId = (betId: string) => {
  const parsedId = Number(betId)

  if (!Number.isFinite(parsedId)) {
    throw new Error('El id de la apuesta no es valido')
  }

  return parsedId
}

const deleteBet= async (betId: string) => {
  const parsedId = parseBetId(betId)

  const { error } = await supabase.from('bet').delete().eq('id', parsedId)

  if (error) {
    throw error
  }
}

export const useDeleteBet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBet,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: betsQueryKey })
    },
  })
}
