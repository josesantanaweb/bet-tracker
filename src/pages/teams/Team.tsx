import { Trophy, TrendingDown } from '@boxicons/react'

import { DropdownActions } from '@components/common/DropdownActions'

import type { ITeam } from '@/types'

interface TeamProps {
  team: ITeam
}

export const Team = ({ team }: TeamProps) => {
  const handleEdit = () => console.log('2312')
  const handleDelete = () => console.log('2312')

  return (
    <div className="bg-secondary-dark relative flex items-center justify-between rounded-xl p-4">
      <div className="absolute top-2 right-1">
        <DropdownActions onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3">
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
    </div>
  )
}
