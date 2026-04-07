import { Box, Container } from "@radix-ui/themes";

import BottomNav from "@components/layout/BottomNav";

import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Box className="min-h-screen bg-canvas pb-20">
      <Container size="1" px="4">
        <Box className="max-w-lg mx-auto px-4 py-6">{children}</Box>
      </Container>
      <BottomNav />
    </Box>
  );
}
