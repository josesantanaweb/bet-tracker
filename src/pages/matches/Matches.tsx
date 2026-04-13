import { Match } from './Match'

import type { IMatch } from '@/types'

interface MatchesProps {
  matches: IMatch[]
  onEditMatch: (match: IMatch) => void
  onDeleteMatch: (match: IMatch) => void
}

export const Matches = ({ matches, onEditMatch, onDeleteMatch }: MatchesProps) => {
  return (
    <div className="grid grid-cols-1 items-center gap-3 py-8">
      {matches.map((match) => (
        <Match
          key={match.id}
          match={match}
          onEdit={() => onEditMatch(match)}
          onDelete={() => onDeleteMatch(match)}
        />
      ))}
    </div>
  )
}
