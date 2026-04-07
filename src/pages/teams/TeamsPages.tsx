import { Community, Plus } from '@boxicons/react'
import { Box, Text, Heading, Flex } from '@radix-ui/themes/dist/cjs/components/index.js'

import { Button } from '@/components/ui/Button'

export default function TeamsPage() {
  return (
    <Box className="animate-fade-in">
      <Flex justify="between" align="center">
        <Box>
          <Heading as="h3" size="5">
            Mis Equipos
          </Heading>
          <Text size="1">2 equipos registrados</Text>
        </Box>
        <Button>
          <Plus size="sm" />
          Agregar
        </Button>
      </Flex>

      <Flex className="border-secondary-dark border rounded-2xl my-20 h-40">
        <Flex justify="center" direction="column" align="center" className='text-secondary'>
          <Community size="lg" />
          <p className="text-muted-foreground text-sm">Agrega tu primer equipo favorito</p>
        </Flex>
      </Flex>
    </Box>
  )
}
