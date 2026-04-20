import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@components/layout'
import { BetsPage } from '@pages/bets/BetsPages'
import { DashboardPage } from '@pages/dashboard/DashboardPage'
import { MatchesPage } from '@pages/matches/MatchesPages'
import { TeamsPage } from '@pages/teams/TeamsPages'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/bets" element={<BetsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </QueryClientProvider>
)

export default App
