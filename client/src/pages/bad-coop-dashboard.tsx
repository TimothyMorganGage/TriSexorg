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
  Shield, 
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
        <Alert className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
          <Heart className="h-5 w-5 text-purple-600" />
          <AlertDescription className="ml-2">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> BAD Co-op advance directives center intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all cooperative services serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mr-4">
              <Shield className="h-8 w-8 text-white" />
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
                      {[
                        { name: "Primary Caregiver", person: "Sarah M.", role: "Spouse/Partner", status: "active", contact: "+1 (503) 555-0123" },
                        { name: "Secondary Caregiver", person: "Michael T.", role: "Adult Child", status: "active", contact: "+1 (503) 555-0124" },
                        { name: "Emergency Contact", person: "Dr. Rebecca L.", role: "Healthcare Provider", status: "verified", contact: "+1 (503) 555-0125" },
                        { name: "Backup Caregiver", person: "James W.", role: "Sibling", status: "pending", contact: "+1 (503) 555-0126" }
                      ].map((member, i) => (
                        <div key={i} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-semibold">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.person} • {member.role}</div>
                            </div>
                            <Badge variant={member.status === "active" ? "default" : member.status === "verified" ? "secondary" : "outline"}>
                              {member.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{member.contact}</span>
                          </div>
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
                      {[
                        { day: "Monday", shift: "Morning", caregiver: "Sarah M.", tasks: "Medication, Meals, PT" },
                        { day: "Monday", shift: "Evening", caregiver: "Michael T.", tasks: "Dinner, Evening routine" },
                        { day: "Tuesday", shift: "Full Day", caregiver: "Professional Aide", tasks: "Full care coverage" },
                        { day: "Wednesday", shift: "Morning", caregiver: "Sarah M.", tasks: "Doctor visit, Labs" },
                        { day: "Thursday", shift: "Afternoon", caregiver: "James W.", tasks: "Respite, Activities" }
                      ].map((schedule, i) => (
                        <div key={i} className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-sm">{schedule.day} - {schedule.shift}</div>
                            <div className="text-xs text-muted-foreground">{schedule.caregiver}</div>
                          </div>
                          <Badge variant="secondary" className="text-xs">{schedule.tasks}</Badge>
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
              <Card>
                <CardHeader>
                  <CardTitle>Community Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          <h4 className="font-semibold">Discussion Forums</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Connect with community members on healthcare topics
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Join Discussions
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Users className="h-5 w-5 text-green-500" />
                          <h4 className="font-semibold">Peer Support Groups</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Find support groups for specific health conditions
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Find Groups
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <BookOpen className="h-5 w-5 text-purple-500" />
                          <h4 className="font-semibold">Educational Resources</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Access community-created educational content
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Browse Resources
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Educational Resources & Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col justify-center">
                      <Video className="h-6 w-6 mb-2" />
                      <span className="text-sm">Video Tutorials</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col justify-center">
                      <FileText className="h-6 w-6 mb-2" />
                      <span className="text-sm">Document Templates</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col justify-center">
                      <Mic className="h-6 w-6 mb-2" />
                      <span className="text-sm">Audio Guides</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col justify-center">
                      <Scale className="h-6 w-6 mb-2" />
                      <span className="text-sm">Legal Information</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account & Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Sharing with TriSex.org</p>
                        <p className="text-sm text-muted-foreground">Share sexual health directives with protection platform</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Community Participation</p>
                        <p className="text-sm text-muted-foreground">Participate in cooperative governance and discussions</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Users className="h-4 w-4 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Emergency Contact Verification</p>
                        <p className="text-sm text-muted-foreground">Regular verification of emergency contacts</p>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Clock className="h-4 w-4 mr-1" />
                        Due Soon
                      </Badge>
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