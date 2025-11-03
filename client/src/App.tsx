import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// Pages
import Home from "@/pages/home";
import Products from "@/pages/products";
import Education from "@/pages/education";
import Clinics from "@/pages/clinics";
import ClinicDashboard from "@/pages/clinic-dashboard";
import Partnership from "@/pages/partnership";
import Login from "./pages/login";
import Register from "./pages/register";
import NotFound from "@/pages/not-found";
import BadGoodSex from "@/pages/bad-good-sex";
import BadGoodHealth from "@/pages/bad-good-health";
import GoodPeople from "@/pages/good-people";
import AnatomyScanning from "@/pages/anatomy-scanning";
import FourDSTIIntervention from "@/pages/4d-sti-intervention";
import DomainPurchase from "@/pages/domain-purchase";
import SocialIntegration from "@/pages/social-integration";
import MetaPlatforms from "@/pages/meta-platforms";
import EconomicImpact from "@/pages/economic-impact";
import Wiki from "@/pages/wiki";
import InclusiveOrdering from "@/pages/inclusive-ordering";
import PeerMentor from "@/pages/peer-mentor";
import Analytics from "@/pages/analytics";
import InteractiveStories from "@/pages/interactive-stories";
import Newsletter from "@/pages/newsletter";
import OpenBooks from "@/pages/open-books";
import MaterialsScience from "@/pages/materials-science";
import MoodLogging from "@/pages/mood-logging";
import TimeTracker from "@/pages/time-tracker";
import CalendarIntegration from "@/pages/calendar-integration";
import SmartBreakSystem from "@/pages/smart-break-system";
import MentorFacilitator from "@/pages/mentor-facilitator";
import PartnerSTITracking from "@/pages/partner-sti-tracking";
import AgeVerification from "@/pages/age-verification";
import ParentalConsentResponse from "@/pages/parental-consent-response";
import BadCoopDashboard from "@/pages/bad-coop-dashboard";
import InfinitelyAffirmativeProtection from "@/pages/infinitely-affirmative-protection";
import { TabNavigation } from "@/components/TabNavigation";
import { PWAInstallPrompt, PWAStatusBadge } from "@/components/PWAInstallPrompt";
import { usePWA } from "@/hooks/usePWA";
import { useEffect } from "react";

function PWAWrapper({ children }: { children: React.ReactNode }) {
  const { registerServiceWorker } = usePWA();

  useEffect(() => {
    registerServiceWorker();
  }, [registerServiceWorker]);

  return (
    <>
      {children}
      <PWAInstallPrompt />
      <PWAStatusBadge />
    </>
  );
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/education" component={Education} />
          <Route path="/clinics" component={Clinics} />
          <Route path="/clinic-dashboard" component={ClinicDashboard} />
          <Route path="/partnership" component={Partnership} />
          <Route path="/bad-good-sex" component={BadGoodSex} />
          <Route path="/bad-good-health" component={BadGoodHealth} />
          <Route path="/good-people" component={GoodPeople} />
          <Route path="/anatomy-scanning" component={AnatomyScanning} />
          <Route path="/4d-sti-intervention" component={FourDSTIIntervention} />
          <Route path="/domain-purchase" component={DomainPurchase} />
          <Route path="/social-integration" component={SocialIntegration} />
          <Route path="/meta-platforms" component={MetaPlatforms} />
          <Route path="/economic-impact" component={EconomicImpact} />
          <Route path="/wiki" component={Wiki} />
          <Route path="/inclusive-ordering" component={InclusiveOrdering} />
          <Route path="/peer-mentor" component={PeerMentor} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/interactive-stories" component={InteractiveStories} />
          <Route path="/newsletter" component={Newsletter} />
          <Route path="/open-books" component={OpenBooks} />
          <Route path="/materials-science" component={MaterialsScience} />
          <Route path="/mood-logging" component={MoodLogging} />
          <Route path="/time-tracker" component={TimeTracker} />
          <Route path="/calendar-integration" component={CalendarIntegration} />
          <Route path="/smart-break-system" component={SmartBreakSystem} />
          <Route path="/mentor-facilitator" component={MentorFacilitator} />
          <Route path="/partner-sti-tracking" component={PartnerSTITracking} />
          <Route path="/age-verification" component={AgeVerification} />
          <Route path="/parental-consent/:consentId" component={ParentalConsentResponse} />
          <Route path="/bad-coop-dashboard" component={BadCoopDashboard} />
          <Route path="/infinitely-affirmative-protection" component={InfinitelyAffirmativeProtection} />
          <Route path="/clinic-dashboard" component={ClinicDashboard} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <PWAWrapper>
            <Toaster />
            <TabNavigation>
              <Router />
            </TabNavigation>
          </PWAWrapper>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
