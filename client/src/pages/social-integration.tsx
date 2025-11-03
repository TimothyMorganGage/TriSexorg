import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Share2, 
  Users, 
  Heart, 
  MessageCircle,
  Eye,
  Video,
  Camera,
  Globe,
  Shield,
  CheckCircle,
  ExternalLink,
  Bell,
  Settings,
  Zap,
  Lock,
  Unlock,
  Download,
  FileText,
  Star,
  Network
} from "lucide-react";

interface SocialPost {
  id: string;
  platform: "bluesky" | "pixelfed" | "loops" | "mastodon";
  content: string;
  mediaUrl?: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  timestamp: string;
  hashtags: string[];
}

interface PlatformStats {
  platform: string;
  followers: number;
  posts: number;
  engagement: number;
  reach: number;
  icon: any;
  color: string;
  protocol: string;
}

export default function SocialIntegration() {
  const [activeTab, setActiveTab] = useState("overview");
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["bluesky", "mastodon", "pixelfed"]);

  const platformStats: PlatformStats[] = [
    {
      platform: "Bluesky",
      followers: 12847,
      posts: 234,
      engagement: 8.7,
      reach: 156392,
      icon: Globe,
      color: "bg-blue-500",
      protocol: "AT Protocol"
    },
    {
      platform: "Mastodon",
      followers: 15632,
      posts: 312,
      engagement: 14.2,
      reach: 198456,
      icon: Network,
      color: "bg-indigo-500",
      protocol: "ActivityPub"
    },
    {
      platform: "Pixelfed",
      followers: 8923,
      posts: 156,
      engagement: 12.3,
      reach: 89754,
      icon: Camera,
      color: "bg-purple-500",
      protocol: "ActivityPub"
    },
    {
      platform: "Loops",
      followers: 4567,
      posts: 67,
      engagement: 15.8,
      reach: 43289,
      icon: Video,
      color: "bg-green-500",
      protocol: "ActivityPub"
    }
  ];

  const recentPosts: SocialPost[] = [
    {
      id: "1",
      platform: "bluesky",
      content: "New 4D STI intervention data shows 23% reduction in transmission rates using bioregional monitoring. #PublicHealth #STIPrevention #DataDriven",
      engagement: { likes: 234, shares: 67, comments: 43, views: 2341 },
      timestamp: "2 hours ago",
      hashtags: ["PublicHealth", "STIPrevention", "DataDriven"]
    },
    {
      id: "2",
      platform: "mastodon",
      content: "CW: sexual health (educational)\n\n🌌 Infinitely Affirmative Protection reviews are live! Real co-op members share how intersex-centered sizing changed their lives.\n\n#SexualHealth #Intersex #Fediverse",
      engagement: { likes: 412, shares: 98, comments: 67, views: 3892 },
      timestamp: "4 hours ago",
      hashtags: ["SexualHealth", "Intersex", "Fediverse"]
    },
    {
      id: "3", 
      platform: "pixelfed",
      content: "Medicine Wheel logo design celebrating 2SLGBTIQ+ community with sustainable protection. #Pride #InclusiveDesign #Sustainability",
      mediaUrl: "/api/assets/medicine-wheel-pride.jpg",
      engagement: { likes: 567, shares: 123, comments: 89, views: 4567 },
      timestamp: "5 hours ago",
      hashtags: ["Pride", "InclusiveDesign", "Sustainability"]
    },
    {
      id: "4",
      platform: "loops",
      content: "3D anatomy scanning process - privacy-preserving custom fit technology in action",
      mediaUrl: "/api/assets/3d-scanning-demo.mp4",
      engagement: { likes: 789, shares: 234, comments: 156, views: 8923 },
      timestamp: "1 day ago",
      hashtags: ["TechForGood", "Privacy", "Innovation"]
    }
  ];

  const suggestedContent = [
    {
      type: "educational",
      title: "MyONE Sizing Comparison",
      description: "Visual comparison showing 60+ sizes vs traditional 3-4 sizes",
      platforms: ["pixelfed", "loops"],
      hashtags: ["CustomFit", "SexualHealth", "Education"]
    },
    {
      type: "awareness",
      title: "4D STI Intervention Impact", 
      description: "Infographic showing bioregional testing effectiveness",
      platforms: ["bluesky", "pixelfed"],
      hashtags: ["PublicHealth", "DataScience", "Prevention"]
    },
    {
      type: "community",
      title: "Cooperative Health Principles",
      description: "Video explaining BAD Co-op integration and community benefits",
      platforms: ["loops", "bluesky"],
      hashtags: ["Cooperative", "Community", "HealthEquity"]
    }
  ];

  const crossPostToFediverse = async () => {
    // Simulate cross-posting to multiple fediverse platforms
    console.log("Cross-posting to selected platforms:", selectedPlatforms);
    console.log("Content:", postContent);
  };

  const exportReviewSyndication = () => {
    const syndicationData = {
      bluesky: {
        post: "🌌 Real co-op member reviews are in! Our intersex-centered sizing system is changing lives. Read authentic testimonials from the TriSex.org community.\n\n#SexualHealth #Intersex #IntersexInclusion #CooperativeHealth",
        url: window.location.origin + "/infinitely-affirmative-protection",
        format: "text + link card"
      },
      mastodon: {
        post: "🌌 Infinitely Affirmative Protection: Real reviews from TriSex.org co-op members\n\nOur intersex-centered sizing, NanoHeal lubricant, and Medicaid EPD integration are transforming sexual health care.\n\n✅ 12 verified member testimonials\n⭐ 5.0 average rating\n🏥 100% verified members\n\n#SexualHealth #Intersex #Fediverse #CooperativeOwnership\n\n" + window.location.origin + "/infinitely-affirmative-protection",
        format: "long-form + hashtags",
        contentWarning: "sexual health (educational)"
      },
      pixelfed: {
        post: "🌌 See what our co-op members are saying!\n\nIntersex-centered sizing • NanoHeal protection • 100% verified reviews\n\n#SexualHealth #IntersexInclusion #CoopPower #HealthEquity",
        imagePrompt: "Design graphic showing review statistics with galaxy background",
        url: window.location.origin + "/infinitely-affirmative-protection"
      },
      loops: {
        post: "Real TriSex.org co-op members share how intersex-centered sizing changed everything\n\n#SexualHealth #Intersex #RealReviews",
        videoScript: "30-second compilation of review quotes with member locations",
        url: window.location.origin + "/infinitely-affirmative-protection"
      }
    };

    const blob = new Blob([JSON.stringify(syndicationData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'review_syndication_guide.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportWikiSyndication = () => {
    const wikiSyndicationData = {
      bluesky: {
        post: "📚 New Wiki article: Understanding intersex-centered sexual health protection\n\nWhy we center intersex anatomical diversity (not accommodate it)\n\n#IntersexInclusion #SexualHealth #Education",
        url: window.location.origin + "/wiki",
        format: "text + link card"
      },
      mastodon: {
        post: "📚 TriSex.org Wiki Update\n\nNew comprehensive guide on intersex-centered sizing systems:\n\n✨ 60+ sizes informed by intersex anatomy\n🎯 No forced categorization\n📏 Measurements without misgendering\n🔬 Evidence-based design\n\n#Intersex #SexualHealth #Fediverse #KnowledgeSharing\n\nRead more: " + window.location.origin + "/wiki",
        format: "thread-capable",
        contentWarning: "sexual health (educational)"
      },
      pixelfed: {
        post: "📚 Wiki knowledge for the fediverse!\n\nIntersex-centered sizing • Evidence-based • Community-reviewed\n\n#SexualHealthEducation #IntersexInclusion #WikiLove",
        imagePrompt: "Infographic showing wiki article highlights",
        url: window.location.origin + "/wiki"
      },
      loops: {
        post: "📚 Wiki Series: Intersex-centered sizing explained in 60 seconds\n\n#IntersexInclusion #SexualHealthEducation #WikiSeries",
        videoScript: "Quick visual explainer showing how intersex anatomy informs the entire 60+ size system with animated measurements and affirming language",
        url: window.location.origin + "/wiki"
      }
    };

    const blob = new Blob([JSON.stringify(wikiSyndicationData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wiki_syndication_guide.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Share2 className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Fediverse Social Integration
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Connect with the decentralized social web
              </p>
            </div>
          </div>
          
          <div className="flex justify-center flex-wrap gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Globe className="w-4 h-4 mr-1" />
              AT Protocol (Bluesky)
            </Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
              <Network className="w-4 h-4 mr-1" />
              ActivityPub (Mastodon)
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              <Camera className="w-4 h-4 mr-1" />
              Pixelfed
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Video className="w-4 h-4 mr-1" />
              Loops
            </Badge>
          </div>
          
          {/* Antitrust Protection Notice */}
          <Card className="mt-8 border-green-500/50 bg-green-50 dark:bg-green-950">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    🛡️ Federation Protects Against Antitrust Monopolies
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                    By syndicating content across decentralized federated networks (Bluesky's AT Protocol and ActivityPub platforms like Mastodon, Pixelfed, and Loops), TriSex.org ensures no single corporation controls our community's sexual health conversations. Federation prevents platform monopolies, protects user data sovereignty, and guarantees our cooperative can't be silenced by centralized social media gatekeepers. Our community owns our content, our data, and our future.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-white/50 dark:bg-black/50">
                      <Unlock className="w-3 h-3 mr-1" />
                      No Vendor Lock-in
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-black/50">
                      <Users className="w-3 h-3 mr-1" />
                      Community Ownership
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-black/50">
                      <Shield className="w-3 h-3 mr-1" />
                      Data Sovereignty
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="syndication">Syndication</TabsTrigger>
            <TabsTrigger value="posting">Create Post</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="syndication">
            <div className="space-y-6">
              <Card className="border-purple-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-purple-600" />
                    🌌 Syndicate Member Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share authentic co-op member testimonials across the fediverse. Export pre-formatted posts optimized for each platform's character limits, features, and community norms.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 border rounded-lg bg-muted/30">
                      <div className="font-medium text-sm mb-1">Content Includes:</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• 12 verified member testimonials</li>
                        <li>• 5.0 ⭐ average rating</li>
                        <li>• Product category highlights</li>
                        <li>• Platform-specific hashtags</li>
                      </ul>
                    </div>
                    <div className="p-3 border rounded-lg bg-muted/30">
                      <div className="font-medium text-sm mb-1">Platform Optimizations:</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Bluesky: Link cards + concise text</li>
                        <li>• Mastodon: Threads + CW tags</li>
                        <li>• Pixelfed: Visual graphics + alt text</li>
                        <li>• Loops: Video script suggestions</li>
                      </ul>
                    </div>
                  </div>
                  <Button onClick={exportReviewSyndication} className="w-full" data-testid="button-export-review-syndication">
                    <Download className="mr-2 h-4 w-4" />
                    Export Review Syndication Guide (JSON)
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    📚 Syndicate Wiki Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Distribute educational wiki content to reach broader communities. Pre-formatted announcements for new articles, sizing guides, and health education resources.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 border rounded-lg bg-muted/30">
                      <div className="font-medium text-sm mb-1">Popular Wiki Topics:</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Intersex-centered sizing systems</li>
                        <li>• NanoHeal STI treatment</li>
                        <li>• Medicaid EPD tax benefits</li>
                        <li>• Natural senses customization</li>
                      </ul>
                    </div>
                    <div className="p-3 border rounded-lg bg-muted/30">
                      <div className="font-medium text-sm mb-1">Educational Focus:</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Evidence-based content</li>
                        <li>• Intersex inclusion</li>
                        <li>• Community peer-review</li>
                        <li>• Accessible language</li>
                      </ul>
                    </div>
                  </div>
                  <Button onClick={exportWikiSyndication} className="w-full" data-testid="button-export-wiki-syndication">
                    <Download className="mr-2 h-4 w-4" />
                    Export Wiki Syndication Guide (JSON)
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-green-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-green-600" />
                    Quick Syndication Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Mastodon:</strong> Use content warnings (CW) for sexual health topics. Most instances appreciate "sexual health (educational)" tags.
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Bluesky:</strong> Rich link cards show automatically. Keep main text concise (under 300 chars) for best engagement.
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Pixelfed:</strong> Always include alt text for images. Visual content performs best with 3-5 hashtags max.
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Cross-posting:</strong> Customize for each platform rather than identical posts. Respect community norms and cultures.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {platformStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={stat.platform}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center mr-3`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        {stat.platform}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Followers:</span>
                          <span className="font-medium">{stat.followers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Posts:</span>
                          <span className="font-medium">{stat.posts}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Engagement:</span>
                          <span className="font-medium">{stat.engagement}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Monthly Reach:</span>
                          <span className="font-medium">{stat.reach.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {stat.protocol}
                        </div>
                        <Progress value={stat.engagement * 5} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
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
                          <span className="text-sm text-muted-foreground">
                            {post.timestamp}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm mb-3">{post.content}</p>
                      
                      {post.mediaUrl && (
                        <div className="bg-muted/30 rounded-lg p-3 mb-3 text-sm text-muted-foreground">
                          📎 Media: {post.mediaUrl}
                        </div>
                      )}
                      
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.engagement.likes}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="h-4 w-4 mr-1" />
                          {post.engagement.shares}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.engagement.comments}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.engagement.views}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.hashtags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posting">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Create Cross-Platform Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Post Content
                      </label>
                      <textarea
                        className="w-full p-3 border rounded-lg min-h-[120px] resize-none"
                        placeholder="Share TriSex.org's mission with the fediverse..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {postContent.length}/500 characters
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Platforms
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["bluesky", "mastodon", "pixelfed", "loops"].map((platform) => (
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
                          >
                            {platform === "bluesky" && <Globe className="h-4 w-4 mr-1" />}
                            {platform === "mastodon" && <Network className="h-4 w-4 mr-1" />}
                            {platform === "pixelfed" && <Camera className="h-4 w-4 mr-1" />}
                            {platform === "loops" && <Video className="h-4 w-4 mr-1" />}
                            {platform}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Suggested Hashtags
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {["SexualHealth", "PublicHealth", "2SLGBTIQ", "Sustainability", "Cooperative", "TechForGood", "Privacy", "Innovation"].map((tag) => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={crossPostToFediverse}
                      disabled={!postContent.trim() || selectedPlatforms.length === 0}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Post to Selected Platforms
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suggestedContent.map((content, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">{content.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {content.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {content.platforms.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {content.hashtags.map((tag) => (
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
                        <p className="text-2xl font-bold">289K</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                        <p className="text-2xl font-bold">12.3%</p>
                      </div>
                      <Heart className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Above industry average</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">New Followers</p>
                        <p className="text-2xl font-bold">1,247</p>
                      </div>
                      <Users className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Content Shares</p>
                        <p className="text-2xl font-bold">456</p>
                      </div>
                      <Share2 className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">+23% increase</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformStats.map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center`}>
                            <platform.icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{platform.platform}</h4>
                            <p className="text-sm text-muted-foreground">
                              {platform.followers.toLocaleString()} followers
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{platform.engagement}%</p>
                          <p className="text-sm text-muted-foreground">engagement</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Bluesky", "Mastodon", "Pixelfed", "Loops"].map((platform) => (
                      <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">{platform}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Posting Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Auto-cross post</span>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Content moderation</span>
                      <Button variant="outline" size="sm">
                        Strict
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Hashtag suggestions</span>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Analytics tracking</span>
                      <Button variant="outline" size="sm">
                        Enabled
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