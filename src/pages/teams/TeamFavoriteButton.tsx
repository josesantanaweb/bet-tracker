import { Star } from '@boxicons/react'
import { motion } from 'framer-motion'

interface TeamProps {
  isFavorite: boolean
  onClick: () => void
}

export const TeamFavoriteButton = ({ isFavorite, onClick }: TeamProps) => {
  return (
    <motion.button
      className="absolute top-2 left-2 cursor-pointer"
      onClick={onClick}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
      whileTap={{ scale: 0.9 }}
    >
      <motion.span
        key={isFavorite ? 'favorite' : 'default'}
        className="flex"
        initial={{ scale: 0.7, rotate: -18, opacity: 0.6 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <Star
          size="sm"
          pack={isFavorite ? 'filled' : 'basic'}
          className={isFavorite ? 'text-yellow-400' : 'text-muted'}
        />
      </motion.span>
    </motion.button>
  )
}
