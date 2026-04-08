import { useState } from 'react'

import { TeamsList } from './TeamsList'

import type { ITeam } from '@/types'

import { HeaderSections, EmptyState } from '@/components/common'

export default function TeamsPage() {
  const [teams, setTeams] = useState<ITeam[]>([
    {
      id: '1',
      name: 'Barcelona',
      logo: 'https://static.flashscore.com/res/image/data/8dhw5vxS-fcDVLdrL.png',
      won: 3,
      lost: 0,
      bets: 3,
    },
    {
      id: '2',
      name: 'Atletico de Madrid',
      logo: 'https://static.flashscore.com/res/image/data/CjfjIsYg-GhHiNvXF.png',
      won: 1,
      lost: 0,
      bets: 1,
    },
    {
      id: '3',
      name: 'Atletico de Madrid',
      logo: 'https://static.flashscore.com/res/image/data/CjfjIsYg-GhHiNvXF.png',
      won: 1,
      lost: 0,
      bets: 1,
    },
  ])

  return (
    <div className="animate-fade-in flex flex-col">
      <HeaderSections title="Mis Equipos" description={`${teams.length} equipos registrados`} />
      {teams.length === 0 && <EmptyState text="Agrega tu primer equipo" />}
      {teams.length > 0 && <TeamsList teams={teams} />}
    </div>
  )
}
