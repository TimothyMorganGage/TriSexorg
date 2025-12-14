import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FediverseShare } from "@/components/FediverseShare";
import {
  Heart,
  Coins,
  Clock,
  Recycle,
  Package,
  TrendingUp,
  Award,
  ArrowRightLeft,
  Wallet,
  Lock,
  Leaf,
  Factory,
  Truck,
  CheckCircle,
  Timer,
  DollarSign,
  Users,
  Gift,
  QrCode,
  Calculator,
  BarChart3,
  Sparkles,
  RefreshCcw,
  Send,
  Download
} from "lucide-react";
import { Link } from "wouter";

interface TimeBank {
  totalHours: number;
  hoursContributed: number;
  hoursReceived: number;
  currentBalance: number;
  trisexBalance: number;
  pendingRewards: number;
  equityMultiplier: number;
  upcycleCredits: number;
}

interface UpcycleSubmission {
  id: string;
  productType: string;
  quantity: number;
  condition: string;
  status: "pending" | "received" | "processed" | "credited";
  creditsEarned: number;
  submittedAt: Date;
}

export default function TrisexStablecoin() {
  const [activeTab, setActiveTab] = useState("wallet");
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showUpcycleDialog, setShowUpcycleDialog] = useState(false);
  
  const [timeBank, setTimeBank] = useState<TimeBank>({
    totalHours: 342,
    hoursContributed: 156,
    hoursReceived: 98,
    currentBalance: 58,
    trisexBalance: 847.25,
    pendingRewards: 124.50,
    equityMultiplier: 1.34,
    upcycleCredits: 45.00
  });

  const [upcycleForm, setUpcycleForm] = useState({
    productType: "",
    quantity: 1,
    batchNumber: "",
    expirationDate: "",
    condition: "expired_sealed",
    shippingMethod: "prepaid_label"
  });

  const [upcycleSubmissions] = useState<UpcycleSubmission[]>([
    {
      id: "UP-2024-001",
      productType: "External Protection (Standard)",
      quantity: 12,
      condition: "Expired - Sealed",
      status: "credited",
      creditsEarned: 18.00,
      submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      id: "UP-2024-002",
      productType: "Barrier Dams (Flavored)",
      quantity: 8,
      condition: "Expired - Sealed",
      status: "processed",
      creditsEarned: 12.00,
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: "UP-2024-003",
      productType: "NanoHeal Lubricant",
      quantity: 3,
      condition: "Expired - Sealed",
      status: "received",
      creditsEarned: 0,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ]);

  const productTypes = [
    { value: "external_standard", label: "External Protection (Standard)", creditPer: 1.50 },
    { value: "external_custom", label: "External Protection (Custom-Fit)", creditPer: 2.50 },
    { value: "internal_standard", label: "Internal Protection (Standard)", creditPer: 1.75 },
    { value: "internal_custom", label: "Internal Protection (Custom-Fit)", creditPer: 3.00 },
    { value: "barrier_dam", label: "Barrier Dams", creditPer: 1.50 },
    { value: "barrier_dam_flavored", label: "Barrier Dams (Flavored)", creditPer: 1.75 },
    { value: "oral_barrier", label: "Oral Barriers (MSM)", creditPer: 2.00 },
    { value: "nanoheal_lubricant", label: "NanoHeal Lubricant", creditPer: 4.00 },
    { value: "multi_anatomy_kit", label: "Multi-Anatomy Kit", creditPer: 5.00 }
  ];

  const calculateTimeToTrisex = (hours: number) => {
    const baseRate = 5.00;
    return hours * baseRate * timeBank.equityMultiplier;
  };

  const calculateUpcycleCredit = () => {
    const product = productTypes.find(p => p.value === upcycleForm.productType);
    return product ? product.creditPer * upcycleForm.quantity : 0;
  };

  const handleSubmitUpcycle = () => {
    console.log("Submitting upcycle:", upcycleForm);
    setShowUpcycleDialog(false);
    setUpcycleForm({
      productType: "",
      quantity: 1,
      batchNumber: "",
      expirationDate: "",
      condition: "expired_sealed",
      shippingMethod: "prepaid_label"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "credited": return "bg-green-100 text-green-800";
      case "processed": return "bg-blue-100 text-blue-800";
      case "received": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Alert className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-purple-200">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> $TRISEX stablecoin centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—cooperative economics serves ALL bodies by design.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-5xl">⚧️</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <Coins className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
            $TRISEX Stablecoin
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Time Banking • Cooperative Dividends • Upcycle Credits
          </p>
          <div className="flex justify-center mb-4">
            <FediverseShare
              title="$TRISEX Stablecoin - Cooperative Sexual Health Currency"
              description="Earn $TRISEX through time banking, upcycling expired products, and cooperative participation"
              hashtags={["TRISEX", "Stablecoin", "TimeBank", "Cooperative", "Upcycle"]}
              imagePrompt="Cryptocurrency coin with transgender symbol"
            />
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              1:1 USD Backed
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Leaf className="h-4 w-4 mr-2" />
              Carbon Neutral
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Cooperative Owned
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <CardContent className="p-4 text-center">
              <Wallet className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">${timeBank.trisexBalance.toFixed(2)}</div>
              <div className="text-sm opacity-80">$TRISEX Balance</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">{timeBank.currentBalance}</div>
              <div className="text-sm opacity-80">Time Bank Hours</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <CardContent className="p-4 text-center">
              <Recycle className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">${timeBank.upcycleCredits.toFixed(2)}</div>
              <div className="text-sm opacity-80">Upcycle Credits</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-amber-500 text-white">
            <CardContent className="p-4 text-center">
              <Gift className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">${timeBank.pendingRewards.toFixed(2)}</div>
              <div className="text-sm opacity-80">Pending Rewards</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="wallet" data-testid="tab-wallet">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="timebank" data-testid="tab-timebank">
              <Clock className="h-4 w-4 mr-2" />
              Time Bank
            </TabsTrigger>
            <TabsTrigger value="upcycle" data-testid="tab-upcycle">
              <Recycle className="h-4 w-4 mr-2" />
              Trade-In
            </TabsTrigger>
            <TabsTrigger value="exchange" data-testid="tab-exchange">
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Exchange
            </TabsTrigger>
            <TabsTrigger value="rewards" data-testid="tab-rewards">
              <Award className="h-4 w-4 mr-2" />
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-purple-600" />
                    Your $TRISEX Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-lg p-6 text-center">
                    <div className="text-5xl font-bold text-purple-600 mb-2">
                      ${timeBank.trisexBalance.toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">Available Balance</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>From Time Banking</span>
                      </div>
                      <span className="font-semibold">${calculateTimeToTrisex(timeBank.hoursContributed).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Recycle className="h-4 w-4 text-green-600" />
                        <span>From Upcycling</span>
                      </div>
                      <span className="font-semibold">${timeBank.upcycleCredits.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-orange-600" />
                        <span>From Dividends</span>
                      </div>
                      <span className="font-semibold">${timeBank.pendingRewards.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full" data-testid="button-send-trisex">
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send $TRISEX</DialogTitle>
                          <DialogDescription>
                            Transfer $TRISEX to another cooperative member
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label>Recipient Username or Wallet</Label>
                            <Input placeholder="@username or wallet address" data-testid="input-recipient" />
                          </div>
                          <div>
                            <Label>Amount</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                              <Input type="number" placeholder="0.00" className="pl-8" data-testid="input-send-amount" />
                            </div>
                          </div>
                          <div>
                            <Label>Note (optional)</Label>
                            <Input placeholder="Thanks for the peer mentoring!" data-testid="input-send-note" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowSendDialog(false)}>Cancel</Button>
                          <Button data-testid="button-confirm-send">Send $TRISEX</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="w-full" data-testid="button-receive-trisex">
                      <Download className="h-4 w-4 mr-2" />
                      Receive
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: "received", from: "Time Bank", amount: 35.00, date: "2 hours ago", icon: Clock },
                      { type: "received", from: "Upcycle Credit", amount: 18.00, date: "3 days ago", icon: Recycle },
                      { type: "sent", from: "@PeerMentor", amount: -15.00, date: "5 days ago", icon: Users },
                      { type: "received", from: "Dividend Q4", amount: 89.25, date: "1 week ago", icon: Award },
                      { type: "received", from: "Referral Bonus", amount: 25.00, date: "2 weeks ago", icon: Gift }
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                            <tx.icon className={`h-4 w-4 ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`} />
                          </div>
                          <div>
                            <div className="font-medium">{tx.from}</div>
                            <div className="text-xs text-muted-foreground">{tx.date}</div>
                          </div>
                        </div>
                        <div className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timebank" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Time Bank Overview
                  </CardTitle>
                  <CardDescription>
                    Contribute time to earn $TRISEX at ${(5.00 * timeBank.equityMultiplier).toFixed(2)}/hour
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{timeBank.hoursContributed}</div>
                      <div className="text-sm text-muted-foreground">Hours Contributed</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{timeBank.hoursReceived}</div>
                      <div className="text-sm text-muted-foreground">Hours Received</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Current Balance:</span>
                      <span className="font-semibold">{timeBank.currentBalance} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equity Multiplier:</span>
                      <Badge variant="secondary">{timeBank.equityMultiplier}x</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Hourly Rate:</span>
                      <span className="font-semibold text-purple-600">
                        ${(5.00 * timeBank.equityMultiplier).toFixed(2)} $TRISEX
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-medium">Potential Earnings:</span>
                      <span className="font-bold text-purple-600">
                        ${calculateTimeToTrisex(timeBank.currentBalance).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link href="/time-tracker">
                    <Button className="w-full" data-testid="button-log-time">
                      <Timer className="h-4 w-4 mr-2" />
                      Log Time Contribution
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    Convert Time to $TRISEX
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Conversion Formula</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Rate:</span>
                        <span>$5.00 per hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Your Multiplier:</span>
                        <span className="text-purple-600 font-semibold">{timeBank.equityMultiplier}x</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Your Rate:</span>
                        <span className="text-purple-600">${(5.00 * timeBank.equityMultiplier).toFixed(2)}/hour</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Hours to Convert</Label>
                    <Input type="number" max={timeBank.currentBalance} defaultValue={10} data-testid="input-hours-convert" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Available: {timeBank.currentBalance} hours
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                    <div className="text-sm text-muted-foreground">You'll receive</div>
                    <div className="text-3xl font-bold text-purple-600">
                      ${calculateTimeToTrisex(10).toFixed(2)} $TRISEX
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500" data-testid="button-convert-time">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Convert to $TRISEX
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>How to Earn Time Bank Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { title: "Peer Mentoring", hours: "5-10/session", icon: Users, description: "Support other members with sexual health questions" },
                    { title: "Content Creation", hours: "2-5/article", icon: Sparkles, description: "Write educational wiki articles or guides" },
                    { title: "Forum Moderation", hours: "1-3/hour", icon: Users, description: "Help maintain community guidelines" },
                    { title: "Product Testing", hours: "3-8/review", icon: Package, description: "Test new products and provide feedback" }
                  ].map((item, i) => (
                    <Card key={i} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                      <CardContent className="p-4 text-center">
                        <item.icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <Badge variant="secondary" className="mb-2">{item.hours}</Badge>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcycle" className="space-y-6">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500 rounded-xl">
                    <Recycle className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">♻️ Trade Expired Products for New Ones</h3>
                    <p className="text-muted-foreground mb-4">
                      <strong>Closed-loop recycling:</strong> Don't throw away expired or unwanted condoms and barriers! 
                      Send them back and receive brand new products in exchange. We break down the materials and 
                      manufacture fresh products from recycled components—just like our waterway microplastic program. 
                      Your old protection becomes someone's new protection.
                    </p>
                    <div className="flex gap-3">
                      <Dialog open={showUpcycleDialog} onOpenChange={setShowUpcycleDialog}>
                        <DialogTrigger asChild>
                          <Button className="bg-green-600 hover:bg-green-700" data-testid="button-start-upcycle">
                            <Package className="h-4 w-4 mr-2" />
                            Start Upcycle Submission
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Exchange Expired Products for New Ones</DialogTitle>
                            <DialogDescription>
                              Trade in your expired or unwanted condoms and barriers for brand new products
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label>Product Type</Label>
                              <Select 
                                value={upcycleForm.productType}
                                onValueChange={(v) => setUpcycleForm({...upcycleForm, productType: v})}
                              >
                                <SelectTrigger data-testid="select-upcycle-product">
                                  <SelectValue placeholder="Select product type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {productTypes.map(p => (
                                    <SelectItem key={p.value} value={p.value}>
                                      {p.label} (${p.creditPer.toFixed(2)} each)
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Quantity</Label>
                                <Input 
                                  type="number" 
                                  min={1}
                                  value={upcycleForm.quantity}
                                  onChange={(e) => setUpcycleForm({...upcycleForm, quantity: parseInt(e.target.value) || 1})}
                                  data-testid="input-upcycle-quantity"
                                />
                              </div>
                              <div>
                                <Label>Batch Number (if known)</Label>
                                <Input 
                                  value={upcycleForm.batchNumber}
                                  onChange={(e) => setUpcycleForm({...upcycleForm, batchNumber: e.target.value})}
                                  placeholder="e.g., TX-2024-001"
                                  data-testid="input-batch-number"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Expiration Date</Label>
                              <Input 
                                type="date"
                                value={upcycleForm.expirationDate}
                                onChange={(e) => setUpcycleForm({...upcycleForm, expirationDate: e.target.value})}
                                data-testid="input-expiration-date"
                              />
                            </div>
                            <div>
                              <Label>Condition</Label>
                              <Select 
                                value={upcycleForm.condition}
                                onValueChange={(v) => setUpcycleForm({...upcycleForm, condition: v})}
                              >
                                <SelectTrigger data-testid="select-condition">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="expired_sealed">Expired - Factory Sealed (100% credit)</SelectItem>
                                  <SelectItem value="expired_opened">Expired - Opened Package (75% credit)</SelectItem>
                                  <SelectItem value="unused_sealed">Unused - Factory Sealed (100% credit)</SelectItem>
                                  <SelectItem value="damaged_packaging">Damaged Packaging (50% credit)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Shipping Method</Label>
                              <Select 
                                value={upcycleForm.shippingMethod}
                                onValueChange={(v) => setUpcycleForm({...upcycleForm, shippingMethod: v})}
                              >
                                <SelectTrigger data-testid="select-shipping">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="prepaid_label">Prepaid Shipping Label (Free)</SelectItem>
                                  <SelectItem value="drop_off">Drop at Partner Location (+10% bonus)</SelectItem>
                                  <SelectItem value="self_ship">Self-Ship (Reimbursed up to $5)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {upcycleForm.productType && (
                              <div className="space-y-3">
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                  <div className="text-center mb-3">
                                    <div className="text-sm text-muted-foreground">Exchange Value</div>
                                    <div className="text-3xl font-bold text-green-600">
                                      ${calculateUpcycleCredit().toFixed(2)}
                                    </div>
                                  </div>
                                  <Separator className="my-3" />
                                  <div>
                                    <Label className="text-green-700 font-semibold">Choose Your New Products:</Label>
                                    <Select defaultValue="same_type">
                                      <SelectTrigger className="mt-2" data-testid="select-new-product">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="same_type">Same product type (new)</SelectItem>
                                        <SelectItem value="external_standard">External Protection (Standard)</SelectItem>
                                        <SelectItem value="external_custom">External Protection (Custom-Fit)</SelectItem>
                                        <SelectItem value="internal_standard">Internal Protection</SelectItem>
                                        <SelectItem value="barrier_dam">Barrier Dams</SelectItem>
                                        <SelectItem value="oral_barrier">Oral Barriers (MSM)</SelectItem>
                                        <SelectItem value="nanoheal">NanoHeal Lubricant</SelectItem>
                                        <SelectItem value="credit_only">Just $TRISEX Credit</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      New products ship free once we receive your trade-in
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowUpcycleDialog(false)}>Cancel</Button>
                            <Button 
                              onClick={handleSubmitUpcycle} 
                              className="bg-green-600 hover:bg-green-700"
                              data-testid="button-submit-upcycle"
                            >
                              Start Trade-In & Get New Products
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" data-testid="button-find-dropoff">
                        <QrCode className="h-4 w-4 mr-2" />
                        Find Drop-off Location
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Your Trade-In Exchanges
                  </CardTitle>
                  <CardDescription>
                    Track your expired-to-new product exchanges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcycleSubmissions.map(sub => (
                      <div key={sub.id} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold">{sub.id}</div>
                            <div className="text-sm text-muted-foreground">{sub.productType}</div>
                          </div>
                          <Badge className={getStatusColor(sub.status)}>
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Sent: {sub.quantity} expired items</span>
                          {sub.creditsEarned > 0 ? (
                            <span className="text-green-600 font-semibold">
                              → {Math.floor(sub.creditsEarned / 1.5)} new products
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Processing...</span>
                          )}
                        </div>
                        <Progress 
                          value={
                            sub.status === "pending" ? 25 :
                            sub.status === "received" ? 50 :
                            sub.status === "processed" ? 75 : 100
                          }
                          className="h-2 mt-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Factory className="h-5 w-5 text-green-600" />
                    How the Closed-Loop Exchange Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { step: 1, title: "Submit Trade-In", desc: "Choose your expired products and select what new products you want", icon: Package },
                      { step: 2, title: "Ship Old Products", desc: "Use our prepaid label or drop off at a partner location", icon: Truck },
                      { step: 3, title: "Recycling & Remanufacturing", desc: "Materials are safely broken down and made into new products", icon: Factory },
                      { step: 4, title: "Receive New Products", desc: "Fresh products shipped to you free, or take $TRISEX credit", icon: Gift }
                    ].map(item => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-green-600">{item.step}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Alert className="mt-4 bg-green-50 dark:bg-green-900/20 border-green-200">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      <strong>Environmental Impact:</strong> Each upcycled product prevents ~15g of material from landfills and reduces virgin plastic demand.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Exchange Values by Product Type</CardTitle>
                <CardDescription>
                  Trade in expired products and receive new ones of equal or different value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {productTypes.map(product => (
                    <div key={product.value} className="p-4 bg-muted/30 rounded-lg flex justify-between items-center">
                      <span>{product.label}</span>
                      <Badge className="bg-green-600 text-white">${product.creditPer.toFixed(2)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exchange" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-purple-600" />
                    Exchange $TRISEX
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>From</Label>
                    <Select defaultValue="trisex">
                      <SelectTrigger data-testid="select-exchange-from">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trisex">$TRISEX</SelectItem>
                        <SelectItem value="timebank">Time Bank Hours</SelectItem>
                        <SelectItem value="upcycle">Upcycle Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input type="number" placeholder="100.00" data-testid="input-exchange-amount" />
                  </div>
                  <div className="flex justify-center py-2">
                    <RefreshCcw className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <Label>To</Label>
                    <Select defaultValue="usdc">
                      <SelectTrigger data-testid="select-exchange-to">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdc">USDC</SelectItem>
                        <SelectItem value="dai">DAI</SelectItem>
                        <SelectItem value="products">Product Credits</SelectItem>
                        <SelectItem value="donation">Community Donation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                    <div className="text-sm text-muted-foreground">You'll receive</div>
                    <div className="text-2xl font-bold text-purple-600">100.00 USDC</div>
                    <div className="text-xs text-muted-foreground">1:1 exchange rate</div>
                  </div>
                  <Button className="w-full" data-testid="button-exchange">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Exchange
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    Use $TRISEX
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: "Product Discounts", desc: "Pay for products with up to 50% $TRISEX", icon: Package },
                      { title: "Peer Services", desc: "Pay mentors and facilitators directly", icon: Users },
                      { title: "Community Donations", desc: "Support cooperative programs", icon: Heart },
                      { title: "Partner Clinics", desc: "Pay for services at participating clinics", icon: Heart },
                      { title: "Stablecoin Withdrawal", desc: "Convert to USDC/DAI at 1:1", icon: Wallet }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                          <item.icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  Cooperative Rewards & Dividends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg">
                    <div className="text-4xl font-bold text-orange-600">${timeBank.pendingRewards.toFixed(2)}</div>
                    <div className="text-muted-foreground">Pending Rewards</div>
                    <Button size="sm" className="mt-3 bg-orange-500 hover:bg-orange-600" data-testid="button-claim-rewards">
                      Claim All
                    </Button>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                    <div className="text-4xl font-bold text-purple-600">{timeBank.equityMultiplier}x</div>
                    <div className="text-muted-foreground">Equity Multiplier</div>
                    <div className="text-xs text-muted-foreground mt-2">Based on contribution history</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                    <div className="text-4xl font-bold text-green-600">Q1 2025</div>
                    <div className="text-muted-foreground">Next Dividend</div>
                    <div className="text-xs text-muted-foreground mt-2">Est. $180-$220</div>
                  </div>
                </div>

                <h4 className="font-semibold mb-3">Ways to Earn Rewards</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: "Time Bank Contributions", reward: "5x hourly rate", desc: "Log peer mentoring or content creation" },
                    { title: "Product Upcycling", reward: "$1.50-$5.00 per item", desc: "Return expired products for recycling" },
                    { title: "Quarterly Dividends", reward: "Equity-based", desc: "Share in cooperative profits" },
                    { title: "Referral Bonuses", reward: "$25 per referral", desc: "Invite new members to join" },
                    { title: "Forum Participation", reward: "0.5-2 hours credit", desc: "Quality posts and moderation" },
                    { title: "Product Reviews", reward: "3-5 hours credit", desc: "Detailed feedback on products" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold">{item.title}</span>
                        <Badge variant="secondary">{item.reward}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-blue-600" />
              About $TRISEX Stablecoin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">1:1 USD Backed</h4>
                <p className="text-sm text-muted-foreground">
                  Every $TRISEX is backed by $1 USD held in cooperative reserves. Audited quarterly with full transparency.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cooperative Governance</h4>
                <p className="text-sm text-muted-foreground">
                  Token holders participate in budget decisions through participatory budgeting. Your $TRISEX = your voice.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Circular Economy</h4>
                <p className="text-sm text-muted-foreground">
                  Upcycling expired products keeps materials in circulation and rewards sustainable behavior with $TRISEX.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
