import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Heart, 
  Lock, 
  Users, 
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  Phone,
  Building,
  Link as LinkIcon,
  Download,
  Upload
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BadGoodHealth() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const { data: healthPlan, isLoading } = useQuery({
    queryKey: ['/api/health-planning'],
  });

  const healthPlanningAreas = [
    {
      id: "advance-directives",
      title: "Advance Directives",
      description: "Living wills, healthcare proxies, and end-of-life preferences",
      status: "complete",
      priority: "critical",
      lastUpdated: "2 days ago"
    },
    {
      id: "sexual-health",
      title: "Sexual Health Planning",
      description: "Integrated with TriSex for comprehensive sexual wellness",
      status: "in-progress",
      priority: "high",
      lastUpdated: "1 hour ago"
    },
    {
      id: "emergency-contacts",
      title: "Emergency Contacts",
      description: "Healthcare advocates, family, and trusted decision makers",
      status: "complete",
      priority: "critical",
      lastUpdated: "1 week ago"
    },
    {
      id: "healthcare-preferences",
      title: "Healthcare Preferences",
      description: "Treatment preferences, hospital choices, and care values",
      status: "needs-review",
      priority: "medium",
      lastUpdated: "3 weeks ago"
    },
    {
      id: "financial-planning",
      title: "Healthcare Financial Planning",
      description: "Insurance, costs, and financial healthcare directives",
      status: "incomplete",
      priority: "medium",
      lastUpdated: "Never"
    },
    {
      id: "cooperative-advocacy",
      title: "Cooperative Healthcare Advocacy",
      description: "Community health initiatives and collective advocacy",
      status: "active",
      priority: "low",
      lastUpdated: "Today"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "needs-review": return "bg-yellow-500";
      case "incomplete": return "bg-red-500";
      case "active": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-600";
      case "high": return "text-orange-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const cooperativeHealthValues = [
    {
      principle: "Voluntary & Open Healthcare",
      description: "Universal healthcare access regardless of ability to pay",
      implementation: "Sliding scale pricing, community health funds, mutual aid networks"
    },
    {
      principle: "Democratic Health Governance",
      description: "Community participation in healthcare decisions",
      implementation: "Patient councils, community health boards, participatory budgeting"
    },
    {
      principle: "Member Economic Participation",
      description: "Shared healthcare costs and collective purchasing power",
      implementation: "Healthcare cooperatives, group purchasing, shared insurance"
    },
    {
      principle: "Autonomous Health Decisions",
      description: "Individual autonomy within supportive community structures",
      implementation: "Informed consent, patient advocacy, advance directive support"
    },
    {
      principle: "Health Education for All",
      description: "Comprehensive health literacy and education",
      implementation: "Community workshops, peer education, multilingual resources"
    },
    {
      principle: "Healthcare Cooperation",
      description: "Collaboration between health cooperatives and providers",
      implementation: "Network partnerships, resource sharing, best practice exchange"
    },
    {
      principle: "Community Health Focus",
      description: "Population health and social determinants",
      implementation: "Public health initiatives, environmental health, social justice"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Health planning centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—comprehensive care planning serves ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mr-4">
              <FileText className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                BAD co-op <span className="text-primary">for GOOD Health</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Advanced Care Planning & Cooperative Healthcare
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-primary text-black">
              <FileText className="w-4 h-4 mr-1" />
              Advance Planning
            </Badge>
            <Badge variant="secondary" className="bg-aquamarine text-black">
              <Heart className="w-4 h-4 mr-1" />
              Sexual Health Integration
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-black">
              <Users className="w-4 h-4 mr-1" />
              Cooperative Healthcare
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Health Planning</TabsTrigger>
            <TabsTrigger value="directives">Advance Directives</TabsTrigger>
            <TabsTrigger value="integration">TriSex Integration</TabsTrigger>
            <TabsTrigger value="cooperative">Cooperative Values</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comprehensive Health Planning Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {healthPlanningAreas.map((area) => (
                      <Card key={area.id} className="border-l-4 border-l-primary/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{area.title}</CardTitle>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(area.status)}`} />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{area.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-medium ${getPriorityColor(area.priority)}`}>
                              {area.priority.toUpperCase()} PRIORITY
                            </span>
                            <span className="text-muted-foreground">
                              Updated {area.lastUpdated}
                            </span>
                          </div>
                          <div className="mt-3">
                            <Progress 
                              value={area.status === "complete" ? 100 : 
                                     area.status === "in-progress" ? 60 :
                                     area.status === "needs-review" ? 80 :
                                     area.status === "active" ? 90 : 20} 
                              className="h-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-aquamarine rounded-full" />
                        <div className="text-sm">
                          <span className="font-medium">Sexual health preferences updated</span>
                          <p className="text-muted-foreground">Integrated with TriSex protection settings</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div className="text-sm">
                          <span className="font-medium">Emergency contacts verified</span>
                          <p className="text-muted-foreground">Healthcare proxy confirmations received</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                        <div className="text-sm">
                          <span className="font-medium">Cooperative health group joined</span>
                          <p className="text-muted-foreground">Community health advocacy participation</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-primary" />
                      Upcoming Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Annual directive review</p>
                          <p className="text-xs text-muted-foreground">Due in 3 months</p>
                        </div>
                        <Badge variant="outline">Scheduled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Healthcare proxy check-in</p>
                          <p className="text-xs text-muted-foreground">Due in 2 weeks</p>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Financial planning update</p>
                          <p className="text-xs text-muted-foreground">Overdue</p>
                        </div>
                        <Badge variant="destructive">Action Needed</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="directives">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core BAD Co-op Directives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 p-6 rounded-lg space-y-6">
                    <h3 className="text-lg font-semibold mb-4 font-cinzel">Required Directive Information</h3>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Biological Sex</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="">Select biological sex</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="intersex">Intersex</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Religious Community</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="">Select religious community</option>
                          <option value="native_american_church">Native American Church</option>
                          <option value="christian">Christian</option>
                          <option value="muslim">Muslim</option>
                          <option value="jewish">Jewish</option>
                          <option value="buddhist">Buddhist</option>
                          <option value="hindu">Hindu</option>
                          <option value="sikh">Sikh</option>
                          <option value="secular">Secular/Non-religious</option>
                          <option value="spiritual_not_religious">Spiritual but not religious</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Race & Ethnicity</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="">Select race/ethnicity</option>
                          <option value="indigenous_native_american">Indigenous/Native American</option>
                          <option value="african_american_black">African American/Black</option>
                          <option value="asian_pacific_islander">Asian/Pacific Islander</option>
                          <option value="hispanic_latino">Hispanic/Latino</option>
                          <option value="white_caucasian">White/Caucasian</option>
                          <option value="middle_eastern">Middle Eastern</option>
                          <option value="multiracial">Multiracial</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Accessibility Affirmations</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          "I affirm my right to accessible healthcare services",
                          "I request communication accommodations as needed",
                          "I affirm my right to dignity in all healthcare interactions",
                          "I request physical accessibility accommodations",
                          "I affirm my autonomy in healthcare decisions",
                          "I request language interpretation services if needed",
                          "I affirm my right to culturally competent care",
                          "I request assistive technology accommodations"
                        ].map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <input type="checkbox" className="mt-1" />
                            <label className="text-sm">{item}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline">Save Draft</Button>
                      <Button className="bg-primary hover:bg-primary/90 text-black">Update Directives</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advance Directives Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Completed Documents</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <span className="text-sm">Living Will</span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <span className="text-sm">Healthcare Proxy</span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <span className="text-sm">HIPAA Authorization</span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-aquamarine/20 rounded">
                          <span className="text-sm">Sexual Health Directives</span>
                          <CheckCircle className="h-4 w-4 text-aquamarine" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Key Contacts</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Primary Healthcare Proxy</p>
                            <p className="text-xs text-muted-foreground">Alex Johnson - (555) 123-4567</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Alternate Healthcare Proxy</p>
                            <p className="text-xs text-muted-foreground">Morgan Smith - (555) 987-6543</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Building className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Preferred Hospital</p>
                            <p className="text-xs text-muted-foreground">Community Cooperative Medical Center</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Documents
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Update Directives
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-black">
                      <FileText className="h-4 w-4 mr-2" />
                      Create New Directive
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Directive Sharing & Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-border rounded-lg">
                      <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h5 className="font-medium">Secure Storage</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Encrypted cloud storage with blockchain verification
                      </p>
                    </div>
                    <div className="text-center p-4 border border-border rounded-lg">
                      <Users className="h-8 w-8 text-aquamarine mx-auto mb-2" />
                      <h5 className="font-medium">Authorized Access</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Healthcare providers and proxies have secure access
                      </p>
                    </div>
                    <div className="text-center p-4 border border-border rounded-lg">
                      <Activity className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <h5 className="font-medium">Real-time Updates</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Instant notifications when directives are accessed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integration">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LinkIcon className="mr-2 h-6 w-6 text-aquamarine" />
                    TriSex Sexual Health Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-aquamarine/10 border border-aquamarine/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-aquamarine mr-2" />
                      <span className="font-medium">Successfully integrated with TriSex</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Your sexual health preferences and advance directives are now synchronized.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Integrated Health Areas</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Sexual health preferences</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Consent protocols</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Emergency contact coordination</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Medical information sharing</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Privacy & data protection</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Integration Benefits</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <h5 className="text-sm font-medium text-aquamarine">Holistic Care Planning</h5>
                          <p className="text-xs text-muted-foreground">
                            Sexual health is integrated into your overall healthcare planning
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <h5 className="text-sm font-medium text-primary">Emergency Coordination</h5>
                          <p className="text-xs text-muted-foreground">
                            Sexual health needs addressed in emergency medical situations
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <h5 className="text-sm font-medium text-secondary">Unified Advocacy</h5>
                          <p className="text-xs text-muted-foreground">
                            Healthcare proxies informed about all aspects of your health
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Synchronization Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h5 className="font-medium text-sm">Personal Preferences</h5>
                      <p className="text-xs text-green-600">Synced</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h5 className="font-medium text-sm">Emergency Contacts</h5>
                      <p className="text-xs text-green-600">Synced</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <h5 className="font-medium text-sm">Medical History</h5>
                      <p className="text-xs text-blue-600">Updating</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Lock className="h-6 w-6 text-green-600" />
                      </div>
                      <h5 className="font-medium text-sm">Privacy Settings</h5>
                      <p className="text-xs text-green-600">Protected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cooperative">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cooperative Healthcare Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Our healthcare approach is grounded in cooperative principles that prioritize 
                    community wellbeing, democratic participation, and equitable access to health resources.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {cooperativeHealthValues.map((value, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                          {index + 1}
                        </div>
                        {value.principle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">{value.description}</p>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-primary mb-2">Implementation:</h5>
                        <p className="text-sm">{value.implementation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Community Health Participation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-border rounded-lg">
                      <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h5 className="font-medium">Health Cooperative Member</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Active participant in local health cooperative
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="text-center p-4 border border-border rounded-lg">
                      <Heart className="h-8 w-8 text-aquamarine mx-auto mb-2" />
                      <h5 className="font-medium">Community Health Advocate</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Volunteering for community health initiatives
                      </p>
                      <Badge className="mt-2 bg-blue-100 text-blue-800">Volunteer</Badge>
                    </div>
                    <div className="text-center p-4 border border-border rounded-lg">
                      <Heart className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <h5 className="font-medium">Mutual Aid Network</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Contributing to community health mutual aid
                      </p>
                      <Badge className="mt-2 bg-purple-100 text-purple-800">Contributor</Badge>
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