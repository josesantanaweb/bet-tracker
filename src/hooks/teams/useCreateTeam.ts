import { useMutation, useQueryClient } from '@tanstack/react-query'

import { teamsQueryKey } from './useTeams'

import type { ICreateTeam } from '@/types'

import { supabase } from '@/lib/supabase'

const createTeam = async (payload: ICreateTeam) => {
  const { error } = await supabase.from('team').insert({
    name: payload.name,
    logo: payload.logo,
    won: 0,
    lost: 0,
  })

  if (error) {
    throw error
  }
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTeam,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: teamsQueryKey })
    },
  })
}
