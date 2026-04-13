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

export interface IMatch {
  id: string
  home: IMatchTeam
  away: IMatchTeam
  date: string
  time: string
  status: 'pending' | 'live' | 'finished'
  result: string | null
  markets: IMatchMarket[]
}

export interface ICreateMatch {
  home: IMatchTeam
  away: IMatchTeam
  date: string
  time: string
  markets: IMatchMarket[]
}
  