import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import { MatchStatus, type IMatch } from '@/types'

export const matchesQueryKey = ['matches']

const isMatchStatus = (value: unknown): value is MatchStatus =>
  value === MatchStatus.PENDING || value === MatchStatus.LIVE || value === MatchStatus.FINISHED

type TeamRelation = {
  name?: string | null
  logo?: string | null
}

type MarketRelation = {
  id?: number | null
  name?: string | null
}

type MatchMarketRelation = {
  odd_home?: number | null
  odd_away?: number | null
  market?: MarketRelation | MarketRelation[] | null
}

const getSingleRelation = <T>(value: T | T[] | null | undefined): T | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

const fetchMatches = async (): Promise<IMatch[]> => {
  const { data, error } = await supabase
    .from('match')
    .select(
      `
        id,
        date,
        status,
        home:team!home_team_id (name, logo),
        away:team!away_team_id (name, logo),
        matchMarkets:match_market (
          odd_home,
          odd_away,
          market:market_id (
            id,
            name
          )
        )
      `,
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map((match) => {
    const home = getSingleRelation(match.home as TeamRelation | TeamRelation[] | null)
    const away = getSingleRelation(match.away as TeamRelation | TeamRelation[] | null)
    const matchMarkets = (match.matchMarkets ?? []) as MatchMarketRelation[]

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
      matchMarkets: matchMarkets.map((item, index) => {
        const market = getSingleRelation(item.market)

        return {
          id: String(market?.id ?? index),
          name: market?.name ?? 'Sin nombre',
          odds: {
            home: Number(item.odd_home ?? 0),
            away: Number(item.odd_away ?? 0),
          },
        }
      }),
    }
  })
}

export const useMatches = () => {
  return useQuery({
    queryKey: matchesQueryKey,
    queryFn: fetchMatches,
  })
}
