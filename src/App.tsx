import React, { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CalculationsPage from "./pages/CalculationsPage";
import SupportPage from "./pages/SupportPage";
import FeedbackPage from "./pages/FeedbackPage";
import DeveloperPage from "./pages/DeveloperPage";
import MainLayout from "./components/MainLayout";

const queryClient = new QueryClient();

const App = () => {
  const [settingsHandler, setSettingsHandler] = useState<(() => void) | undefined>();

  const handleSetSettingsHandler = React.useCallback((handler: () => void) => {
    setSettingsHandler(() => handler);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <MainLayout onSettingsClick={settingsHandler}>
            <Routes>
              <Route path="/" element={<Index onSettingsClick={handleSetSettingsHandler} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/calculations" element={<CalculationsPage />} />
              <Route path="/faq" element={<SupportPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/developer" element={<DeveloperPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
