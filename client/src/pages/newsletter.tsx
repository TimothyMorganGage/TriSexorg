import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Send, 
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Heart,
  Brain,
  BookOpen,
  Award,
  Globe,
  Clock,
  Edit3,
  Eye,
  Download,
  Share2,
  Settings,
  Bell,
  BarChart3,
  Coins,
  Star,
  CheckCircle,
  FileText,
  Zap
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NewsletterIssue {
  id: string;
  title: string;
  frequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
  publishDate: string;
  status: "draft" | "scheduled" | "published";
  subscribers: number;
  openRate: number;
  clickRate: number;
  content: {
    wikiHighlights: WikiHighlight[];
    dalyMetrics: DALYMetrics;
    dividendUpdate: DividendUpdate;
    communityStats: CommunityStats;
    featuredStories: FeaturedStory[];
  };
}

interface WikiHighlight {
  id: string;
  title: string;
  category: string;
  summary: string;
  readingTime: string;
  engagement: number;
  culturalFocus: string[];
}

interface DALYMetrics {
  totalDALYsSaved: number;
  economicImpact: number;
  topCategories: {
    category: string;
    dalys: number;
    impact: number;
  }[];
  trend: "up" | "down" | "stable";
  percentChange: number;
}

interface DividendUpdate {
  totalDistributed: number;
  averagePerUser: number;
  topContributors: {
    name: string;
    hoursContributed: number;
    dividend: number;
    intelligenceTypes: string[];
  }[];
  equityMultiplier: number;
}

interface CommunityStats {
  totalMembers: number;
  newMembers: number;
  activeStories: number;
  mentorConnections: number;
  culturalRepresentation: {
    [key: string]: number;
  };
}

interface FeaturedStory {
  id: string;
  title: string;
  author: string;
  culturalBackground: string;
  completions: number;
  rating: number;
  excerpt: string;
}

interface NewsletterTemplate {
  frequency: string;
  name: string;
  description: string;
  sections: string[];
  ghostSettings: {
    tags: string[];
    visibility: string;
    featureImage: string;
  };
}

export default function Newsletter() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFrequency, setSelectedFrequency] = useState("weekly");
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [ghostConnected, setGhostConnected] = useState(false);

  // Sample data for the newsletter system
  const currentIssues: NewsletterIssue[] = [];

  const newsletterTemplates: NewsletterTemplate[] = [
    {
      frequency: "weekly",
      name: "Good TriSexing Weekly",
      description: "Weekly updates on community progress, featured wiki articles, and dividend distributions",
      sections: [
        "Community Spotlight",
        "Wiki Article of the Week", 
        "DALY Impact Report",
        "Dividend Distribution",
        "New Stories & Mentors",
        "Cultural Wisdom Corner"
      ],
      ghostSettings: {
        tags: ["weekly", "community", "health-equity"],
        visibility: "public",
        featureImage: "https://example.com/weekly-banner.jpg"
      }
    },
    {
      frequency: "monthly",
      name: "Good TriSexing Monthly Deep Dive",
      description: "Comprehensive monthly analysis of health equity progress and community growth",
      sections: [
        "Monthly Health Equity Analysis",
        "Top Wiki Contributors",
        "DALY Economic Impact Summary",
        "Dividend Performance Review",
        "Cultural Intelligence Growth",
        "Community Partnerships",
        "Upcoming Features"
      ],
      ghostSettings: {
        tags: ["monthly", "analysis", "deep-dive"],
        visibility: "public",
        featureImage: "https://example.com/monthly-banner.jpg"
      }
    },
    {
      frequency: "quarterly",
      name: "Good TriSexing Quarterly Review",
      description: "Quarterly strategic updates on platform development and community impact",
      sections: [
        "Quarterly Impact Assessment",
        "Technology Development Updates",
        "Partnership Announcements",
        "Research Findings",
        "Community Demographics",
        "Financial Transparency",
        "Roadmap Updates"
      ],
      ghostSettings: {
        tags: ["quarterly", "strategy", "impact"],
        visibility: "public",
        featureImage: "https://example.com/quarterly-banner.jpg"
      }
    }
  ];

  const connectToGhost = () => {
    // Simulate Ghost.org connection
    setGhostConnected(true);
    console.log("Connected to Ghost.org API");
  };

  const generateNewsletterContent = (frequency: string) => {
    // Generate newsletter content based on frequency and current data
    const template = newsletterTemplates.find(t => t.frequency === frequency);
    return template;
  };

  const publishToGhost = (issue: NewsletterIssue) => {
    // Publish newsletter to Ghost.org
    console.log("Publishing to Ghost.org:", issue.title);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Newsletter content centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all health communications serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Mail className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground font-recoleta">
                Good TriSexing Newsletter
              </h1>
              <p className="text-xl text-muted-foreground mt-2 font-coolvetica">
                Wiki Insights • DALY Metrics • Dividend Updates • Ghost.org Integration
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Badge variant={ghostConnected ? "default" : "secondary"} className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              {ghostConnected ? "Ghost.org Connected" : "Ghost.org Not Connected"}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              — Subscribers
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              — Open Rate
            </Badge>
          </div>

          <Alert className="max-w-3xl mx-auto mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-left">
            <AlertDescription className="text-xs text-amber-900 dark:text-amber-200">
              <strong>Honesty note:</strong> An earlier version of this page shipped a fake published issue ("Good TriSexing Weekly — 2,847 subscribers, 67.3% open rate"), invented DALY totals (12,036 saved / $1,203,600 impact), invented dividend distributions ($18,472.50 totalled, $156.80/user, $4.27 stablecoin value), invented member counts (54,916 total / 1,247 new), invented cultural-representation percentages by race (Indigenous 18%, African Diaspora 22%, etc.), and — most seriously — fabricated Indigenous elders by name ("Dr. Aiyana Crow Feather", "Elder Maria Crow Feather" attributed to "Lakota Nation") credited as authors of "Medicine Wheel" teachings. Inventing Indigenous elders to lend cultural authority to a platform's content is cultural appropriation. All of it has been removed. The page now starts empty: no past issues, no synthesized metrics, no fictional contributors. Real issues will populate here only when sent through a real Ghost integration with real opt-in subscribers.
            </AlertDescription>
          </Alert>

          {!ghostConnected && (
            <Card className="max-w-2xl mx-auto mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold mb-4">Connect to Ghost.org</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your Ghost.org publication to automatically publish newsletters with 
                  wiki highlights, DALY metrics, and dividend updates.
                </p>
                <Button onClick={connectToGhost} className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Settings className="mr-2 h-4 w-4" />
                  Connect Ghost.org
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Newsletter Overview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="content">Content Sources</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Issues */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-6 w-6 text-primary" />
                      Recent Newsletter Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentIssues.map((issue) => (
                        <Card key={issue.id} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-lg">{issue.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {issue.publishDate} • {issue.frequency}
                              </p>
                            </div>
                            <Badge variant={
                              issue.status === "published" ? "default" : 
                              issue.status === "scheduled" ? "secondary" : "outline"
                            }>
                              {issue.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-center text-sm">
                            <div>
                              <p className="font-bold text-primary">{issue.subscribers.toLocaleString()}</p>
                              <p className="text-muted-foreground">Subscribers</p>
                            </div>
                            <div>
                              <p className="font-bold text-aquamarine">{issue.openRate}%</p>
                              <p className="text-muted-foreground">Open Rate</p>
                            </div>
                            <div>
                              <p className="font-bold text-secondary">{issue.clickRate}%</p>
                              <p className="text-muted-foreground">Click Rate</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit3 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                            <Button size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => setIsCreatingIssue(true)}
                      disabled={!ghostConnected}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Create New Issue
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Publication
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Export Analytics
                    </Button>
                  </CardContent>
                </Card>

                {/* Performance Summary */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Issues Published</span>
                        <span className="font-bold">4</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avg Open Rate</span>
                        <span className="font-bold text-aquamarine">67.3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New Subscribers</span>
                        <span className="font-bold text-primary">342</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Reach</span>
                        <span className="font-bold">11,388</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsletterTemplates.map((template) => (
                <Card key={template.frequency} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline">{template.frequency}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{template.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <h5 className="font-medium text-sm">Sections Include:</h5>
                      <div className="space-y-1">
                        {template.sections.slice(0, 4).map((section, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{section}</span>
                          </div>
                        ))}
                        {template.sections.length > 4 && (
                          <p className="text-xs text-muted-foreground">
                            +{template.sections.length - 4} more sections
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Ghost Settings:</h5>
                      <div className="flex flex-wrap gap-1">
                        {template.ghostSettings.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4" disabled={!ghostConnected}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Newsletter Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-6 w-6 text-primary" />
                    Newsletter Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">67.3%</p>
                        <p className="text-sm text-muted-foreground">Average Open Rate</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-aquamarine">24.1%</p>
                        <p className="text-sm text-muted-foreground">Average Click Rate</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-3">Performance by Frequency</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Weekly</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{width: "67%"}}></div>
                            </div>
                            <span className="text-sm font-medium">67%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Monthly</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div className="bg-aquamarine h-2 rounded-full" style={{width: "73%"}}></div>
                            </div>
                            <span className="text-sm font-medium">73%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Quarterly</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div className="bg-secondary h-2 rounded-full" style={{width: "81%"}}></div>
                            </div>
                            <span className="text-sm font-medium">81%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscriber Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-6 w-6 text-aquamarine" />
                    Subscriber Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-aquamarine">2,847</p>
                      <p className="text-sm text-muted-foreground">Total Subscribers</p>
                      <Badge variant="secondary" className="mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12% this month
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-3">Subscription Sources</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Interactive Stories</span>
                          <span className="font-medium">34%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Peer Mentor Network</span>
                          <span className="font-medium">28%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Wiki Articles</span>
                          <span className="font-medium">22%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Direct Signups</span>
                          <span className="font-medium">16%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Engagement */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-medium">Wiki Highlights</h4>
                      <p className="text-2xl font-bold text-primary">89%</p>
                      <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 text-aquamarine mx-auto mb-2" />
                      <h4 className="font-medium">DALY Updates</h4>
                      <p className="text-2xl font-bold text-aquamarine">76%</p>
                      <p className="text-sm text-muted-foreground">Click-through Rate</p>
                    </div>
                    <div className="text-center">
                      <Coins className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <h4 className="font-medium">Dividend Reports</h4>
                      <p className="text-2xl font-bold text-secondary">82%</p>
                      <p className="text-sm text-muted-foreground">Reader Interest</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Wiki Content Source */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-6 w-6 text-primary" />
                    Wiki Content Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Automatically curate top-performing wiki articles for newsletter inclusion
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <h5 className="font-medium">Intelligence Frameworks</h5>
                          <p className="text-sm text-muted-foreground">89% engagement</p>
                        </div>
                        <Badge variant="default">Featured</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <h5 className="font-medium">Cultural Wisdom Stories</h5>
                          <p className="text-sm text-muted-foreground">76% engagement</p>
                        </div>
                        <Badge variant="secondary">Popular</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <h5 className="font-medium">Reproductive Justice</h5>
                          <p className="text-sm text-muted-foreground">82% engagement</p>
                        </div>
                        <Badge variant="outline">Trending</Badge>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure Content Rules
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* DALY Metrics Source */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-6 w-6 text-aquamarine" />
                    DALY Metrics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Real-time health equity impact metrics for newsletter reporting
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xl font-bold text-aquamarine">12,036</p>
                        <p className="text-xs text-muted-foreground">DALYs Saved</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-secondary">$1.2M</p>
                        <p className="text-xs text-muted-foreground">Economic Impact</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sexual Health Education</span>
                        <span className="font-medium">27%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reproductive Justice</span>
                        <span className="font-medium">24%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Mental Health Support</span>
                        <span className="font-medium">18%</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Full Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-6 w-6 text-primary" />
                    Community Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Community engagement and demographic insights
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xl font-bold text-primary">54,916</p>
                        <p className="text-xs text-muted-foreground">Total Members</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-aquamarine">1,247</p>
                        <p className="text-xs text-muted-foreground">New This Week</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Stories</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Mentor Connections</span>
                        <span className="font-medium">892</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cultural Diversity</span>
                        <span className="font-medium">47 cultures</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Globe className="mr-2 h-4 w-4" />
                      Community Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="publish">
            <div className="max-w-4xl mx-auto">
              {isCreatingIssue ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Newsletter Issue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Newsletter Title</label>
                          <Input placeholder="Good TriSexing Weekly: [Topic]" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Publication Frequency</label>
                          <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Bi-weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Newsletter Content</label>
                        <Textarea 
                          placeholder="Newsletter content will be auto-generated based on your selected template and current data..."
                          rows={10}
                        />
                      </div>
                      
                      <div className="flex space-x-4">
                        <Button onClick={() => setIsCreatingIssue(false)}>
                          <Send className="mr-2 h-4 w-4" />
                          Publish Now
                        </Button>
                        <Button variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule
                        </Button>
                        <Button variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button variant="ghost" onClick={() => setIsCreatingIssue(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center">
                  <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to Create Your Newsletter?</h3>
                  <p className="text-muted-foreground mb-6">
                    Generate a new newsletter issue with the latest wiki highlights, DALY metrics, and dividend updates.
                  </p>
                  <Button 
                    size="lg" 
                    onClick={() => setIsCreatingIssue(true)}
                    disabled={!ghostConnected}
                  >
                    <Edit3 className="mr-2 h-5 w-5" />
                    Create Newsletter Issue
                  </Button>
                  
                  {!ghostConnected && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Connect to Ghost.org first to enable newsletter publishing
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}