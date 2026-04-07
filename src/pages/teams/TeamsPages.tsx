import { Plus } from '@boxicons/react'
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
    </Box>
  )
}
