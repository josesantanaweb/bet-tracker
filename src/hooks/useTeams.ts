import { useQuery } from '@tanstack/react-query'

import type { ITeam } from '@/types'

import { supabase } from '@/libs/supabase'

const fetchTeams = async (): Promise<ITeam[]> => {
  const { data, error } = await supabase
    .from('team')
    .select('id, name, logo, won, lost')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map((team) => {
    const won = team.won ?? 0
    const lost = team.lost ?? 0

    return {
      id: String(team.id),
      name: team.name ?? 'Sin nombre',
      logo: team.logo ?? '',
      won,
      lost,
    }
  })
}

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  })
}