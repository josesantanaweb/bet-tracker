import { useMutation, useQueryClient } from '@tanstack/react-query'

import { betsQueryKey } from './useBets'

import { supabase } from '@/lib/supabase'
import { BetStatus, type BetStatus as TBetStatus } from '@/types'

const parseBetId = (betId: string) => {
  const parsedId = Number(betId)

  if (!Number.isFinite(parsedId)) {
    throw new Error('El id de la apuesta no es valido')
  }

  return parsedId
}

type FinishBetParams = {
  betId: string
  status: TBetStatus
}

const isResolvableBetStatus = (status: TBetStatus) =>
  status === BetStatus.WON || status === BetStatus.LOST

const finishBet = async ({ betId, status }: FinishBetParams) => {
  if (!isResolvableBetStatus(status)) {
    throw new Error('Solo se puede actualizar la apuesta a ganada o perdida')
  }

  const parsedId = parseBetId(betId)

  const { error } = await supabase
    .from('bet')
    .update({ status })
    .eq('id', parsedId)

  if (error) {
    throw error
  }
}

export const useFinishBet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: finishBet,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: betsQueryKey })
    },
  })
}