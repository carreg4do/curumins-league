import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { AuthDebug } from "./components/AuthDebug";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Ranking from "./pages/Ranking";
import Matchmaking from "./pages/Matchmaking";
import MatchmakingInfo from "./pages/MatchmakingInfo";
import Dashboard from "./pages/Dashboard";
import Tournaments from "./pages/Tournaments";
import TournamentDetails from "./pages/TournamentDetails";
import Teams from "./pages/Teams";
import TeamProfile from "./pages/TeamProfile";
import CreateTeam from "./pages/CreateTeam";
import Profile from "./pages/Profile";
import SteamCallback from "./pages/SteamCallback";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthTest from "./pages/AuthTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <AuthDebug />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/matchmaking" element={<ProtectedRoute><Matchmaking /></ProtectedRoute>} />
            <Route path="/matchmaking-info" element={<MatchmakingInfo />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:id" element={<TournamentDetails />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/create" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
            <Route path="/criar-time" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
            <Route path="/teams/:id" element={<TeamProfile />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/editar-perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/auth/steam/callback" element={<SteamCallback />} />
            <Route path="/esqueci-senha" element={<ForgotPassword />} />
            <Route path="/nova-senha" element={<ResetPassword />} />
            <Route path="/auth-test" element={<AuthTest />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
