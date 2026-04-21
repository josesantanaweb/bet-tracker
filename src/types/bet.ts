import type { IMatchTeam } from './match'

export const BetStatus = {
  PENDING: 'PENDING',
  WON: 'WON',
  LOST: 'LOST',
} as const

export type BetStatus = (typeof BetStatus)[keyof typeof BetStatus]

export const BetSelection = {
  HOME: 'HOME',
  AWAY: 'AWAY',
} as const

export type BetSelection = (typeof BetSelection)[keyof typeof BetSelection]

export const BetSelectionLabel: Record<BetSelection, string> = {
  [BetSelection.HOME]: 'Local',
  [BetSelection.AWAY]: 'Visitante',
}

export interface IBet {
  id: string
  marketId: string
  home: IMatchTeam
  away: IMatchTeam
  market: string
  date: string
  selection: BetSelection
  odd: number
  stake: number
  payout: number
  status: BetStatus
}

export interface ICreateBet {
  matchId: string
  marketId: string
  market: string
  selection: BetSelection
  odd: number
  stake: number
  payout: number
}