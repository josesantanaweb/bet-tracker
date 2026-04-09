import { Trophy, TrendingDown, Trash, Edit } from '@boxicons/react'

import type { ITeam } from '@/types'

interface TeamProps {
  team: ITeam
}

export const Team = ({ team }: TeamProps) => {
  return (
    <div className="bg-secondary-dark relative flex items-center justify-between rounded-xl p-4">
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
      <div className="flex items-center gap-1 absolute top-2 right-2 ">
        <button
          type="button"
          className="cursor-pointer text-sm text-yellow-600"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="cursor-pointer text-sm text-red-600"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
