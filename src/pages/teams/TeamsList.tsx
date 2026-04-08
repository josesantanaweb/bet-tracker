import { Team } from './Team'

import type { ITeam } from '@/types'

interface TeamsListProps {
  teams: ITeam[]
}

export const TeamsList = ({ teams }: TeamsListProps) => {
  return (
    <div className="grid grid-cols-2 items-center gap-3 py-8">
      {teams.map((team) => (
        <Team key={team.id} team={team} />
      ))}
    </div>
  )
}
