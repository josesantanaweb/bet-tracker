import { Plus } from '@boxicons/react'

import { Button } from '@/components/ui'

interface HeaderSectionsProps {
  title: string
  description?: string
  onAdd?: () => void
}

export const HeaderSections = ({ title, description, onAdd }: HeaderSectionsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-ink text-lg font-semibold">{title}</h3>
        <p className="text-ink text-sm">{description}</p>
      </div>
      <Button onClick={onAdd}>
        <Plus size="sm" />
        Agregar
      </Button>
    </div>
  )
}
