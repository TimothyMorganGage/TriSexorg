import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Heart, 
  Brain,
  DollarSign,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Award,
  Globe,
  Clock,
  Zap
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("health-equity");

  // Health Equity Data
  const healthEquityData = [
    { month: "Jan", white: 85, black: 72, hispanic: 69, asian: 88, indigenous: 65, overall: 75.8 },
    { month: "Feb", white: 86, black: 74, hispanic: 71, asian: 89, indigenous: 67, overall: 77.4 },
    { month: "Mar", white: 87, black: 76, hispanic: 73, asian: 90, indigenous: 69, overall: 79.0 },
    { month: "Apr", white: 88, black: 78, hispanic: 75, asian: 91, indigenous: 71, overall: 80.6 },
    { month: "May", white: 89, black: 80, hispanic: 77, asian: 92, indigenous: 73, overall: 82.2 },
    { month: "Jun", white: 90, black: 82, hispanic: 79, asian: 93, indigenous: 75, overall: 83.8 }
  ];

  // Peer Mentor Effectiveness
  const mentorEffectivenessData = [
    { generation: "Gen Z", satisfaction: 94, sessions: 1247, retention: 89 },
    { generation: "Millennial", satisfaction: 92, sessions: 2156, retention: 91 },
    { generation: "Gen X", satisfaction: 88, sessions: 1834, retention: 87 },
    { generation: "Boomer+", satisfaction: 85, sessions: 1098, retention: 82 }
  ];

  // Intelligence Framework Usage
  const intelligenceUsageData = [
    { type: "Infinite", value: 28, color: "#8B5CF6" },
    { type: "Multicultural", value: 32, color: "#06B6D4" },
    { type: "Multigenerational", value: 25, color: "#10B981" },
    { type: "Racial & Ethnic", value: 15, color: "#F59E0B" }
  ];

  // Time Banking Analytics
  const timeBankingData = [
    { week: "Week 1", contributed: 142, received: 98, balance: 44, dividend: 18.25 },
    { week: "Week 2", contributed: 167, received: 123, balance: 88, dividend: 29.15 },
    { week: "Week 3", contributed: 189, received: 145, balance: 132, dividend: 41.80 },
    { week: "Week 4", contributed: 205, received: 167, balance: 170, dividend: 52.90 }
  ];

  // DALY (Disability-Adjusted Life Years) Economic Impact
  const dalyData = [
    { category: "Sexual Health Education", dalysSaved: 2847, economicValue: 284700, costPerDaly: 100 },
    { category: "STI Prevention", dalysSaved: 1923, economicValue: 192300, costPerDaly: 100 },
    { category: "Reproductive Health", dalysSaved: 3156, economicValue: 315600, costPerDaly: 100 },
    { category: "Mental Health Support", dalysSaved: 2234, economicValue: 223400, costPerDaly: 100 },
    { category: "Peer Mentorship", dalysSaved: 1876, economicValue: 187600, costPerDaly: 100 }
  ];

  // Community Engagement Metrics
  const engagementData = [
    { platform: "Peer Network", users: 15847, engagement: 87, growth: 12 },
    { platform: "Educational Wiki", users: 23412, engagement: 72, growth: 18 },
    { platform: "Health Screening", users: 8934, engagement: 94, growth: 25 },
    { platform: "Product Customization", users: 6723, engagement: 89, growth: 15 }
  ];

  const totalDALYs = dalyData.reduce((sum, item) => sum + item.dalysSaved, 0);
  const totalEconomicImpact = dalyData.reduce((sum, item) => sum + item.economicValue, 0);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
          <Heart className="h-5 w-5 text-purple-600" />
          <AlertDescription className="ml-2">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Analytics center intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all data insights serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <BarChart3 className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground font-recoleta">
                Advanced Analytics & Reporting
              </h1>
              <p className="text-xl text-muted-foreground mt-2 font-coolvetica">
                Health Equity • Intelligence Frameworks • Economic Impact • Community Outcomes
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mb-8">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
                <SelectItem value="1y">1 year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Custom Filter
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalDALYs.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">DALYs Saved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-aquamarine mx-auto mb-2" />
                <p className="text-2xl font-bold">${(totalEconomicImpact / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Economic Impact</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold">54,916</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">83.8%</p>
                <p className="text-sm text-muted-foreground">Health Equity Score</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="health-equity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="health-equity">Health Equity</TabsTrigger>
            <TabsTrigger value="peer-mentors">Peer Mentors</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
            <TabsTrigger value="economic">Economic Impact</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="health-equity">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                    Health Equity Trends by Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={healthEquityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[60, 95]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="white" stroke="#8884d8" name="White" />
                      <Line type="monotone" dataKey="black" stroke="#82ca9d" name="Black" />
                      <Line type="monotone" dataKey="hispanic" stroke="#ffc658" name="Hispanic" />
                      <Line type="monotone" dataKey="asian" stroke="#ff7c7c" name="Asian" />
                      <Line type="monotone" dataKey="indigenous" stroke="#8dd1e1" name="Indigenous" />
                      <Line type="monotone" dataKey="overall" stroke="#d084d0" strokeWidth={3} name="Overall" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equity Gap Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Indigenous Communities</span>
                        <span className="text-red-600">-8.8%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Priority intervention needed</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Hispanic Communities</span>
                        <span className="text-orange-600">-4.8%</span>
                      </div>
                      <Progress value={79} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Targeted support programs</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Black Communities</span>
                        <span className="text-yellow-600">-1.8%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Continued mentorship focus</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Asian Communities</span>
                        <span className="text-green-600">+9.2%</span>
                      </div>
                      <Progress value={93} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Share best practices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Health Disparities by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <Activity className="h-12 w-12 text-primary mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Sexual Health Access</h4>
                      <p className="text-2xl font-bold text-primary">78%</p>
                      <p className="text-sm text-muted-foreground">Average across demographics</p>
                    </div>
                    <div className="text-center">
                      <Target className="h-12 w-12 text-aquamarine mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Reproductive Justice</h4>
                      <p className="text-2xl font-bold text-aquamarine">82%</p>
                      <p className="text-sm text-muted-foreground">Bodily autonomy support</p>
                    </div>
                    <div className="text-center">
                      <Heart className="h-12 w-12 text-secondary mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Mental Health Support</h4>
                      <p className="text-2xl font-bold text-secondary">71%</p>
                      <p className="text-sm text-muted-foreground">Culturally competent care</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="peer-mentors">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-6 w-6 text-primary" />
                    Mentor Effectiveness by Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mentorEffectivenessData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="generation" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="satisfaction" fill="#8884d8" name="Satisfaction %" />
                      <Bar dataKey="retention" fill="#82ca9d" name="Retention %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time Banking Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeBankingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="contributed" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="received" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Stablecoin Dividend Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-xl font-bold">708</p>
                      <p className="text-sm text-muted-foreground">Total Hours</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 text-aquamarine mx-auto mb-2" />
                      <p className="text-xl font-bold">$142.10</p>
                      <p className="text-sm text-muted-foreground">Avg Dividend</p>
                    </div>
                    <div className="text-center">
                      <Award className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <p className="text-xl font-bold">1.34x</p>
                      <p className="text-sm text-muted-foreground">Equity Multiplier</p>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-xl font-bold">18%</p>
                      <p className="text-sm text-muted-foreground">Weekly Growth</p>
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={timeBankingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="dividend" stroke="#06B6D4" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="intelligence">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-6 w-6 text-primary" />
                    Intelligence Framework Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={intelligenceUsageData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ type, value }) => `${type}: ${value}%`}
                      >
                        {intelligenceUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Intelligence Framework Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-5 w-5 text-purple-500" />
                          <span className="font-medium">Infinite Intelligence</span>
                        </div>
                        <Badge variant="secondary">92% Effectiveness</Badge>
                      </div>
                      <Progress value={92} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Collective wisdom access • Pattern recognition • Emergent solutions
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-5 w-5 text-cyan-500" />
                          <span className="font-medium">Multicultural Intelligence</span>
                        </div>
                        <Badge variant="secondary">89% Effectiveness</Badge>
                      </div>
                      <Progress value={89} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Cultural competency • Traditional healing • Religious integration
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Multigenerational Intelligence</span>
                        </div>
                        <Badge variant="secondary">86% Effectiveness</Badge>
                      </div>
                      <Progress value={86} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Elder wisdom • Youth innovation • Bridge-building • Knowledge transfer
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-5 w-5 text-amber-500" />
                          <span className="font-medium">Racial & Ethnic Intelligence</span>
                        </div>
                        <Badge variant="secondary">94% Effectiveness</Badge>
                      </div>
                      <Progress value={94} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Health equity • Structural racism awareness • Community advocacy
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Cross-Intelligence Collaboration Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">247</div>
                      <div className="text-sm">Infinite + Multicultural</div>
                      <div className="text-xs text-muted-foreground">Cross-domain solutions</div>
                    </div>
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-600">189</div>
                      <div className="text-sm">Multi + Multigenerational</div>
                      <div className="text-xs text-muted-foreground">Cultural bridge-building</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">312</div>
                      <div className="text-sm">Racial + Infinite</div>
                      <div className="text-xs text-muted-foreground">Equity innovation</div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-600">156</div>
                      <div className="text-sm">All Four Types</div>
                      <div className="text-xs text-muted-foreground">Comprehensive solutions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="economic">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-6 w-6 text-aquamarine" />
                    DALY Economic Impact Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dalyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="dalysSaved" fill="#06B6D4" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost-Effectiveness Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-aquamarine">${totalEconomicImpact.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Economic Value</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">${100}</p>
                      <p className="text-sm text-muted-foreground">Cost per DALY Saved</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-3xl font-bold text-secondary">{totalDALYs.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total DALYs Saved</p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                        Highly Cost-Effective
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        WHO threshold: $150/DALY in high-income countries.
                        fluck's $100/DALY demonstrates exceptional value.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Return on Investment by Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-5 gap-4">
                    {dalyData.map((item) => (
                      <div key={item.category} className="text-center p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">{item.category}</h4>
                        <p className="text-lg font-bold text-aquamarine">
                          {(item.economicValue / (item.dalysSaved * 100)).toFixed(1)}x
                        </p>
                        <p className="text-xs text-muted-foreground">ROI Multiplier</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-6 w-6 text-primary" />
                    Platform Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#8884d8" name="Active Users" />
                      <Bar dataKey="engagement" fill="#82ca9d" name="Engagement %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community Growth Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {engagementData.map((platform) => (
                      <div key={platform.platform}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{platform.platform}</span>
                          <Badge variant={platform.growth > 20 ? "default" : "secondary"}>
                            +{platform.growth}% growth
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                          <span>{platform.users.toLocaleString()} users</span>
                          <span>{platform.engagement}% engagement</span>
                        </div>
                        <Progress value={platform.engagement} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Community Impact Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Active Community Members</h4>
                      <p className="text-3xl font-bold text-primary">54,916</p>
                      <p className="text-sm text-muted-foreground">17% monthly growth</p>
                    </div>
                    <div className="text-center">
                      <Heart className="h-12 w-12 text-aquamarine mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Health Outcomes Improved</h4>
                      <p className="text-3xl font-bold text-aquamarine">89%</p>
                      <p className="text-sm text-muted-foreground">User-reported satisfaction</p>
                    </div>
                    <div className="text-center">
                      <Globe className="h-12 w-12 text-secondary mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Cultural Communities Served</h4>
                      <p className="text-3xl font-bold text-secondary">47</p>
                      <p className="text-sm text-muted-foreground">Diverse representation</p>
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