export interface IMatchTeam {
  name: string
  logo: string
}

export interface IMatchMarketOdds {
  home: number
  away: number
}

export interface IMatchMarket {
  id: string
  name: string
  odds: IMatchMarketOdds
}

export interface ICreateMatchMarket {
  marketId: string
  oddHome: number
  oddAway: number
}

export const MatchStatus = {
  PENDING: 'PENDING',
  LIVE: 'LIVE',
  FINISHED: 'FINISHED',
} as const

export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus]

export interface IMatch {
  id: string
  home: IMatchTeam
  away: IMatchTeam
  date: string
  status: MatchStatus
  matchMarkets: IMatchMarket[]
}

export interface ICreateMatch {
  homeTeamId: string
  awayTeamId: string
  date: string
  matchMarkets: ICreateMatchMarket[]
}
  