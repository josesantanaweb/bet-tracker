import { Trophy, TrendingDown, Trash } from '@boxicons/react'

import type { ITeam } from '@/types'

interface TeamProps {
  team: ITeam
}

export const Team = ({ team }: TeamProps) => {
  return (
    <div className="bg-secondary-dark flex items-center justify-between rounded-xl p-4 relative">
      <div className="gap- flex w-full flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center gap-2">
          <div className="h-8 w-8">
            <img src={team.logo} alt={team.name} className="h-full w-full object-cover" />
          </div>
          <h6 className="text-sm font-semibold text-white">{team.name}</h6>
          <div className="flex items-center gap-2">
            <div className="text-success flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              <p className="text-xs">{team.won}</p>
            </div>
            <div className="flex items-center gap-1 text-red-600">
              <TrendingDown className="h-3 w-3" />
              <p className="text-xs">{team.lost}</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="text-red-600 cursor-pointer text-sm absolute top-2 right-2">
        <Trash className="w-4 h-4" />
      </button>
    </div>
  )
}
