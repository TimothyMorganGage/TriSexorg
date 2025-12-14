import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  ShoppingCart, 
  Lock, 
  Clock, 
  CheckCircle,
  ExternalLink,
  Zap,
  Star,
  CreditCard,
  Heart
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DomainPurchase() {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [email, setEmail] = useState("");

  const domainOptions = [
    {
      domain: "trisex.wtf",
      price: "$12.99/year",
      status: "available",
      description: "Primary brand domain - perfect for the platform"
    },
    {
      domain: "trisex.coop",
      price: "$29.99/year", 
      status: "available",
      description: "Cooperative domain - aligns with BAD Co-op principles"
    },
    {
      domain: "trisex.health",
      price: "$59.99/year",
      status: "available", 
      description: "Health-focused domain for medical partnerships"
    },
    {
      domain: "trisex.lgbt",
      price: "$49.99/year",
      status: "available",
      description: "Community-focused domain for 2SLGBTIQ+ initiatives"
    }
  ];

  const registrars = [
    {
      name: "Namecheap",
      price: "$12.99",
      features: ["Free WhoisGuard", "Free Email", "DNS Management"],
      url: "https://www.namecheap.com",
      recommended: true
    },
    {
      name: "GoDaddy", 
      price: "$14.99",
      features: ["Domain Privacy", "Email Forwarding", "24/7 Support"],
      url: "https://www.godaddy.com",
      recommended: false
    },
    {
      name: "Cloudflare",
      price: "$10.15",
      features: ["At-cost pricing", "Free SSL", "Advanced DNS"],
      url: "https://www.cloudflare.com/products/registrar",
      recommended: true
    },
    {
      name: "Porkbun",
      price: "$11.38",
      features: ["Free WhoisGuard", "Free SSL", "Competitive pricing"],
      url: "https://porkbun.com",
      recommended: false
    }
  ];

  const hostingPlans = [
    {
      name: "Replit Deployments",
      price: "Free - $20/month",
      features: [
        "Instant deployment from this project",
        "Custom domain support", 
        "Automatic HTTPS/SSL",
        "Global CDN",
        "Built-in analytics"
      ],
      recommended: true,
      current: true
    },
    {
      name: "Vercel",
      price: "Free - $20/month",
      features: [
        "Edge network deployment",
        "Automatic scaling",
        "Preview deployments",
        "Analytics dashboard"
      ],
      recommended: true,
      current: false
    },
    {
      name: "Netlify",
      price: "Free - $19/month", 
      features: [
        "Continuous deployment",
        "Form handling",
        "Edge functions",
        "A/B testing"
      ],
      recommended: false,
      current: false
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Domain infrastructure centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all domains serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Globe className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Register <span className="text-primary">trisex.wtf</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Secure your domain and launch the platform
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="domains" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="domains">Domain Options</TabsTrigger>
            <TabsTrigger value="registrars">Domain Registrars</TabsTrigger>
            <TabsTrigger value="hosting">Hosting & Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="domains">
            <div className="grid md:grid-cols-2 gap-6">
              {domainOptions.map((domain) => (
                <Card key={domain.domain} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        {domain.domain}
                      </span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {domain.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {domain.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">
                        {domain.price}
                      </span>
                      <Button 
                        size="sm"
                        className={domain.domain === "trisex.wtf" ? "bg-primary" : ""}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Lock className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Domain Protection Recommendations</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Enable WhoisGuard/Domain Privacy to protect personal information</li>
                  <li>• Set up auto-renewal to prevent accidental expiration</li>
                  <li>• Consider purchasing multiple extensions (.wtf, .coop, .health) for brand protection</li>
                  <li>• Use strong, unique passwords for domain registrar accounts</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrars">
            <div className="grid md:grid-cols-2 gap-6">
              {registrars.map((registrar) => (
                <Card 
                  key={registrar.name} 
                  className={`${registrar.recommended ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : ''}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{registrar.name}</span>
                      {registrar.recommended && (
                        <Badge className="bg-green-100 text-green-800">
                          <Star className="w-3 h-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-primary">
                        {registrar.price}/year
                      </div>
                      
                      <ul className="space-y-2">
                        {registrar.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button 
                        className="w-full" 
                        onClick={() => window.open(registrar.url, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Register at {registrar.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Quick Registration Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                      1
                    </div>
                    <h4 className="font-medium mb-2">Choose Registrar</h4>
                    <p className="text-xs text-muted-foreground">Select from recommended options above</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                      2
                    </div>
                    <h4 className="font-medium mb-2">Search Domain</h4>
                    <p className="text-xs text-muted-foreground">Search for "trisex.wtf" on their site</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                      3
                    </div>
                    <h4 className="font-medium mb-2">Add to Cart</h4>
                    <p className="text-xs text-muted-foreground">Add domain and privacy protection</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                      4
                    </div>
                    <h4 className="font-medium mb-2">Complete Purchase</h4>
                    <p className="text-xs text-muted-foreground">Pay and set up DNS settings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hosting">
            <div className="space-y-6">
              {hostingPlans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={`${plan.recommended ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : ''} ${plan.current ? 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{plan.name}</span>
                      <div className="flex space-x-2">
                        {plan.current && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Current Platform
                          </Badge>
                        )}
                        {plan.recommended && (
                          <Badge className="bg-green-100 text-green-800">
                            <Star className="w-3 h-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-2xl font-bold text-primary mb-4">
                          {plan.price}
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        {plan.current ? (
                          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Zap className="h-5 w-5 text-blue-600" />
                              <h4 className="font-medium">Ready to Deploy</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Your TriSex.org platform is already running on Replit. 
                              Just add your custom domain after registration.
                            </p>
                            <Button size="sm" className="w-full">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Deploy to Production
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" className="w-full">
                            Learn More
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Domain Connection Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">1. After Domain Registration</h4>
                    <p className="text-muted-foreground">
                      Log into your domain registrar's control panel and find the DNS management section.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">2. Configure DNS Records</h4>
                    <p className="text-muted-foreground">
                      Add CNAME records pointing to your hosting provider. For Replit, this will be provided in the deployment settings.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">3. Enable SSL/HTTPS</h4>
                    <p className="text-muted-foreground">
                      Most modern hosts provide automatic SSL certificates. Ensure HTTPS is enabled for security.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">4. Test and Go Live</h4>
                    <p className="text-muted-foreground">
                      Wait for DNS propagation (up to 48 hours) and test your site at the new domain.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Action Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Launch trisex.wtf?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Your comprehensive sexual health platform is ready for deployment. 
                Register your domain and connect it to start serving the 2SLGBTIQ+ community 
                with custom-fit protection and 4D STI intervention.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('https://www.namecheap.com/domains/registration/results/?domain=trisex.wtf', '_blank')}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Register trisex.wtf Now
                </Button>
                <Button variant="outline" size="lg">
                  <CreditCard className="mr-2 h-5 w-5" />
                  View Pricing Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}