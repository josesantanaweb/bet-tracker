import { Box, Container } from "@radix-ui/themes";

import { BottomNav, Header } from "@components/layout";

import type { ReactNode } from "react";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box className="min-h-screen bg-canvas pb-20">
      <Header />
      <Container size="1" px="4">
        <Box className="max-w-lg mx-auto py-6">{children}</Box>
      </Container>
      <BottomNav />
    </Box>
  );
}
