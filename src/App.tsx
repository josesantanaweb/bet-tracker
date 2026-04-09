import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppLayout } from "@components/layout";
import DashboardPage from "@pages/dashboard/DashboardPage";
import TeamsPage from "@pages/teams/TeamsPages";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
     <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/teams" element={<TeamsPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;
