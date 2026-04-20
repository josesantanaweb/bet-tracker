import type { IMatchTeam } from './match'

export const BetStatus = {
  PENDING: 'PENDING',
  WON: 'WON',
  LOST: 'LOST',
} as const

export type BetStatus = (typeof BetStatus)[keyof typeof BetStatus]

export interface IBet {
  id: string
  home: IMatchTeam
  away: IMatchTeam
  market: string
  selection: string
  odd: number
  stake: number
  payout: number
  status: BetStatus
}