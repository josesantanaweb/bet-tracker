import { Plus } from '@boxicons/react'
import { Text, Heading } from '@radix-ui/themes/dist/cjs/components/index.js'

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
        <Heading as="h3" size="5">
          {title}
        </Heading>
        <Text size="1">{description}</Text>
      </div>
      <Button onClick={onAdd}>
        <Plus size="sm" />
        Agregar
      </Button>
    </div>
  )
}

HeaderSections.displayName = 'HeaderSections'
