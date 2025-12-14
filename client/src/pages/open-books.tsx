import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Vote,
  Eye,
  Download,
  Calendar,
  PieChart,
  BarChart3,
  Target,
  Coins,
  Building,
  Heart,
  Zap,
  Globe
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FinancialRecord {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  status: "confirmed" | "pending" | "projected";
}

interface BudgetItem {
  id: string;
  title: string;
  description: string;
  category: string;
  requestedAmount: number;
  allocatedAmount: number;
  votes: number;
  priority: "high" | "medium" | "low";
  status: "voting" | "approved" | "funded" | "completed";
  proposedBy: string;
  deadline: string;
}

export default function OpenBooks() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-Q4");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const financialRecords: FinancialRecord[] = [
    {
      id: "1",
      date: "2024-12-01",
      category: "Product Sales",
      description: "Custom protection sales revenue",
      amount: 12450.00,
      type: "income",
      status: "confirmed"
    },
    {
      id: "2",
      date: "2024-12-02",
      category: "Manufacturing",
      description: "Ocean plastic material sourcing",
      amount: -3200.00,
      type: "expense",
      status: "confirmed"
    },
    {
      id: "3",
      date: "2024-12-03",
      category: "Research & Development",
      description: "4D STI monitoring system development",
      amount: -5500.00,
      type: "expense",
      status: "confirmed"
    },
    {
      id: "4",
      date: "2024-12-04",
      category: "Community Dividends",
      description: "Peer mentor time bank payouts",
      amount: -2100.00,
      type: "expense",
      status: "confirmed"
    },
    {
      id: "5",
      date: "2024-12-05",
      category: "Partnerships",
      description: "BAD Co-op integration licensing",
      amount: 1800.00,
      type: "income",
      status: "confirmed"
    }
  ];

  const budgetItems: BudgetItem[] = [
    {
      id: "1",
      title: "Expand 3D Scanning Precision",
      description: "Upgrade anatomy scanning technology to support additional body types and improve measurement accuracy",
      category: "Technology",
      requestedAmount: 25000,
      allocatedAmount: 15000,
      votes: 127,
      priority: "high",
      status: "voting",
      proposedBy: "Community Tech Working Group",
      deadline: "2024-12-31"
    },
    {
      id: "2",
      title: "Multilingual Wiki Expansion",
      description: "Translate sexual health education content into 15 additional languages with cultural adaptation",
      category: "Education",
      requestedAmount: 18000,
      allocatedAmount: 12000,
      votes: 89,
      priority: "medium",
      status: "approved",
      proposedBy: "Global Accessibility Coalition",
      deadline: "2025-03-15"
    },
    {
      id: "3",
      title: "Sustainable Packaging Initiative",
      description: "Develop fully biodegradable packaging system using mycelium-based materials",
      category: "Sustainability",
      requestedAmount: 8500,
      allocatedAmount: 8500,
      votes: 156,
      priority: "high",
      status: "funded",
      proposedBy: "Environmental Impact Team",
      deadline: "2025-01-30"
    },
    {
      id: "4",
      title: "Community Health Clinic Partnerships",
      description: "Establish partnerships with 20 additional community health clinics in underserved areas",
      category: "Healthcare Access",
      requestedAmount: 35000,
      allocatedAmount: 0,
      votes: 203,
      priority: "high",
      status: "voting",
      proposedBy: "Health Equity Advocates",
      deadline: "2025-06-01"
    }
  ];

  const financialSummary = {
    totalRevenue: 14250.00,
    totalExpenses: 10800.00,
    netIncome: 3450.00,
    communityDividends: 2100.00,
    reinvestment: 1350.00
  };

  const categoryBreakdown = [
    { name: "Technology", allocated: 15000, spent: 8200, percentage: 35 },
    { name: "Education", allocated: 12000, spent: 6800, percentage: 28 },
    { name: "Sustainability", allocated: 8500, spent: 8500, percentage: 20 },
    { name: "Healthcare Access", allocated: 5000, spent: 2100, percentage: 12 },
    { name: "Operations", allocated: 2200, spent: 1900, percentage: 5 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "voting": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-green-100 text-green-800";
      case "funded": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Cooperative finances center intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" budget—affirming care serves ALL bodies by design.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground font-recoleta">
                Open Books Management
              </h1>
              <p className="text-xl text-muted-foreground mt-2 font-coolvetica">
                Transparent Accounting • Participatory Budgeting • Community Governance
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="financial-records" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financial-records" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial Records
            </TabsTrigger>
            <TabsTrigger value="budget-voting" className="flex items-center gap-2">
              <Vote className="h-4 w-4" />
              Budget Voting
            </TabsTrigger>
            <TabsTrigger value="transparency" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Transparency Reports
            </TabsTrigger>
            <TabsTrigger value="governance" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community Governance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="financial-records" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${financialSummary.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600">
                        ${financialSummary.totalExpenses.toLocaleString()}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Net Income</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${financialSummary.netIncome.toLocaleString()}
                      </p>
                    </div>
                    <PieChart className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Community Dividends</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${financialSummary.communityDividends.toLocaleString()}
                      </p>
                    </div>
                    <Coins className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-recoleta">Recent Financial Transactions</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          record.type === "income" ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {record.type === "income" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <BarChart3 className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{record.description}</p>
                          <p className="text-sm text-gray-500">{record.category} • {record.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          record.type === "income" ? "text-green-600" : "text-red-600"
                        }`}>
                          {record.type === "income" ? "+" : ""}${Math.abs(record.amount).toLocaleString()}
                        </p>
                        <Badge variant={record.status === "confirmed" ? "default" : "secondary"}>
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget-voting" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {categoryBreakdown.map((category) => (
                <Card key={category.name}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{category.name}</h3>
                        <Badge variant="outline">{category.percentage}%</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Allocated: ${category.allocated.toLocaleString()}</span>
                          <span>Spent: ${category.spent.toLocaleString()}</span>
                        </div>
                        <Progress value={(category.spent / category.allocated) * 100} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-recoleta">Community Budget Proposals</CardTitle>
                <p className="text-muted-foreground">
                  Vote on budget allocations and propose new initiatives
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgetItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Proposed by: {item.proposedBy}</span>
                            <span>•</span>
                            <span>Deadline: {item.deadline}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Requested Amount</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ${item.requestedAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Allocated Amount</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${item.allocatedAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Community Votes</p>
                          <p className="text-2xl font-bold text-purple-600">{item.votes}</p>
                        </div>
                      </div>

                      {item.status === "voting" && (
                        <div className="flex space-x-3">
                          <Button variant="default" size="sm">
                            <Vote className="h-4 w-4 mr-2" />
                            Vote For
                          </Button>
                          <Button variant="outline" size="sm">
                            More Details
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transparency" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Transparency Principles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Open Financial Records</h3>
                      <p className="text-sm text-gray-600">
                        All financial transactions are publicly accessible and auditable
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Vote className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Democratic Budget Allocation</h3>
                      <p className="text-sm text-gray-600">
                        Community members vote on budget priorities and fund allocation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Impact Measurement</h3>
                      <p className="text-sm text-gray-600">
                        Regular reporting on social impact and DALY metrics
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Cooperative Ownership</h3>
                      <p className="text-sm text-gray-600">
                        Stakeholder ownership with profit-sharing and decision-making rights
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Monthly Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    December 2024 Financial Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    November 2024 Impact Assessment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Q4 2024 Community Survey Results
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Annual Cooperative Report 2024
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="governance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Governance Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Community Assembly</span>
                      </div>
                      <Badge variant="outline">2,847 members</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Heart className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Health Equity Board</span>
                      </div>
                      <Badge variant="outline">12 members</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Zap className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Tech Innovation Council</span>
                      </div>
                      <Badge variant="outline">8 members</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Global Partnerships Committee</span>
                      </div>
                      <Badge variant="outline">15 members</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Participation Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <Vote className="h-4 w-4 mr-2" />
                    Join Monthly Budget Vote
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Apply for Committee Membership
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Submit Budget Proposal
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Attend Community Assembly
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}