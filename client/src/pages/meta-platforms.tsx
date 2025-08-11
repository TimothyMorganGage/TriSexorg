import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  MessageCircle, 
  Phone, 
  Camera, 
  Hash,
  Users, 
  Heart, 
  Share2,
  Eye,
  TrendingUp,
  Settings,
  Bell,
  ExternalLink,
  CheckCircle,
  Target
} from "lucide-react";

interface MetaPlatformStats {
  platform: string;
  followers: number;
  posts: number;
  engagement: number;
  reach: number;
  icon: any;
  color: string;
  primaryFeature: string;
}

interface ContentPost {
  id: string;
  platform: "facebook" | "instagram" | "whatsapp" | "threads";
  content: string;
  mediaType?: "image" | "video" | "carousel" | "story";
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  timestamp: string;
  hashtags: string[];
  audience: string;
}

export default function MetaPlatforms() {
  const [activeTab, setActiveTab] = useState("overview");
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram", "facebook"]);

  const metaPlatformStats: MetaPlatformStats[] = [
    {
      platform: "Facebook",
      followers: 47382,
      posts: 328,
      engagement: 6.4,
      reach: 234891,
      icon: MessageCircle,
      color: "bg-blue-600",
      primaryFeature: "Community Building"
    },
    {
      platform: "Instagram",
      followers: 89234,
      posts: 567,
      engagement: 11.8,
      reach: 456789,
      icon: Camera,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      primaryFeature: "Visual Content"
    },
    {
      platform: "WhatsApp Business",
      followers: 12847,
      posts: 89,
      engagement: 45.2,
      reach: 67432,
      icon: Phone,
      color: "bg-green-500",
      primaryFeature: "Direct Communication"
    },
    {
      platform: "Threads",
      followers: 23156,
      posts: 234,
      engagement: 8.9,
      reach: 123456,
      icon: Hash,
      color: "bg-black",
      primaryFeature: "Real-time Updates"
    }
  ];

  const recentPosts: ContentPost[] = [
    {
      id: "meta-1",
      platform: "instagram",
      content: "Medicine Wheel logo celebrating 2SLGBTIQA+ pride with sustainable custom protection 🏳️‍⚧️🏳️‍🌈 #Pride #SustainableHealth #CustomFit",
      mediaType: "image",
      engagement: { likes: 2847, shares: 456, comments: 234, views: 12847 },
      timestamp: "3 hours ago",
      hashtags: ["Pride", "SustainableHealth", "CustomFit", "2SLGBTIQA"],
      audience: "18-45, Health Conscious"
    },
    {
      id: "meta-2",
      platform: "facebook",
      content: "New research: 4D STI intervention using bioregional sewer testing shows 34% reduction in transmission rates. Read our latest findings on community health protection.",
      mediaType: "carousel",
      engagement: { likes: 1234, shares: 789, comments: 456, views: 8923 },
      timestamp: "6 hours ago",
      hashtags: ["PublicHealth", "Research", "STIPrevention", "CommunityHealth"],
      audience: "25-65, Healthcare Professionals"
    },
    {
      id: "meta-3",
      platform: "whatsapp",
      content: "New TriSex.org sizing guide available! Get your custom fit measurement in 3 easy steps. Reply with 'SIZE' to get started.",
      engagement: { likes: 0, shares: 0, comments: 789, views: 3456 },
      timestamp: "1 day ago",
      hashtags: [],
      audience: "Existing Customers"
    },
    {
      id: "meta-4",
      platform: "threads",
      content: "Breaking: fluck's cooperative health model saves 12,847 DALYs this quarter, contributing to national debt reduction. The future of sustainable healthcare is here. 🧵",
      engagement: { likes: 567, shares: 234, comments: 123, views: 4567 },
      timestamp: "2 days ago",
      hashtags: ["HealthcareInnovation", "DALYs", "CooperativeHealth", "SustainableHealth"],
      audience: "Public Health Leaders"
    }
  ];

  const contentTemplates = [
    {
      platform: "Instagram",
      type: "Educational Carousel",
      title: "MyONE Sizing vs Traditional",
      description: "Visual comparison of 60+ custom sizes vs standard 3-4 sizes",
      hashtags: ["CustomFit", "SexualHealth", "Education", "BodyPositivity"],
      mediaType: "carousel"
    },
    {
      platform: "Facebook", 
      type: "Research Post",
      title: "4D STI Intervention Results",
      description: "Detailed post about bioregional testing effectiveness with infographics",
      hashtags: ["PublicHealth", "Research", "STIPrevention", "DataScience"],
      mediaType: "image"
    },
    {
      platform: "WhatsApp Business",
      type: "Customer Service",
      title: "Sizing Support Bot",
      description: "Automated sizing assistance and custom fit consultation",
      hashtags: [],
      mediaType: "text"
    },
    {
      platform: "Threads",
      type: "Breaking News",
      title: "Real-time Health Updates",
      description: "Live updates on DALY savings and economic impact",
      hashtags: ["HealthNews", "DALYs", "EconomicImpact", "PublicHealth"],
      mediaType: "text"
    }
  ];

  const crossPostToMeta = async () => {
    console.log("Cross-posting to Meta platforms:", selectedPlatforms);
    console.log("Content:", postContent);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <MessageCircle className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Meta Platform Integration
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Facebook, Instagram, WhatsApp & Threads
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <MessageCircle className="w-4 h-4 mr-1" />
              Facebook
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Camera className="w-4 h-4 mr-1" />
              Instagram
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Phone className="w-4 h-4 mr-1" />
              WhatsApp
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
              <Hash className="w-4 h-4 mr-1" />
              Threads
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Creation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metaPlatformStats.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Card key={platform.platform} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-sm">
                        <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center mr-3`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        {platform.platform}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Followers:</span>
                          <span className="font-medium">{platform.followers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Posts:</span>
                          <span className="font-medium">{platform.posts}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Engagement:</span>
                          <span className="font-medium">{platform.engagement}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Monthly Reach:</span>
                          <span className="font-medium">{platform.reach.toLocaleString()}</span>
                        </div>
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground mb-1">
                            {platform.primaryFeature}
                          </div>
                          <Progress value={platform.engagement * 8} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Meta Platform Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="capitalize">
                            {post.platform}
                          </Badge>
                          {post.mediaType && (
                            <Badge variant="secondary" className="text-xs">
                              {post.mediaType}
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {post.timestamp}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm mb-3">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.hashtags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex space-x-4 text-sm text-muted-foreground mb-2">
                        {post.platform !== "whatsapp" && (
                          <>
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {post.engagement.likes}
                            </span>
                            <span className="flex items-center">
                              <Share2 className="h-4 w-4 mr-1" />
                              {post.engagement.shares}
                            </span>
                          </>
                        )}
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.engagement.comments}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.engagement.views}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Target Audience: {post.audience}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Cross-Platform Post Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Post Content
                      </label>
                      <textarea
                        className="w-full p-3 border rounded-lg min-h-[120px] resize-none"
                        placeholder="Share fluck's mission across Meta platforms..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {postContent.length}/2000 characters
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Target Platforms
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["facebook", "instagram", "whatsapp", "threads"].map((platform) => (
                          <Button
                            key={platform}
                            variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setSelectedPlatforms(prev => 
                                prev.includes(platform)
                                  ? prev.filter(p => p !== platform)
                                  : [...prev, platform]
                              );
                            }}
                            className="justify-start"
                          >
                            {platform === "facebook" && <MessageCircle className="h-4 w-4 mr-1" />}
                            {platform === "instagram" && <Camera className="h-4 w-4 mr-1" />}
                            {platform === "whatsapp" && <Phone className="h-4 w-4 mr-1" />}
                            {platform === "threads" && <Hash className="h-4 w-4 mr-1" />}
                            {platform}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Content Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["image", "video", "carousel", "story"].map((type) => (
                          <Button key={type} variant="outline" size="sm">
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Suggested Hashtags
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {["SexualHealth", "CustomFit", "2SLGBTIQ", "SustainableHealth", "PublicHealth", "Innovation", "Cooperative", "BodyPositivity"].map((tag) => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={crossPostToMeta}
                      disabled={!postContent.trim() || selectedPlatforms.length === 0}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Post to Meta Platforms
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentTemplates.map((template, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{template.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {template.platform}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {template.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {template.mediaType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {template.type}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.hashtags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button size="sm" variant="outline" className="w-full">
                          Use Template
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Reach</p>
                        <p className="text-2xl font-bold">867K</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">+18% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                        <p className="text-2xl font-bold">9.8%</p>
                      </div>
                      <Heart className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Above Meta average</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">New Followers</p>
                        <p className="text-2xl font-bold">3,249</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                        <p className="text-2xl font-bold">892</p>
                      </div>
                      <Target className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Website visits</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Performance Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metaPlatformStats.map((platform) => (
                        <div key={platform.platform} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center`}>
                              <platform.icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{platform.platform}</h4>
                              <p className="text-xs text-muted-foreground">
                                {platform.followers.toLocaleString()} followers
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{platform.engagement}%</p>
                            <p className="text-xs text-muted-foreground">engagement</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <span className="text-sm">Educational Content</span>
                        <div className="text-right">
                          <span className="font-bold">12.4%</span>
                          <div className="text-xs text-muted-foreground">avg engagement</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <span className="text-sm">Research Posts</span>
                        <div className="text-right">
                          <span className="font-bold">8.7%</span>
                          <div className="text-xs text-muted-foreground">avg engagement</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <span className="text-sm">Community Content</span>
                        <div className="text-right">
                          <span className="font-bold">15.2%</span>
                          <div className="text-xs text-muted-foreground">avg engagement</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <span className="text-sm">Product Updates</span>
                        <div className="text-right">
                          <span className="font-bold">6.9%</span>
                          <div className="text-xs text-muted-foreground">avg engagement</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automated Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">Cross-platform posting</h4>
                        <p className="text-xs text-muted-foreground">Auto-adapt content for each platform</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Active</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">Response automation</h4>
                        <p className="text-xs text-muted-foreground">Auto-reply to common questions</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Active</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">Content scheduling</h4>
                        <p className="text-xs text-muted-foreground">Optimal timing for each platform</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Active</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">Analytics reporting</h4>
                        <p className="text-xs text-muted-foreground">Weekly performance summaries</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-orange-500" />
                        <span className="text-xs">Pending</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Auto-hashtag suggestions</span>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Content moderation</span>
                      <Button variant="outline" size="sm">
                        Strict
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Cross-platform sync</span>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Analytics tracking</span>
                      <Button variant="outline" size="sm">
                        Full
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">WhatsApp Business API</span>
                      <Button variant="outline" size="sm">
                        Connected
                      </Button>
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