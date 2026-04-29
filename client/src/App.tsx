import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { TabNavigation } from "@/components/TabNavigation";
import { PWAInstallPrompt, PWAStatusBadge } from "@/components/PWAInstallPrompt";
import { usePWA } from "@/hooks/usePWA";
import { Suspense, lazy, useEffect, Component, ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
          <div style={{ fontSize: "3rem" }}>⚧️</div>
          <h2 style={{ marginTop: "1rem" }}>Something went wrong</h2>
          <p style={{ color: "#666" }}>Please refresh the page or visit trisex.org for help.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: "1rem", padding: "0.5rem 1.5rem", cursor: "pointer" }}
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-pulse text-2xl">⚧️</div>
  </div>
);

const Home = lazy(() => import("@/pages/home"));
const Products = lazy(() => import("@/pages/products"));
const Education = lazy(() => import("@/pages/education"));
const Clinics = lazy(() => import("@/pages/clinics"));
const ClinicDashboard = lazy(() => import("@/pages/clinic-dashboard"));
const Partnership = lazy(() => import("@/pages/partnership"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const NotFound = lazy(() => import("@/pages/not-found"));
const BadGoodSex = lazy(() => import("@/pages/bad-good-sex"));
const BadGoodHealth = lazy(() => import("@/pages/bad-good-health"));
const GoodPeople = lazy(() => import("@/pages/good-people"));
const AnatomyScanning = lazy(() => import("@/pages/anatomy-scanning"));
const FourDSTIIntervention = lazy(() => import("@/pages/4d-sti-intervention"));
const DomainPurchase = lazy(() => import("@/pages/domain-purchase"));
const SocialIntegration = lazy(() => import("@/pages/social-integration"));
const MetaPlatforms = lazy(() => import("@/pages/meta-platforms"));
const EconomicImpact = lazy(() => import("@/pages/economic-impact"));
const Wiki = lazy(() => import("@/pages/wiki"));
const InclusiveOrdering = lazy(() => import("@/pages/inclusive-ordering"));
const ForkTheFramework = lazy(() => import("@/pages/fork-the-framework"));
const InclusiveOrderingRegistry = lazy(() => import("@/pages/inclusive-ordering-registry"));
const PeerMentor = lazy(() => import("@/pages/peer-mentor"));
const Analytics = lazy(() => import("@/pages/analytics"));
const InteractiveStories = lazy(() => import("@/pages/interactive-stories"));
const Newsletter = lazy(() => import("@/pages/newsletter"));
const OpenBooks = lazy(() => import("@/pages/open-books"));
const MaterialsScience = lazy(() => import("@/pages/materials-science"));
const MoodLogging = lazy(() => import("@/pages/mood-logging"));
const TimeTracker = lazy(() => import("@/pages/time-tracker"));
const CalendarIntegration = lazy(() => import("@/pages/calendar-integration"));
const SmartBreakSystem = lazy(() => import("@/pages/smart-break-system"));
const MentorFacilitator = lazy(() => import("@/pages/mentor-facilitator"));
const PartnerSTITracking = lazy(() => import("@/pages/partner-sti-tracking"));
const AgeVerification = lazy(() => import("@/pages/age-verification"));
const ParentalConsentResponse = lazy(() => import("@/pages/parental-consent-response"));
const BadCoopDashboard = lazy(() => import("@/pages/bad-coop-dashboard"));
const InfinitelyAffirmativeProtection = lazy(() => import("@/pages/infinitely-affirmative-protection"));
const RemixReplit = lazy(() => import("@/pages/remix-replit"));
const OralBarriers = lazy(() => import("@/pages/oral-barriers"));
const MonogamyEconomics = lazy(() => import("@/pages/monogamy-economics"));
const SavedConfigurations = lazy(() => import("@/pages/saved-configs"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsOfService = lazy(() => import("@/pages/terms-of-service"));
const RecentTeamChanges = lazy(() => import("@/pages/recent-team-changes"));
const Accessibility = lazy(() => import("@/pages/accessibility"));
const CommunityForum = lazy(() => import("@/pages/community-forum"));
const TrisexStablecoin = lazy(() => import("@/pages/trisex-stablecoin"));
const FilingPreparation = lazy(() => import("@/pages/filing-preparation"));
const BoundariesBackgroundCheck = lazy(() => import("@/pages/boundaries-background-check"));
const MetaLensScan = lazy(() => import("@/pages/meta-lens-scan"));
const HerbalKnowledge = lazy(() => import("@/pages/herbal-knowledge"));
const LetsFramework = lazy(() => import("@/pages/lets-framework"));
const TriSexPort = lazy(() => import("@/pages/trisexport"));
const Contact = lazy(() => import("@/pages/contact"));

function PWAWrapper({ children }: { children: React.ReactNode }) {
  const { registerServiceWorker } = usePWA();

  useEffect(() => {
    registerServiceWorker();
  }, [registerServiceWorker]);

  return (
    <>
      {children}
    </>
  );
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/fork-the-framework" component={ForkTheFramework} />
            <Route path="/inclusive-ordering-registry" component={InclusiveOrderingRegistry} />
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
            <Route path="/remix-replit" component={RemixReplit} />
            <Route path="/oral-barriers" component={OralBarriers} />
            <Route path="/monogamy-economics" component={MonogamyEconomics} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />
            <Route path="/recent-team-changes" component={RecentTeamChanges} />
            <Route path="/accessibility" component={Accessibility} />
            <Route path="/community-forum" component={CommunityForum} />
            <Route path="/trisex-stablecoin" component={TrisexStablecoin} />
            <Route path="/filing-preparation" component={FilingPreparation} />
            <Route path="/boundaries-background-check" component={BoundariesBackgroundCheck} />
            <Route path="/meta-lens-scan" component={MetaLensScan} />
            <Route path="/herbal-knowledge" component={HerbalKnowledge} />
            <Route path="/lets-framework" component={LetsFramework} />
            <Route path="/trisexport" component={TriSexPort} />
            <Route path="/saved-configurations" component={SavedConfigurations} />
            <Route path="/contact" component={Contact} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <PWAWrapper>
              <Toaster />
              <Router />
            </PWAWrapper>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
