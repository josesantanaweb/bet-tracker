import { DotsVerticalRounded, Pencil, Trash } from '@boxicons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

interface Props {
  onEdit: () => void
  onDelete: () => void
}

export const DropdownActions = ({ onEdit, onDelete }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted hover:bg-secondary cursor-pointer rounded-full p-1 transition-colors"
      >
        <DotsVerticalRounded className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown-actions-menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="bg-secondary-dark ring-opacity-5 absolute top-8 right-2 z-60 w-32 origin-top-right rounded-md focus:outline-none shadow-xl border border-gray-900 overflow-hidden"
          >
            <div>
              <button
                onClick={() => {
                  onEdit()
                  setIsOpen(false)
                }}
                className="text-foreground hover:bg-secondary flex w-full cursor-pointer items-center px-3 py-2 text-xs transition-colors"
              >
                <Pencil className="mr-2 h-3 w-3" />
                Editar
              </button>
              <button
                onClick={() => {
                  onDelete()
                  setIsOpen(false)
                }}
                className="hover:bg-secondary flex w-full cursor-pointer items-center px-3 py-2 text-xs text-red-500 transition-colors"
              >
                <Trash className="mr-2 h-3 w-3" />
                Eliminar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
