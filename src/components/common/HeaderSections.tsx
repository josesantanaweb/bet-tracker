import { Plus } from '@boxicons/react'

import { Button } from '@/components/ui'

interface HeaderSectionsProps {
  title: string;
  description?: string;
  onAdd?: () => void;
}

export const HeaderSections = ({ title, description, onAdd }: HeaderSectionsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-ink">
          {title}
        </h3>
        <p className="text-sm text-ink">{description}</p>
      </div>
      <Button onClick={onAdd}>
        <Plus size="sm" />
        Agregar
      </Button>
    </div>
  )
}
