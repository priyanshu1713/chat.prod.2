import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import Preloader from "./components/Preloader";
import Index from "./pages/Index";
import Bizzy from "./pages/Bizzy";
import Artie from "./pages/Artie";
import Mak from "./pages/Mak";
import Vira from "./pages/Vira";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import RequireAuth from "@/components/RequireAuth";

const queryClient = new QueryClient();

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="productica-ui-theme">
        <TooltipProvider>
          <AuthProvider>
            <ChatProvider>
              <Toaster />
              <Sonner />
              {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
              <BrowserRouter>
                <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
                <Route path="/bizzy" element={<RequireAuth><Bizzy /></RequireAuth>} />
                <Route path="/artie" element={<RequireAuth><Artie /></RequireAuth>} />
                <Route path="/mak" element={<RequireAuth><Mak /></RequireAuth>} />
                <Route path="/vira" element={<RequireAuth><Vira /></RequireAuth>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ChatProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
