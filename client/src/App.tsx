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
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";

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
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
