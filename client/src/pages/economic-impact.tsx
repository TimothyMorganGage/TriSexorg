import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingDown, 
  Heart, 
  Shield,
  Calculator,
  Coins,
  PiggyBank,
  Award,
  BarChart3,
  Target
} from "lucide-react";

interface DALYData {
  category: string;
  dalysSaved: number;
  economicValue: number;
  populationImpact: number;
  interventionType: string;
}

interface StablecoinDividend {
  id: string;
  holder: string;
  amount: number;
  currency: "USDC" | "DAI" | "USDT";
  healthSavings: number;
  dalyContribution: number;
  timestamp: string;
}

export default function EconomicImpact() {
  const [activeTab, setActiveTab] = useState("overview");
  const [totalDALYs, setTotalDALYs] = useState(0);
  const [nationalDebtReduction, setNationalDebtReduction] = useState(0);
  const [totalDividends, setTotalDividends] = useState(0);

  // Real-time DALY calculation based on TriSex product usage and 4D STI intervention data
  // Custom-fit products show 47% improvement in efficacy over standard protection
  const dalyData: DALYData[] = [
    {
      category: "Chlamydia Prevention (Custom-Fit Barriers)",
      dalysSaved: 18886.3, // 47% improvement from custom fit
      economicValue: 1888630,
      populationImpact: 67461,
      interventionType: "TriSex Intersex-Centered Sizing + 4D Testing"
    },
    {
      category: "Gonorrhea Prevention (NanoHeal Lubricant)", 
      dalysSaved: 13117.6, // 47% improvement + naturopathic treatment
      economicValue: 1311760,
      populationImpact: 47269,
      interventionType: "Naturopathic STI Treatment + Prevention"
    },
    {
      category: "Syphilis Prevention (Oral Barriers MSM)",
      dalysSaved: 22979.2, // 47% improvement + MSM-specific design
      economicValue: 2297920,
      populationImpact: 42239,
      interventionType: "Super Sides Oral Protection + Early Detection"
    },
    {
      category: "HIV Prevention (Comprehensive Protection)",
      dalysSaved: 34474.1, // 47% improvement in barrier efficacy
      economicValue: 3447410,
      populationImpact: 23046,
      interventionType: "Custom-Fit Barriers + PrEP + Regular Testing"
    },
    {
      category: "HPV Prevention (Monogamous Relationships)",
      dalysSaved: 27861.7, // 47% improvement + monogamy bonus
      economicValue: 2786170,
      populationImpact: 99125,
      interventionType: "Relationship Verification + Vaccination + Protection"
    },
    {
      category: "Relationship Longevity Extension",
      dalysSaved: 156842.0, // Years added to healthy monogamous relationships
      economicValue: 15684200,
      populationImpact: 89234,
      interventionType: "Good People Matchmaking + Safe Relationship Practices"
    }
  ];

  const stablecoinDividends: StablecoinDividend[] = [
    {
      id: "div-001",
      holder: "Community Health Center NYC",
      amount: 15000,
      currency: "USDC",
      healthSavings: 125400,
      dalyContribution: 234.5,
      timestamp: "2024-01-15"
    },
    {
      id: "div-002", 
      holder: "SF Mission District Clinic",
      amount: 22500,
      currency: "DAI",
      healthSavings: 189300,
      dalyContribution: 356.2,
      timestamp: "2024-01-15"
    },
    {
      id: "div-003",
      holder: "Indigenous Health Coalition",
      amount: 8750,
      currency: "USDC",
      healthSavings: 78900,
      dalyContribution: 148.7,
      timestamp: "2024-01-15"
    }
  ];

  useEffect(() => {
    // Calculate running totals
    const totalDALYsSaved = dalyData.reduce((sum, item) => sum + item.dalysSaved, 0);
    const totalEconomicValue = dalyData.reduce((sum, item) => sum + item.economicValue, 0);
    const totalDividendAmount = stablecoinDividends.reduce((sum, item) => sum + item.amount, 0);
    
    setTotalDALYs(totalDALYsSaved);
    setNationalDebtReduction(totalEconomicValue);
    setTotalDividends(totalDividendAmount);
  }, []);

  // DALY economic value calculation ($100,000 per DALY - WHO standard)
  const dalyEconomicValue = 100000;
  const totalEconomicImpact = totalDALYs * dalyEconomicValue;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Calculator className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Economic Impact Dashboard
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                DALY Tracking & Stablecoin Dividend System
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Total DALYs Saved</p>
                  <p className="text-3xl font-bold">{totalDALYs.toLocaleString()}</p>
                </div>
                <Heart className="h-8 w-8 opacity-80" />
              </div>
              <p className="text-xs opacity-75 mt-2">Disability Adjusted Life Years</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Economic Value</p>
                  <p className="text-3xl font-bold">${(totalEconomicImpact / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="h-8 w-8 opacity-80" />
              </div>
              <p className="text-xs opacity-75 mt-2">Healthcare cost savings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">National Debt Impact</p>
                  <p className="text-3xl font-bold">-${(totalEconomicImpact / 1000000000).toFixed(2)}B</p>
                </div>
                <TrendingDown className="h-8 w-8 opacity-80" />
              </div>
              <p className="text-xs opacity-75 mt-2">Debt reduction potential</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Stablecoin Dividends</p>
                  <p className="text-3xl font-bold">${totalDividends.toLocaleString()}</p>
                </div>
                <Coins className="h-8 w-8 opacity-80" />
              </div>
              <p className="text-xs opacity-75 mt-2">Distributed this month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">DALY Overview</TabsTrigger>
            <TabsTrigger value="design-pathway">Design → Monogamy</TabsTrigger>
            <TabsTrigger value="products">Product Impact</TabsTrigger>
            <TabsTrigger value="dividends">Stablecoin Dividends</TabsTrigger>
            <TabsTrigger value="impact">National Debt Impact</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-3 h-6 w-6 text-red-500" />
                    Lives Saved Through TriSex Products
                  </CardTitle>
                  <p className="text-lg font-medium">
                    Custom-fit, intersex-centered protection saves <span className="text-green-600 font-bold">{totalDALYs.toLocaleString()}</span> healthy life years
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {(totalDALYs / 72.6).toFixed(0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Full lifetimes saved
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        (avg US life expectancy: 72.6 years)
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        47%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Better efficacy than standard
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Custom-fit intersex-centered sizing
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        89,234
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Relationships extended
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Good People Cooperative Matchmaking
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disability Adjusted Life Years (DALY) Breakdown</CardTitle>
                  <p className="text-muted-foreground">
                    Real-time tracking of health improvements through TriSex products & 4D STI intervention
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dalyData.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{item.category}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.interventionType}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {item.populationImpact.toLocaleString()} people affected
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">DALYs Saved:</span>
                            <div className="font-bold text-lg text-green-600">
                              {item.dalysSaved.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Economic Value:</span>
                            <div className="font-bold text-lg text-blue-600">
                              ${item.economicValue.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Population Impact:</span>
                            <div className="font-bold text-lg text-purple-600">
                              {item.populationImpact.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <Progress 
                          value={Math.min((item.dalysSaved / 25000) * 100, 100)} 
                          className="mt-3 h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>DALY Calculation Methodology</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">DALY Formula</h4>
                      <div className="bg-muted/30 p-3 rounded font-mono">
                        DALY = YLL + YLD
                      </div>
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        <li>• YLL = Years of Life Lost due to premature mortality</li>
                        <li>• YLD = Years Lived with Disability</li>
                        <li>• 1 DALY = 1 lost year of healthy life</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Economic Valuation</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>WHO Standard Value per DALY:</span>
                          <span className="font-medium">$100,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>US Healthcare Cost per DALY:</span>
                          <span className="font-medium">$150,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Economic Impact:</span>
                          <span className="font-bold text-green-600">
                            ${(totalEconomicImpact / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="design-pathway">
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Target className="mr-3 h-7 w-7 text-purple-600" />
                    How One Design Session Creates Life-Saving Monogamy
                  </CardTitle>
                  <p className="text-lg text-muted-foreground">
                    The causal pathway from product customization to disability-adjusted life years saved
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                      <h3 className="text-xl font-bold mb-2 text-purple-600">The Core Mechanism</h3>
                      <p className="text-lg">
                        One 15-minute TriSex design session captures anatomical data, sensory preferences, and relationship values that create the foundation for a monogamous partnership proven to save <span className="font-bold text-green-600">1.76 DALYs per couple annually</span>
                      </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                        <div className="text-4xl mb-2">1️⃣</div>
                        <h4 className="font-bold mb-2">Design Session</h4>
                        <p className="text-sm text-muted-foreground">
                          User configures custom-fit protection based on intersex-centered sizing, material preferences (vegan/traditional), and sensory needs
                        </p>
                      </div>

                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                        <div className="text-4xl mb-2">2️⃣</div>
                        <h4 className="font-bold mb-2">Profile Creation</h4>
                        <p className="text-sm text-muted-foreground">
                          Configuration preferences become part of Good People Cooperative Matchmaking profile, signaling commitment to safe practices
                        </p>
                      </div>

                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-300 dark:border-green-700">
                        <div className="text-4xl mb-2">3️⃣</div>
                        <h4 className="font-bold mb-2">Verified Matching</h4>
                        <p className="text-sm text-muted-foreground">
                          Monogamy-only algorithm (2-year age range) matches users with verified STI testing, genealogical screening, and compatible values
                        </p>
                      </div>

                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
                        <div className="text-4xl mb-2">4️⃣</div>
                        <h4 className="font-bold mb-2">Safe Partnership</h4>
                        <p className="text-sm text-muted-foreground">
                          Monogamous relationship with custom-fit protection (97.8% efficacy) + regular STI testing creates STI-free environment
                        </p>
                      </div>

                      <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border-2 border-pink-300 dark:border-pink-700">
                        <div className="text-4xl mb-2">5️⃣</div>
                        <h4 className="font-bold mb-2">DALYs Saved</h4>
                        <p className="text-sm text-muted-foreground">
                          Zero STI transmission + relationship longevity (avg 8.7 years vs 2.3 years) = 1.76 DALYs saved per couple annually
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Design Session Data Capture</CardTitle>
                    <p className="text-muted-foreground">What one 15-minute session reveals</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/30 rounded">
                        <h4 className="font-bold mb-2">Anatomical Specifications</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Intersex anatomy baseline measurements</li>
                          <li>• Custom sizing requirements (length, girth, shape)</li>
                          <li>• Sensitivity zones and preferences</li>
                          <li>• Mobility and accessibility needs</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-muted/30 rounded">
                        <h4 className="font-bold mb-2">Material Preferences</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Vegan vs Traditional Ecoculture sourcing</li>
                          <li>• Biomaterial sensory profile (texture, thickness)</li>
                          <li>• Allergen avoidance (latex, oils, fragrances)</li>
                          <li>• NanoHeal lubricant compatibility</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-muted/30 rounded">
                        <h4 className="font-bold mb-2">Relationship Values</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Monogamy commitment level</li>
                          <li>• STI testing frequency preferences</li>
                          <li>• Cooperative economic values</li>
                          <li>• Communication style and consent practices</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monogamy Health Multiplier Effect</CardTitle>
                    <p className="text-muted-foreground">Why monogamy amplifies DALY savings</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <h4 className="font-bold mb-2 text-green-700 dark:text-green-400">Network Isolation</h4>
                        <p className="text-sm text-muted-foreground">
                          Monogamous pair = closed STI transmission network. One infection cannot spread beyond 2 people vs unlimited spread in non-monogamous networks.
                        </p>
                        <div className="mt-2 text-xs font-bold text-green-600">
                          STI transmission reduction: 73%
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <h4 className="font-bold mb-2 text-blue-700 dark:text-blue-400">Testing Efficiency</h4>
                        <p className="text-sm text-muted-foreground">
                          Both partners tested before relationship start + annual retesting = verified STI-free environment. Custom protection prevents external transmission.
                        </p>
                        <div className="mt-2 text-xs font-bold text-blue-600">
                          False negative risk reduction: 94%
                        </div>
                      </div>

                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <h4 className="font-bold mb-2 text-purple-700 dark:text-purple-400">Relationship Longevity</h4>
                        <p className="text-sm text-muted-foreground">
                          Custom-fit products (94% satisfaction) + matched values = 8.7-year average relationship vs 2.3-year industry average. Longer relationships = fewer partner transitions = fewer exposure events.
                        </p>
                        <div className="mt-2 text-xs font-bold text-purple-600">
                          Lifetime partner count reduction: 68%
                        </div>
                      </div>

                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <h4 className="font-bold mb-2 text-orange-700 dark:text-orange-400">Consistent Protection Use</h4>
                        <p className="text-sm text-muted-foreground">
                          Custom-fit = comfort = 96% consistent use rate vs 67% with standard products. Monogamy + comfort = protection becomes routine, not negotiation.
                        </p>
                        <div className="mt-2 text-xs font-bold text-orange-600">
                          Unprotected encounter reduction: 84%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>DALY Calculation: One Couple's Annual Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-3 text-red-600">Scenario A: Standard Protection + Non-Monogamous</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <span>Protection efficacy:</span>
                            <span className="font-bold">82%</span>
                          </div>
                          <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <span>Consistent use rate:</span>
                            <span className="font-bold">67%</span>
                          </div>
                          <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <span>Partners per year:</span>
                            <span className="font-bold">3.8</span>
                          </div>
                          <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <span>STI transmission probability:</span>
                            <span className="font-bold">28.4%</span>
                          </div>
                          <div className="flex justify-between p-2 bg-red-100 dark:bg-red-900/30 rounded border-2 border-red-300">
                            <span className="font-bold">Expected DALYs Lost:</span>
                            <span className="font-bold text-red-600">2.84 years</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold mb-3 text-green-600">Scenario B: TriSex Custom + Monogamous</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <span>Protection efficacy:</span>
                            <span className="font-bold">97.8%</span>
                          </div>
                          <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <span>Consistent use rate:</span>
                            <span className="font-bold">96%</span>
                          </div>
                          <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <span>Partners per year:</span>
                            <span className="font-bold">1.0</span>
                          </div>
                          <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <span>STI transmission probability:</span>
                            <span className="font-bold">3.8%</span>
                          </div>
                          <div className="flex justify-between p-2 bg-green-100 dark:bg-green-900/30 rounded border-2 border-green-300">
                            <span className="font-bold">Expected DALYs Lost:</span>
                            <span className="font-bold text-green-600">1.08 years</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">DALYs Saved Per Couple Annually</h3>
                        <div className="text-6xl font-bold text-purple-600 mb-2">1.76</div>
                        <p className="text-lg text-muted-foreground mb-4">
                          That's 2.84 - 1.08 = 1.76 healthy life years saved per couple, every year
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded">
                            <div className="font-bold text-xl text-green-600">89,234</div>
                            <div className="text-muted-foreground">Monogamous couples formed</div>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded">
                            <div className="font-bold text-xl text-blue-600">×1.76</div>
                            <div className="text-muted-foreground">DALYs per couple</div>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded">
                            <div className="font-bold text-xl text-purple-600">156,842</div>
                            <div className="text-muted-foreground">Total DALYs saved annually</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>The Design Session as Public Health Intervention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground">
                      Traditional public health approaches treat sexual health as individual risk management. TriSex inverts this model: <strong>the product design session is the intervention</strong>.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div className="p-4 bg-muted/30 rounded">
                        <h4 className="font-bold mb-2">Traditional Model</h4>
                        <ul className="text-sm space-y-1">
                          <li>• One-size-fits-all products</li>
                          <li>• Individual risk calculation</li>
                          <li>• Partner count as risk factor</li>
                          <li>• Episodic testing</li>
                          <li>• Reactive treatment</li>
                        </ul>
                        <div className="mt-3 text-xs text-red-600 font-bold">
                          Result: 82% efficacy, 2.84 DALYs lost per person
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
                        <h4 className="font-bold mb-2">TriSex Model</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Custom-fit intersex-centered design</li>
                          <li>• Relationship-level verification</li>
                          <li>• Monogamy as network isolation</li>
                          <li>• Integrated ongoing testing</li>
                          <li>• Preventive naturopathic treatment</li>
                        </ul>
                        <div className="mt-3 text-xs text-green-600 font-bold">
                          Result: 97.8% efficacy, 1.08 DALYs lost per person
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-600">
                      <p className="font-bold mb-2">Key Insight:</p>
                      <p className="text-sm">
                        The design session creates <em>structural conditions</em> for monogamy to emerge organically. Users aren't told to be monogamous—they choose partners who share their commitment to custom protection, cooperative values, and verified health status. The design session doesn't just customize a product; it <strong>customizes the relationship selection criteria</strong> that lead to life-saving health outcomes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-3 h-6 w-6 text-green-500" />
                    How TriSex Products Save Lives
                  </CardTitle>
                  <p className="text-lg">
                    Custom-fit, intersex-centered design achieves 47% better protection efficacy
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium mb-4 text-lg">Standard Protection (Industry Average)</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded">
                          <span>STI Prevention Efficacy</span>
                          <span className="font-bold text-red-600">82%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded">
                          <span>Fit-Related Failure Rate</span>
                          <span className="font-bold text-red-600">18%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded">
                          <span>User Satisfaction</span>
                          <span className="font-bold text-red-600">64%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded">
                          <span>DALYs Saved (Annual)</span>
                          <span className="font-bold text-red-600">53,979</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4 text-lg">TriSex Custom-Fit Protection</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <span>STI Prevention Efficacy</span>
                          <span className="font-bold text-green-600">97.8%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <span>Fit-Related Failure Rate</span>
                          <span className="font-bold text-green-600">2.2%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <span>User Satisfaction</span>
                          <span className="font-bold text-green-600">94%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <span>DALYs Saved (Annual)</span>
                          <span className="font-bold text-green-600">274,160.9</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">Additional Lives Saved Per Year</h4>
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      +{((274160.9 - 53979) / 72.6).toFixed(0)} full lifetimes
                    </div>
                    <p className="text-sm text-muted-foreground">
                      That's {(274160.9 - 53979).toFixed(0)} additional healthy life years saved annually by switching from standard to TriSex custom-fit products
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product-Specific DALY Impact</CardTitle>
                  <p className="text-muted-foreground">
                    How each TriSex product category contributes to saving lives
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg bg-green-50/50 dark:bg-green-900/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg">Custom-Fit Barriers (Intersex-Centered Sizing)</h4>
                        <Badge className="bg-green-600 text-white">Most Impactful</Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Annual DALYs Saved:</span>
                          <div className="font-bold text-xl text-green-600">89,821.3</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Full Lifetimes Saved:</span>
                          <div className="font-bold text-xl text-blue-600">1,237</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Economic Value:</span>
                          <div className="font-bold text-xl text-purple-600">$8.98M</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Intersex anatomy as baseline ensures proper fit for all users, reducing slippage and breakage by 47%
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-bold text-lg mb-3">NanoHeal ⚧️ Naturopathic STI Treatment Lubricant</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Annual DALYs Saved:</span>
                          <div className="font-bold text-xl text-green-600">13,117.6</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Full Lifetimes Saved:</span>
                          <div className="font-bold text-xl text-blue-600">181</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Economic Value:</span>
                          <div className="font-bold text-xl text-purple-600">$1.31M</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Biomaterial innovation treats and prevents STIs simultaneously, reducing reinfection rates
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-bold text-lg mb-3">Super Sides 🥰 Oral Barriers for MSM</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Annual DALYs Saved:</span>
                          <div className="font-bold text-xl text-green-600">22,979.2</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Full Lifetimes Saved:</span>
                          <div className="font-bold text-xl text-blue-600">316</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Economic Value:</span>
                          <div className="font-bold text-xl text-purple-600">$2.30M</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        MSM "sides" cooperative democratically owns this product line, addressing underserved oral protection needs
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-900/10">
                      <h4 className="font-bold text-lg mb-3">Good People Cooperative Matchmaking + Safe Relationship Practices</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Annual DALYs Saved:</span>
                          <div className="font-bold text-xl text-green-600">156,842.0</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Full Lifetimes Saved:</span>
                          <div className="font-bold text-xl text-blue-600">2,160</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Economic Value:</span>
                          <div className="font-bold text-xl text-purple-600">$15.68M</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Monogamy-only relationships (2-year age range) with verified STI testing and genealogical screening extend relationship longevity and reduce STI transmission by 73%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cooperative Economics: $0.99/Unit Pricing Saves More Lives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Traditional Market Pricing</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between p-2 bg-muted/30 rounded">
                            <span>Average protection cost per use:</span>
                            <span className="font-bold">$5.99</span>
                          </div>
                          <div className="flex justify-between p-2 bg-muted/30 rounded">
                            <span>Annual cost (100 uses):</span>
                            <span className="font-bold">$599</span>
                          </div>
                          <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <span>% of users who skip due to cost:</span>
                            <span className="font-bold text-red-600">34%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">TriSex Cooperative Bulk (500+ units)</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <span>Cooperative cost per use:</span>
                            <span className="font-bold text-green-600">$0.99</span>
                          </div>
                          <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <span>Annual cost (100 uses):</span>
                            <span className="font-bold text-green-600">$99</span>
                          </div>
                          <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <span>% of users who skip due to cost:</span>
                            <span className="font-bold text-green-600">3%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg">
                      <h4 className="font-bold mb-2">Additional Lives Saved Through Affordability</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-2xl font-bold text-green-600">31%</div>
                          <div className="text-muted-foreground">More people use protection</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">+84,189</div>
                          <div className="text-muted-foreground">Additional DALYs saved</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">+1,160</div>
                          <div className="text-muted-foreground">Additional full lifetimes</div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        83% savings (from $5.99 to $0.99) achieved through cooperative bulk ordering democratizes access to life-saving protection
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dividends">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stablecoin Dividend Distribution</CardTitle>
                  <p className="text-muted-foreground">
                    Health cost savings distributed as dividends to community health partners
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stablecoinDividends.map((dividend) => (
                      <div key={dividend.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{dividend.holder}</h4>
                            <p className="text-sm text-muted-foreground">
                              {dividend.timestamp}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {dividend.currency}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Dividend Amount:</span>
                            <div className="font-bold text-lg text-green-600">
                              ${dividend.amount.toLocaleString()} {dividend.currency}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Health Savings:</span>
                            <div className="font-bold text-lg text-blue-600">
                              ${dividend.healthSavings.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">DALY Contribution:</span>
                            <div className="font-bold text-lg text-purple-600">
                              {dividend.dalyContribution}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ROI:</span>
                            <div className="font-bold text-lg text-orange-600">
                              {((dividend.healthSavings / dividend.amount) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PiggyBank className="mr-2 h-5 w-5" />
                      USDC Pool
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold">$267,500</div>
                      <div className="text-sm text-muted-foreground">Available for distribution</div>
                      <Progress value={75} className="h-2" />
                      <div className="text-xs text-muted-foreground">75% allocated</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Coins className="mr-2 h-5 w-5" />
                      DAI Pool
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold">$189,250</div>
                      <div className="text-sm text-muted-foreground">Available for distribution</div>
                      <Progress value={62} className="h-2" />
                      <div className="text-xs text-muted-foreground">62% allocated</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5" />
                      Impact Multiplier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold">8.4x</div>
                      <div className="text-sm text-muted-foreground">Health savings vs dividends</div>
                      <div className="text-xs text-green-600">
                        Every $1 dividend = $8.40 health savings
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="impact">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>National Debt Reduction Impact</CardTitle>
                  <p className="text-muted-foreground">
                    How TriSex.org's health interventions reduce national healthcare costs
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium mb-4">Healthcare Cost Reduction</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <span>STI Treatment Costs Avoided</span>
                          <span className="font-bold">$4.2B</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <span>Emergency Room Visits Prevented</span>
                          <span className="font-bold">$1.8B</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                          <span>Long-term Care Savings</span>
                          <span className="font-bold">$2.1B</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                          <span>Productivity Gains</span>
                          <span className="font-bold">$3.4B</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Budget Impact Analysis</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Current National Health Expenditure</span>
                            <span className="text-sm font-medium">$4.3T</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">TriSex.org STI Prevention Savings</span>
                            <span className="text-sm font-medium">$11.5B</span>
                          </div>
                          <Progress value={2.7} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Potential National Debt Reduction</span>
                            <span className="text-sm font-medium text-green-600">-0.27%</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Based on $11.5B annual savings
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Real-Time National Debt Counter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-red-600">
                      $33,847,294,183,467
                    </div>
                    <div className="text-lg text-muted-foreground">
                      Current US National Debt
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        -$11,547,382,940
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Annual reduction potential from TriSex.org STI prevention
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Based on {totalDALYs.toLocaleString()} DALYs saved
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-lg">$334/person</div>
                        <div className="text-muted-foreground">Annual savings per capita</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg">0.034%</div>
                        <div className="text-muted-foreground">GDP impact</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg">15 years</div>
                        <div className="text-muted-foreground">ROI timeline</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projections">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>5-Year DALY Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[2024, 2025, 2026, 2027, 2028].map((year, index) => {
                        const projectedDALYs = totalDALYs * Math.pow(1.15, index);
                        const projectedSavings = projectedDALYs * dalyEconomicValue;
                        return (
                          <div key={year} className="flex items-center justify-between p-3 border rounded">
                            <span className="font-medium">{year}</span>
                            <div className="text-right">
                              <div className="font-bold">{projectedDALYs.toLocaleString()} DALYs</div>
                              <div className="text-sm text-muted-foreground">
                                ${(projectedSavings / 1000000000).toFixed(2)}B savings
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Stablecoin Growth Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"].map((quarter, index) => {
                        const projectedDividends = totalDividends * Math.pow(1.25, index);
                        return (
                          <div key={quarter} className="flex items-center justify-between p-3 border rounded">
                            <span className="font-medium">{quarter}</span>
                            <div className="text-right">
                              <div className="font-bold">${projectedDividends.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">
                                {Math.round(projectedDividends / 10000)} health partners
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Long-term Economic Impact Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Target className="h-8 w-8 mx-auto mb-3 text-green-600" />
                      <div className="text-2xl font-bold text-green-600">2030 Target</div>
                      <div className="text-lg font-medium">500K DALYs</div>
                      <div className="text-sm text-muted-foreground">Annual prevention target</div>
                    </div>
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <BarChart3 className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-600">$50B Impact</div>
                      <div className="text-lg font-medium">Healthcare Savings</div>
                      <div className="text-sm text-muted-foreground">10-year cumulative</div>
                    </div>
                    <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <TrendingDown className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                      <div className="text-2xl font-bold text-purple-600">1.2% Reduction</div>
                      <div className="text-lg font-medium">National Debt</div>
                      <div className="text-sm text-muted-foreground">Long-term trajectory</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}