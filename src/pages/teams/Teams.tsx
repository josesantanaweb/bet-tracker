import { Team } from './Team'

import type { ITeam } from '@/types'

interface TeamsProps {
  teams: ITeam[]
  onEditTeam: (team: ITeam) => void
  onDeleteTeam: (team: ITeam) => void
}

export const Teams = ({ teams, onEditTeam, onDeleteTeam }: TeamsProps) => {
  return (
    <div className="grid grid-cols-2 items-center gap-3 py-8">
      {teams.map((team) => (
        <Team
          key={team.id}
          team={team}
          onEdit={() => onEditTeam(team)}
          onDelete={() => onDeleteTeam(team)}
        />
      ))}
    </div>
  )
}
