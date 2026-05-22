import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth/useAuth";
import { RequireAuth } from "@/lib/auth/RequireAuth";
import AppShell from "@/components/app-shell/AppShell";
import NotFound from "./pages/NotFound.tsx";
import SignIn from "./pages/auth/SignIn.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import Dashboard from "./pages/app/Dashboard.tsx";
import LibraryPage from "./pages/app/Library.tsx";
import HistoryPage from "./pages/app/History.tsx";
import TemplatesPage from "./pages/app/Templates.tsx";
import BrandPage from "./pages/app/Brand.tsx";
import SettingsPage from "./pages/app/Settings.tsx";
import InputScreen from "./pages/prototype/InputScreen.tsx";
import GeneratingScreen from "./pages/prototype/GeneratingScreen.tsx";
import EditorScreen from "./pages/prototype/EditorScreen.tsx";
import Landing from "./pages/marketing/Landing.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            <Route
              path="/app"
              element={
                <RequireAuth>
                  <AppShell />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="new" element={<InputScreen />} />
              <Route path="generating" element={<GeneratingScreen />} />
              <Route path="editor/:id" element={<EditorScreen />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="templates" element={<TemplatesPage />} />
              <Route path="brand" element={<BrandPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
