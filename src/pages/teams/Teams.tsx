import { AnimatePresence, motion } from 'framer-motion'

import { Team } from './Team'

import type { ITeam } from '@/types'

interface TeamsProps {
  teams: ITeam[]
  activeTab: 'all' | 'favorites'
  onEditTeam: (team: ITeam) => void
  onDeleteTeam: (team: ITeam) => void
  onFavoriteTeam: (team: ITeam) => void
}

export const Teams = ({ teams, activeTab, onEditTeam, onDeleteTeam, onFavoriteTeam }: TeamsProps) => {

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="grid grid-cols-2 items-center gap-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {teams.map((team) => (
          <motion.div
            key={team.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Team
              team={team}
              onEdit={() => onEditTeam(team)}
              onDelete={() => onDeleteTeam(team)}
              onFavorite={() => onFavoriteTeam(team)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
