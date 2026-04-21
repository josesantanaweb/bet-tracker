import { useMutation, useQueryClient } from '@tanstack/react-query'

import { teamsQueryKey } from './useTeams'

import type { IUpdateTeam } from '@/types'

import { supabase } from '@/lib/supabase'

const parseTeamId = (teamId: string) => {
  const parsedId = Number(teamId)

  if (!Number.isFinite(parsedId)) {
    throw new Error('El id del equipo no es valido')
  }

  return parsedId
}

const updateTeam = async (payload: IUpdateTeam) => {
  const parsedId = parseTeamId(payload.id)
  const { id: _id, name, logo, isFavorite } = payload

  const updates: Record<string, string | boolean> = {}

  if (typeof name === 'string') {
    updates.name = name
  }

  if (typeof logo === 'string') {
    updates.logo = logo
  }

  if (typeof isFavorite === 'boolean') {
    updates.is_favorite = isFavorite
  }

  const { error } = await supabase
    .from('team')
    .update(updates)
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
