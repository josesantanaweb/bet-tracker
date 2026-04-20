import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import { BetStatus, type IBet } from '@/types'

export const betsQueryKey = ['bets']

const isBetStatus = (value: unknown): value is BetStatus =>
  value === BetStatus.PENDING || value === BetStatus.WON || value === BetStatus.LOST

type TeamRelation = {
  name?: string | null
  logo?: string | null
}

type MatchRelation = {
  home?: TeamRelation | TeamRelation[] | null
  away?: TeamRelation | TeamRelation[] | null
}

const getSingleRelation = <T>(value: T | T[] | null | undefined): T | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

const fetchBets = async (): Promise<IBet[]> => {
  const { data, error } = await supabase
    .from('bet')
    .select(
      `
        id,
        status,
        selection,
        market,
        odd,
        stake,
        payout,
        match:match_id (
          home:team!home_team_id (name, logo),
          away:team!away_team_id (name, logo)
        )
      `,
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map((bet) => {
    const match = getSingleRelation(bet.match as MatchRelation | MatchRelation[] | null)
    const home = getSingleRelation(match?.home)
    const away = getSingleRelation(match?.away)

    const status = isBetStatus(bet.status) ? bet.status : BetStatus.PENDING

    return {
      id: String(bet.id),
      home: {
        name: home?.name ?? 'Sin nombre',
        logo: home?.logo ?? '',
      },
      away: {
        name: away?.name ?? 'Sin nombre',
        logo: away?.logo ?? '',
      },
      market: bet.market ?? '',
      selection: bet.selection ?? '',
      odd: Number(bet.odd ?? 0),
      stake: Number(bet.stake ?? 0),
      payout: Number(bet.payout ?? 0),
      status,
    }
  })
}

export const useBets = () => {
  return useQuery({
    queryKey: betsQueryKey,
    queryFn: fetchBets,
  })
}
