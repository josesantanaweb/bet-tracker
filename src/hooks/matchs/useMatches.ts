import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import { MatchStatus, type IMatch } from '@/types'

export const matchesQueryKey = ['matches']

const isMatchStatus = (value: unknown): value is MatchStatus =>
  value === MatchStatus.PENDING || value === MatchStatus.LIVE || value === MatchStatus.FINISHED

const fetchMatches = async (): Promise<IMatch[]> => {
  const { data, error } = await supabase
    .from('match')
    .select(
      `
        id,
        date,
        status,
        markets,
        home:team!home_team_id (id, name, logo),
        away:team!away_team_id (id, name, logo)
      `,
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map((match) => {
    const home = Array.isArray(match.home) ? match.home[0] : match.home
    const away = Array.isArray(match.away) ? match.away[0] : match.away

    const status = isMatchStatus(match.status) ? match.status : MatchStatus.PENDING

    return {
      id: String(match.id),
      home: {
        name: home?.name ?? 'Sin nombre',
        logo: home?.logo ?? '',
      },
      away: {
        name: away?.name ?? 'Sin nombre',
        logo: away?.logo ?? '',
      },
      date: match.date ?? '',
      status,
      markets: match.markets ?? [],
    }
  })
}

export const useMatches = () => {
  return useQuery({
    queryKey: matchesQueryKey,
    queryFn: fetchMatches,
  })
}
