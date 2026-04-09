import { BottomNav, Header } from '@components/layout'

import type { ReactNode } from 'react'

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-canvas min-h-screen pb-20">
      <Header />
      <div className="mx-auto max-w-lg px-6 py-6">{children}</div>
      <BottomNav />
    </div>
  )
}
