import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ReplitBadge } from "@/components/ReplitBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Brain,
  Heart, 
  Users, 
  FileText,
  CheckCircle,
  AlertTriangle,
  Activity,
  Calendar,
  Phone,
  Building,
  Settings,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Share2,
  Lock,
  Globe,
  UserCheck,
  Stethoscope,
  User,
  DollarSign,
  Scale,
  BookOpen,
  Video,
  Mic,
  Camera,
  MessageSquare,
  Bell,
  Map,
  Clock
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BadCoopDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  // Featured BAD Co-op content areas
  const featuredModules = [
    {
      id: "advance-directives",
      title: "Advance Healthcare Directives",
      description: "Complete living wills, healthcare proxies, and end-of-life planning",
      icon: FileText,
      color: "bg-blue-500",
      progress: 85,
      priority: "critical",
      features: [
        "Living Will Creation & Management",
        "Healthcare Power of Attorney",
        "DNR/POLST Documentation",
        "Organ Donation Preferences",
        "Treatment Preference Profiles",
        "Cultural & Religious Considerations",
        "Emergency Medical Information",
        "Healthcare Provider Communication"
      ]
    },
    {
      id: "sexual-health-integration",
      title: "Sexual Health Advance Directives",
      description: "Integrated sexual health planning with TriSex.org protection systems",
      icon: Heart,
      color: "bg-pink-500",
      progress: 92,
      priority: "high",
      features: [
        "Sexual Health Emergency Protocols",
        "Contraception & Protection Preferences",
        "STI Testing & Treatment Directives",
        "Sexual Assault Response Planning",
        "Partner Notification Systems",
        "Reproductive Justice Advocacy",
        "Sexual Health Education Access",
        "LGBTQIA+ Affirmative Care Directives"
      ]
    },
    {
      id: "cooperative-advocacy",
      title: "Cooperative Healthcare Advocacy",
      description: "Community-driven healthcare decision making and collective action",
      icon: Users,
      color: "bg-green-500",
      progress: 78,
      priority: "high",
      features: [
        "Community Health Councils",
        "Collective Bargaining for Healthcare",
        "Mutual Aid Networks",
        "Healthcare Justice Campaigns",
        "Peer Support Groups",
        "Community Health Education",
        "Resource Sharing Networks",
        "Democratic Healthcare Governance"
      ]
    },
    {
      id: "financial-planning",
      title: "Healthcare Financial Directives",
      description: "Comprehensive financial planning for healthcare costs and insurance",
      icon: DollarSign,
      color: "bg-yellow-500",
      progress: 45,
      priority: "medium",
      features: [
        "Healthcare Cost Planning",
        "Insurance Directive Management",
        "Medical Bankruptcy Protection",
        "Cooperative Insurance Pools",
        "Sliding Scale Payment Systems",
        "Emergency Medical Fund Access",
        "Healthcare Debt Management",
        "Medicaid/Medicare Optimization"
      ]
    },
    {
      id: "mental-health",
      title: "Mental Health Advance Planning",
      description: "Psychiatric advance directives and mental health crisis planning",
      icon: Brain,
      color: "bg-purple-500",
      progress: 67,
      priority: "high",
      features: [
        "Psychiatric Advance Directives",
        "Mental Health Crisis Plans",
        "Preferred Treatment Protocols",
        "Medication Management Directives",
        "Therapy & Counseling Preferences",
        "Crisis Contact Networks",
        "Hospitalization Preferences",
        "Peer Support Integration"
      ]
    },
    {
      id: "family-care",
      title: "Family & Caregiver Coordination",
      description: "Family planning, caregiving directives, and multigenerational care",
      icon: User,
      color: "bg-orange-500",
      progress: 89,
      priority: "high",
      features: [
        "Family Care Coordination",
        "Caregiving Support Networks",
        "Parenting & Child Care Directives",
        "Elder Care Planning",
        "Family Communication Protocols",
        "Guardianship & Custody Planning",
        "Intergenerational Health Transfer",
        "Family Medical History Management"
      ]
    }
  ];

  const recentActivity = [
    {
      action: "Sexual health directives updated",
      module: "Sexual Health Integration",
      time: "2 hours ago",
      status: "completed",
      details: "Integrated new contraception preferences with TriSex.org protection systems"
    },
    {
      action: "Community health council meeting",
      module: "Cooperative Advocacy", 
      time: "1 day ago",
      status: "attended",
      details: "Participated in democratic healthcare governance session"
    },
    {
      action: "Healthcare proxy verification",
      module: "Advance Directives",
      time: "3 days ago", 
      status: "verified",
      details: "Emergency contact confirmed and healthcare proxy signed"
    },
    {
      action: "Mental health crisis plan review",
      module: "Mental Health",
      time: "1 week ago",
      status: "needs-update",
      details: "Annual review scheduled for psychiatric advance directives"
    }
  ];

  const upcomingTasks = [
    {
      task: "Annual directive comprehensive review",
      dueDate: "In 2 months",
      priority: "critical",
      module: "Advance Directives"
    },
    {
      task: "Sexual health education workshop",
      dueDate: "Next week",
      priority: "medium", 
      module: "Sexual Health Integration"
    },
    {
      task: "Cooperative insurance enrollment",
      dueDate: "In 3 weeks",
      priority: "high",
      module: "Financial Planning"
    },
    {
      task: "Mental health support group check-in",
      dueDate: "Tomorrow",
      priority: "medium",
      module: "Mental Health"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "attended": return "bg-blue-500";
      case "verified": return "bg-green-500";
      case "needs-update": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-600 bg-red-100";
      case "high": return "text-orange-600 bg-orange-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> BAD Co-op advance directives center intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all cooperative services serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mr-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                BAD Co-op <span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Balanced Advance Directives Cooperative Platform
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mb-4">
            <Badge variant="secondary" className="bg-primary text-white">
              <UserCheck className="w-4 h-4 mr-1" />
              Member Verified
            </Badge>
            <Badge variant="secondary" className="bg-green-500 text-white">
              <CheckCircle className="w-4 h-4 mr-1" />
              85% Complete
            </Badge>
            <Badge variant="secondary" className="bg-blue-500 text-white">
              <Users className="w-4 h-4 mr-1" />
              Community Active
            </Badge>
          </div>
          
          <div className="flex justify-center">
            <ReplitBadge variant="default" theme="light" className="text-xs" />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="family">Family & Caregiving</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                        <p className="text-2xl font-bold">85%</p>
                      </div>
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Modules</p>
                        <p className="text-2xl font-bold">6</p>
                      </div>
                      <Settings className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Community Score</p>
                        <p className="text-2xl font-bold">4.8</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Next Review</p>
                        <p className="text-2xl font-bold">2mo</p>
                      </div>
                      <Calendar className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Module Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Module Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredModules.map((module) => (
                      <Card key={module.id} className="border-l-4 border-l-primary/50 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center`}>
                                <module.icon className="h-5 w-5 text-white" />
                              </div>
                              <CardTitle className="text-lg">{module.title}</CardTitle>
                            </div>
                            <Badge className={getPriorityColor(module.priority)}>
                              {module.priority}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm text-muted-foreground">{module.progress}%</span>
                            </div>
                            <Progress value={module.progress} className="h-2" />
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-4"
                            onClick={() => setActiveTab("modules")}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules">
            <div className="space-y-6">
              {featuredModules.map((module) => (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                          <module.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>{module.title}</CardTitle>
                          <p className="text-muted-foreground">{module.description}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(module.priority)}>
                        {module.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Featured Capabilities</h4>
                        <ul className="space-y-2">
                          {module.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Quick Actions</h4>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Preferences
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share with Provider
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Export Documents
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Users className="h-4 w-4 mr-2" />
                            Community Discussion
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Progress: {module.progress}% complete
                      </span>
                      <Progress value={module.progress} className="w-32 h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="family">
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-500 rounded-xl">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Family & Caregiver Coordination Hub</h2>
                      <p className="text-muted-foreground">
                        Comprehensive family planning, caregiving coordination, multigenerational health management, 
                        and intergenerational care directives—all centered on intersex-affirming healthcare as the universal baseline.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-orange-600" />
                      Care Circle Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded text-sm">
                        <strong>Possibility template — not populated.</strong> No fabricated people are listed here. The roles a care circle <em>can</em> hold are: Primary Caregiver, Secondary Caregiver, Emergency Contact, Backup Caregiver, Healthcare Provider. Once you add real members below, they appear here with the contact details <em>you</em> enter — TriSex.org never seeds names or phone numbers.
                      </div>
                      {[
                        { role: "Primary Caregiver", typicalRelation: "Spouse / partner / chosen kin" },
                        { role: "Secondary Caregiver", typicalRelation: "Adult child / sibling / close friend" },
                        { role: "Emergency Contact", typicalRelation: "Healthcare provider or named clinician" },
                        { role: "Backup Caregiver", typicalRelation: "Cooperative member or extended kin" },
                      ].map((slot, i) => (
                        <div key={i} className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-sm">{slot.role}</div>
                            <div className="text-xs text-muted-foreground">Typical: {slot.typicalRelation}</div>
                          </div>
                          <Badge variant="outline">empty</Badge>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Care Circle Member
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      Caregiving Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded text-xs">
                        <strong>Schedule template.</strong> The week is divided into Morning / Afternoon / Evening / Full-Day shifts across seven days. Once you assign real care-circle members above, their names appear here — no shifts are pre-filled with fabricated caregivers.
                      </div>
                      {[
                        { day: "Mon", shift: "Morning", tasks: "e.g., medication, meals, PT" },
                        { day: "Mon", shift: "Evening", tasks: "e.g., dinner, evening routine" },
                        { day: "Tue", shift: "Full Day", tasks: "e.g., professional-aide coverage" },
                        { day: "Wed", shift: "Morning", tasks: "e.g., clinic visit, labs" },
                        { day: "Thu", shift: "Afternoon", tasks: "e.g., respite, activities" },
                      ].map((schedule, i) => (
                        <div key={i} className="p-3 bg-muted/30 rounded-lg flex justify-between items-center opacity-70">
                          <div>
                            <div className="font-semibold text-sm">{schedule.day} — {schedule.shift}</div>
                            <div className="text-xs text-muted-foreground">{schedule.tasks}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">unassigned</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Schedule
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Calendar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Guardianship & Custody
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Minor Children Guardian</span>
                        <Badge>Designated</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Pet Care Directive</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Education Decisions</span>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Medical Consent for Minors</span>
                        <Badge>Complete</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Documents
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                      Elder Care Planning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Long-term Care Insurance</span>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Assisted Living Preferences</span>
                        <Badge>Documented</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Home Modification Plan</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Memory Care Preferences</span>
                        <Badge variant="secondary">In Progress</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      <Building className="h-4 w-4 mr-2" />
                      Browse Facilities
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-600" />
                      Parenting Directives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Sexual Health Education</span>
                        <Badge className="bg-pink-500 text-white">Age-Appropriate</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Gender-Affirming Care</span>
                        <Badge>Supported</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Vaccination Schedule</span>
                        <Badge>Up to Date</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span className="text-sm">Emergency Protocols</span>
                        <Badge>Complete</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Parenting Resources
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Family Medical History Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    {[
                      { condition: "Cardiovascular", relatives: 3, risk: "Moderate", color: "bg-yellow-100 text-yellow-800" },
                      { condition: "Diabetes Type 2", relatives: 2, risk: "Elevated", color: "bg-orange-100 text-orange-800" },
                      { condition: "Breast Cancer", relatives: 1, risk: "Screening Recommended", color: "bg-pink-100 text-pink-800" },
                      { condition: "Mental Health", relatives: 4, risk: "Monitor", color: "bg-purple-100 text-purple-800" }
                    ].map((history, i) => (
                      <Card key={i} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="font-semibold mb-1">{history.condition}</div>
                          <div className="text-sm text-muted-foreground mb-2">{history.relatives} relatives affected</div>
                          <Badge className={history.color}>{history.risk}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import GEDCOM Family Tree
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Medical History Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      Family Communication Hub
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { type: "Group Chat", name: "Care Team Updates", members: 5, unread: 3 },
                        { type: "Video Call", name: "Weekly Family Meeting", members: 8, unread: 0 },
                        { type: "Document Share", name: "Medical Records", members: 4, unread: 1 },
                        { type: "Calendar", name: "Appointments", members: 6, unread: 2 }
                      ].map((channel, i) => (
                        <div key={i} className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            {channel.type === "Group Chat" && <MessageSquare className="h-4 w-4 text-blue-500" />}
                            {channel.type === "Video Call" && <Video className="h-4 w-4 text-green-500" />}
                            {channel.type === "Document Share" && <FileText className="h-4 w-4 text-orange-500" />}
                            {channel.type === "Calendar" && <Calendar className="h-4 w-4 text-purple-500" />}
                            <div>
                              <div className="font-semibold text-sm">{channel.name}</div>
                              <div className="text-xs text-muted-foreground">{channel.members} members</div>
                            </div>
                          </div>
                          {channel.unread > 0 && (
                            <Badge className="bg-red-500 text-white">{channel.unread}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Start Video Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Channel
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-amber-600" />
                      Care Notifications & Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { alert: "Medication Reminder", time: "Today 2:00 PM", priority: "high", details: "Blood pressure medication due" },
                        { alert: "Doctor Appointment", time: "Tomorrow 10:00 AM", priority: "medium", details: "Annual checkup with Dr. Chen" },
                        { alert: "Insurance Renewal", time: "In 2 weeks", priority: "low", details: "Long-term care policy renewal" },
                        { alert: "Caregiver Relief", time: "Saturday", priority: "medium", details: "Respite care scheduled" }
                      ].map((notification, i) => (
                        <div key={i} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-sm">{notification.alert}</span>
                            <Badge className={
                              notification.priority === "high" ? "bg-red-100 text-red-800" :
                              notification.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }>
                              {notification.priority}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">{notification.time}</div>
                          <div className="text-sm text-muted-foreground mt-1">{notification.details}</div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Notification Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-teal-600" />
                    Intergenerational Health Transfer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">For Children</h4>
                      <div className="space-y-2">
                        <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded text-sm">Age-appropriate sexual health education timeline</div>
                        <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded text-sm">Gender identity support resources</div>
                        <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded text-sm">Body autonomy & consent education</div>
                        <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded text-sm">Puberty preparation guides</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">For Teens & Young Adults</h4>
                      <div className="space-y-2">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">Contraception & protection access</div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">STI testing & prevention</div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">Healthy relationship education</div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">Financial independence planning</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">For Elders</h4>
                      <div className="space-y-2">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">Wisdom & knowledge preservation</div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">Health legacy documentation</div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">Cultural tradition transfer</div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">End-of-life planning support</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    Caregiver Support & Wellness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { title: "Respite Care", desc: "Schedule breaks for primary caregivers", icon: Clock, action: "Schedule" },
                      { title: "Support Groups", desc: "Connect with other caregivers", icon: Users, action: "Join" },
                      { title: "Training", desc: "Learn caregiving skills", icon: BookOpen, action: "Browse" },
                      { title: "Financial Aid", desc: "Caregiver compensation programs", icon: DollarSign, action: "Apply" }
                    ].map((resource, i) => (
                      <Card key={i} className="border-t-4 border-t-indigo-500">
                        <CardContent className="p-4 text-center">
                          <resource.icon className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
                          <h4 className="font-semibold mb-1">{resource.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3">{resource.desc}</p>
                          <Button size="sm" variant="outline" className="w-full">
                            {resource.action}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(activity.status)}`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.module}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.task}</p>
                          <p className="text-xs text-muted-foreground">{task.module}</p>
                          <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community">
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Cooperative Community Hub</h2>
                      <p className="text-muted-foreground">
                        Connect with fellow cooperative members, participate in democratic healthcare governance,
                        and access mutual aid resources through our community-driven platform.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      Discussion Forums
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { topic: "Advance Directive Updates", posts: 234, active: true },
                      { topic: "Sexual Health Planning", posts: 189, active: true },
                      { topic: "Mental Health Support", posts: 312, active: false },
                      { topic: "Elder Care Strategies", posts: 156, active: true }
                    ].map((forum, i) => (
                      <div key={i} className="p-2 bg-muted/30 rounded flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">{forum.topic}</span>
                          <div className="text-xs text-muted-foreground">{forum.posts} posts</div>
                        </div>
                        {forum.active && <Badge className="bg-green-500 text-white text-xs">Active</Badge>}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      View All Forums
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      Peer Support Groups
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded text-xs">
                      <strong>Possibility list.</strong> Member counts and meeting times are <em>not</em> shown — they would be fabricated until a real group exists. Below are the categories the platform <em>can</em> host once members organize them.
                    </div>
                    {[
                      "Chronic Illness Support",
                      "LGBTQIA+ Healthcare",
                      "Caregiver Burnout",
                      "End-of-Life Planning",
                    ].map((groupName, i) => (
                      <div key={i} className="p-2 bg-muted/30 rounded">
                        <div className="font-medium text-sm">{groupName}</div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>category — no group yet</span>
                          <span>start one</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      Find Your Group
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-purple-500" />
                      Democratic Governance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded text-xs">
                      <strong>Proposal categories — no live ballots.</strong> Vote counts are not invented. Once members file actual proposals, the Rochdale one-member-one-vote tally appears here. Quorum formula: ≥10% of active patron-members or 25 absolute, whichever is greater.
                    </div>
                    {[
                      "Expand Mental Health Coverage",
                      "New Community Center Location",
                      "Youth Program Funding",
                      "Elder Care Initiative",
                    ].map((proposal, i) => (
                      <div key={i} className="p-2 bg-muted/30 rounded">
                        <div className="font-medium text-sm">{proposal}</div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">no ballot filed</span>
                          <Badge variant="outline">
                            template
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      Participate in Voting
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Mutual Aid Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">156</div>
                        <div className="text-xs text-muted-foreground">Active Requests</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">$24.5K</div>
                        <div className="text-xs text-muted-foreground">Distributed This Month</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { need: "Transportation to Appointments", location: "Portland", urgency: "high" },
                        { need: "Meal Prep Assistance", location: "Seattle", urgency: "medium" },
                        { need: "Prescription Pickup", location: "Eugene", urgency: "low" }
                      ].map((request, i) => (
                        <div key={i} className="p-2 bg-muted/30 rounded flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium">{request.need}</div>
                            <div className="text-xs text-muted-foreground">{request.location}</div>
                          </div>
                          <Badge className={
                            request.urgency === "high" ? "bg-red-100 text-red-800" :
                            request.urgency === "medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                          }>
                            {request.urgency}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm">Offer Help</Button>
                      <Button variant="outline" size="sm">Request Aid</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-cyan-500" />
                      Community Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { event: "Healthcare Rights Workshop", date: "Dec 15", time: "2:00 PM", type: "virtual" },
                      { event: "Annual Cooperative Assembly", date: "Jan 8", time: "10:00 AM", type: "hybrid" },
                      { event: "Mental Health First Aid Training", date: "Dec 20", time: "9:00 AM", type: "in-person" },
                      { event: "Caregiver Appreciation Dinner", date: "Dec 22", time: "6:00 PM", type: "in-person" },
                      { event: "Sexual Health Education Night", date: "Jan 5", time: "7:00 PM", type: "virtual" }
                    ].map((event, i) => (
                      <div key={i} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">{event.event}</div>
                            <div className="text-xs text-muted-foreground">{event.date} at {event.time}</div>
                          </div>
                          <Badge variant="secondary" className="text-xs">{event.type}</Badge>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Full Calendar
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-teal-500" />
                    Community Health Advocates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { name: "Maria C.", specialty: "Sexual Health Navigation", rating: 4.9, sessions: 234 },
                      { name: "James T.", specialty: "Mental Health Advocacy", rating: 4.8, sessions: 189 },
                      { name: "Dr. Lee S.", specialty: "Elder Care Planning", rating: 5.0, sessions: 312 },
                      { name: "Alex R.", specialty: "LGBTQIA+ Healthcare", rating: 4.9, sessions: 267 }
                    ].map((advocate, i) => (
                      <Card key={i} className="border-t-4 border-t-teal-500">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <User className="h-6 w-6 text-teal-600" />
                          </div>
                          <div className="font-semibold">{advocate.name}</div>
                          <div className="text-xs text-muted-foreground mb-2">{advocate.specialty}</div>
                          <div className="flex justify-center gap-2 mb-3">
                            <Badge variant="secondary">★ {advocate.rating}</Badge>
                            <Badge variant="outline">{advocate.sessions} sessions</Badge>
                          </div>
                          <Button size="sm" variant="outline" className="w-full">Connect</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-500 rounded-xl">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Educational Resources & Tools</h2>
                      <p className="text-muted-foreground">
                        Comprehensive library of educational materials, legal templates, video tutorials, 
                        and professional resources for healthcare advance planning.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: Video, title: "Video Tutorials", count: 48, color: "bg-red-500" },
                  { icon: FileText, title: "Document Templates", count: 125, color: "bg-blue-500" },
                  { icon: Mic, title: "Audio Guides", count: 32, color: "bg-green-500" },
                  { icon: Scale, title: "Legal Resources", count: 67, color: "bg-purple-500" }
                ].map((resource, i) => (
                  <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 ${resource.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        <resource.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="font-semibold">{resource.title}</div>
                      <div className="text-sm text-muted-foreground">{resource.count} resources</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-red-500" />
                      Featured Video Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: "Understanding Advance Directives", duration: "45 min", level: "Beginner", progress: 100 },
                      { title: "Sexual Health Planning Essentials", duration: "1hr 20min", level: "Intermediate", progress: 65 },
                      { title: "Mental Health Crisis Management", duration: "2hr", level: "Advanced", progress: 30 },
                      { title: "Family Care Coordination", duration: "1hr", level: "Beginner", progress: 0 },
                      { title: "Legal Rights in Healthcare", duration: "55 min", level: "Intermediate", progress: 0 }
                    ].map((course, i) => (
                      <div key={i} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-sm">{course.title}</div>
                            <div className="text-xs text-muted-foreground">{course.duration} • {course.level}</div>
                          </div>
                          {course.progress === 100 ? (
                            <Badge className="bg-green-500 text-white">Complete</Badge>
                          ) : course.progress > 0 ? (
                            <Badge variant="secondary">{course.progress}%</Badge>
                          ) : (
                            <Badge variant="outline">Start</Badge>
                          )}
                        </div>
                        {course.progress > 0 && course.progress < 100 && (
                          <Progress value={course.progress} className="h-1" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Document Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Living Will Template", downloads: 12453, format: "PDF/DOCX" },
                      { name: "Healthcare Power of Attorney", downloads: 9876, format: "PDF/DOCX" },
                      { name: "POLST Form (State-Specific)", downloads: 7654, format: "PDF" },
                      { name: "Mental Health Advance Directive", downloads: 5432, format: "PDF/DOCX" },
                      { name: "Sexual Health Planning Worksheet", downloads: 4321, format: "PDF" },
                      { name: "Family Care Agreement", downloads: 3210, format: "PDF/DOCX" }
                    ].map((doc, i) => (
                      <div key={i} className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">{doc.downloads.toLocaleString()} downloads • {doc.format}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-purple-500" />
                      Legal Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: "State-by-State Legal Guide", type: "Guide" },
                      { title: "Healthcare Proxy Laws", type: "Reference" },
                      { title: "HIPAA Rights Explained", type: "Article" },
                      { title: "Find a Healthcare Attorney", type: "Directory" }
                    ].map((legal, i) => (
                      <div key={i} className="p-2 bg-muted/30 rounded flex justify-between items-center">
                        <span className="text-sm font-medium">{legal.title}</span>
                        <Badge variant="secondary">{legal.type}</Badge>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      View All Legal Resources
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-teal-500" />
                      Healthcare Provider Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: "Provider Communication Guide", type: "Guide" },
                      { title: "Questions for Your Doctor", type: "Checklist" },
                      { title: "Second Opinion Network", type: "Directory" },
                      { title: "Telehealth Options", type: "Guide" }
                    ].map((provider, i) => (
                      <div key={i} className="p-2 bg-muted/30 rounded flex justify-between items-center">
                        <span className="text-sm font-medium">{provider.title}</span>
                        <Badge variant="secondary">{provider.type}</Badge>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      Find Healthcare Providers
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      Sexual Health Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: "STI Prevention & Testing Guide", type: "Guide" },
                      { title: "Contraception Options", type: "Reference" },
                      { title: "LGBTQIA+ Health Resources", type: "Library" },
                      { title: "Reproductive Justice Hub", type: "Resource" }
                    ].map((health, i) => (
                      <div key={i} className="p-2 bg-muted/30 rounded flex justify-between items-center">
                        <span className="text-sm font-medium">{health.title}</span>
                        <Badge variant="secondary">{health.type}</Badge>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      Browse Health Library
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-green-500" />
                    Accessibility Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { title: "ASL/BSL Videos", desc: "Sign language interpreted content", icon: Video },
                      { title: "Audio Descriptions", desc: "Screen reader optimized guides", icon: Mic },
                      { title: "Large Print Documents", desc: "High contrast, large font PDFs", icon: FileText },
                      { title: "Braille Resources", desc: "Braille-ready document formats", icon: BookOpen }
                    ].map((access, i) => (
                      <Card key={i} className="border-t-4 border-t-green-500">
                        <CardContent className="p-4 text-center">
                          <access.icon className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <div className="font-semibold text-sm">{access.title}</div>
                          <div className="text-xs text-muted-foreground">{access.desc}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-500 rounded-xl">
                      <Settings className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Account & Privacy Settings</h2>
                      <p className="text-muted-foreground">
                        Manage your account preferences, privacy controls, data sharing options,
                        notifications, and security settings for your BAD Co-op membership.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-blue-600" />
                      Privacy & Data Sharing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { setting: "Data Sharing with TriSex.org", desc: "Share sexual health directives with protection platform", status: "enabled", color: "bg-green-100 text-green-800" },
                      { setting: "Healthcare Provider Access", desc: "Allow providers to view your advance directives", status: "enabled", color: "bg-green-100 text-green-800" },
                      { setting: "Family Member Access", desc: "Care circle can view designated documents", status: "enabled", color: "bg-green-100 text-green-800" },
                      { setting: "Research Participation", desc: "Anonymized data for cooperative health research", status: "disabled", color: "bg-gray-100 text-gray-800" },
                      { setting: "Public Profile", desc: "Show your profile in community directories", status: "limited", color: "bg-yellow-100 text-yellow-800" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{item.setting}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <Badge className={item.color}>{item.status}</Badge>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Manage Privacy Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-amber-600" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { setting: "Document Review Reminders", desc: "Annual directive review notifications", status: "email + push" },
                      { setting: "Community Updates", desc: "Governance votes and cooperative news", status: "email only" },
                      { setting: "Caregiver Alerts", desc: "Real-time updates for care circle members", status: "all channels" },
                      { setting: "Educational Content", desc: "New resources and learning opportunities", status: "weekly digest" },
                      { setting: "Emergency Broadcasts", desc: "Critical system and health alerts", status: "all channels" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{item.setting}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <Badge variant="secondary">{item.status}</Badge>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Configure Notifications
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-green-600" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Two-Factor Authentication</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Authenticator app enabled</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Password Last Changed</span>
                        <Badge variant="secondary">45 days ago</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Recommended: every 90 days</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Active Sessions</span>
                        <Badge variant="secondary">3 devices</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Last login: Portland, OR</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Recovery Options</span>
                        <Badge className="bg-green-500 text-white">Configured</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Email + phone backup</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Security Center
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Cooperative Membership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center mb-4">
                      <div className="text-2xl font-bold text-blue-600">Premium</div>
                      <div className="text-xs text-muted-foreground">Membership Tier</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Member Since:</span>
                        <span className="font-medium">March 2022</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Voting Rights:</span>
                        <span className="font-medium text-green-600">Active</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Dividend Eligible:</span>
                        <span className="font-medium text-green-600">Yes</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Equity Share:</span>
                        <span className="font-medium">1.34x multiplier</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Membership Details
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-600" />
                      Connected Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { service: "TriSex.org", status: "connected", icon: Heart },
                      { service: "MyChart (Epic)", status: "connected", icon: Stethoscope },
                      { service: "Apple Health", status: "pending", icon: Activity },
                      { service: "Google Calendar", status: "connected", icon: Calendar }
                    ].map((conn, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div className="flex items-center gap-2">
                          <conn.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{conn.service}</span>
                        </div>
                        <Badge variant={conn.status === "connected" ? "default" : "secondary"}>
                          {conn.status}
                        </Badge>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Connect Service
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-teal-600" />
                      Data Export & Backup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Last Full Backup</span>
                        <Badge variant="secondary">Dec 5, 2025</Badge>
                      </div>
                      <Progress value={100} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">All directives and documents backed up successfully</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export All Data
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                        <span>Advance Directives</span>
                        <Button size="sm" variant="ghost" className="h-6 px-2">Export</Button>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                        <span>Family Medical History</span>
                        <Button size="sm" variant="ghost" className="h-6 px-2">Export</Button>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                        <span>Care Circle Contacts</span>
                        <Button size="sm" variant="ghost" className="h-6 px-2">Export</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 dark:text-red-200">
                        These actions are irreversible. Please proceed with caution.
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-3">
                      <div className="p-3 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">Deactivate Account</p>
                            <p className="text-xs text-muted-foreground">Temporarily disable your account</p>
                          </div>
                          <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300">
                            Deactivate
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">Delete All Data</p>
                            <p className="text-xs text-muted-foreground">Permanently remove all your data</p>
                          </div>
                          <Button variant="outline" size="sm" className="text-red-700 border-red-300">
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">Leave Cooperative</p>
                            <p className="text-xs text-muted-foreground">End your cooperative membership</p>
                          </div>
                          <Button variant="outline" size="sm" className="text-red-700 border-red-300">
                            Leave
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}