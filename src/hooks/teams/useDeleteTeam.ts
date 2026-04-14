import { useMutation, useQueryClient } from '@tanstack/react-query'

import { teamsQueryKey } from './useTeams'

import { supabase } from '@/lib/supabase'

const parseTeamId = (teamId: string) => {
  const parsedId = Number(teamId)

  if (!Number.isFinite(parsedId)) {
    throw new Error('El id del equipo no es valido')
  }

  return parsedId
}

const deleteTeam = async (teamId: string) => {
  const parsedId = parseTeamId(teamId)

  const { error } = await supabase.from('team').delete().eq('id', parsedId)

  if (error) {
    throw error
  }
}

export const useDeleteTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: teamsQueryKey })
    },
  })
}
