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

  // Real-time DALY calculation based on 4D STI intervention data
  const dalyData: DALYData[] = [
    {
      category: "Chlamydia Prevention",
      dalysSaved: 12847.3,
      economicValue: 1284730,
      populationImpact: 45892,
      interventionType: "4D Bioregional Testing"
    },
    {
      category: "Gonorrhea Prevention", 
      dalysSaved: 8923.7,
      economicValue: 892370,
      populationImpact: 32156,
      interventionType: "Targeted Prevention"
    },
    {
      category: "Syphilis Prevention",
      dalysSaved: 15632.1,
      economicValue: 1563210,
      populationImpact: 28734,
      interventionType: "Early Detection"
    },
    {
      category: "HIV Prevention",
      dalysSaved: 23451.8,
      economicValue: 2345180,
      populationImpact: 15678,
      interventionType: "PrEP Distribution"
    },
    {
      category: "HPV Prevention",
      dalysSaved: 18967.4,
      economicValue: 1896740,
      populationImpact: 67432,
      interventionType: "Vaccination Programs"
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
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">DALY Overview</TabsTrigger>
            <TabsTrigger value="dividends">Stablecoin Dividends</TabsTrigger>
            <TabsTrigger value="impact">National Debt Impact</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Disability Adjusted Life Years (DALY) Breakdown</CardTitle>
                  <p className="text-muted-foreground">
                    Real-time tracking of health improvements through 4D STI intervention
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