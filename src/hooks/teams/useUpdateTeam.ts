import { useMutation, useQueryClient } from '@tanstack/react-query'

import { teamsQueryKey } from './useTeams'

import type { ICreateTeam } from '@/types'

import { supabase } from '@/lib/supabase'


interface IUpdateTeamPayload extends ICreateTeam {
  id: string
}

const parseTeamId = (teamId: string) => {
  const parsedId = Number(teamId)

  if (!Number.isFinite(parsedId)) {
    throw new Error('El id del equipo no es valido')
  }

  return parsedId
}

const updateTeam = async (payload: IUpdateTeamPayload) => {
  const parsedId = parseTeamId(payload.id)

  const { error } = await supabase
    .from('team')
    .update({
      name: payload.name,
      logo: payload.logo,
    })
    .eq('id', parsedId)

  if (error) {
    throw error
  }
}

export const useUpdateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTeam,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: teamsQueryKey })
    },
  })
}
