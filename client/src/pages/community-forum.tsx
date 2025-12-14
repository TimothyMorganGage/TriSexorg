import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FediverseShare } from "@/components/FediverseShare";
import {
  Heart,
  MessageCircle,
  Users,
  Search,
  Plus,
  ThumbsUp,
  BookmarkPlus,
  Eye,
  Clock,
  Pin,
  Lock,
  AlertTriangle,
  Tag,
  Filter,
  TrendingUp,
  Star,
  CheckCircle,
  Reply,
  Share2,
  Flag,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Brain,
  Stethoscope,
  Leaf,
  Globe,
  Accessibility
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface ForumCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
  latestPost?: {
    title: string;
    author: string;
    timestamp: Date;
  };
}

interface ForumPost {
  id: number;
  categoryId: number;
  categoryName: string;
  authorId: number;
  authorName: string;
  authorBadge?: string;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  isAnonymous: boolean;
  viewCount: number;
  likeCount: number;
  replyCount: number;
  tags: string[];
  contentWarning?: string;
  isSolved?: boolean;
  createdAt: Date;
  lastActivityAt: Date;
}

interface ForumReply {
  id: number;
  postId: number;
  authorId: number;
  authorName: string;
  authorBadge?: string;
  content: string;
  isAnonymous: boolean;
  likeCount: number;
  isSolution: boolean;
  createdAt: Date;
  replies?: ForumReply[];
}

const forumCategories: ForumCategory[] = [
  {
    id: 1,
    name: "Sexual Health Questions",
    slug: "sexual-health",
    description: "Ask questions about STI prevention, testing, treatment, and general sexual health",
    icon: "Stethoscope",
    color: "red",
    postCount: 247,
    latestPost: {
      title: "Understanding 4D STI monitoring",
      author: "HealthAdvocate",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  },
  {
    id: 2,
    name: "Product Sizing & Fit",
    slug: "product-sizing",
    description: "Discuss custom sizing, intersex-centered measurements, and product recommendations",
    icon: "Ruler",
    color: "purple",
    postCount: 189,
    latestPost: {
      title: "First time using 3D scanning",
      author: "NewMember2024",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  },
  {
    id: 3,
    name: "Peer Support & Wellness",
    slug: "peer-support",
    description: "Connect with others for emotional support, share experiences, and build community",
    icon: "Heart",
    color: "pink",
    postCount: 412,
    latestPost: {
      title: "Dealing with STI stigma",
      author: "AnonymousMember",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  },
  {
    id: 4,
    name: "Trans & Non-Binary Health",
    slug: "trans-nb-health",
    description: "Specific discussions for trans, non-binary, genderqueer, and quare community members",
    icon: "Sparkles",
    color: "blue",
    postCount: 156,
    latestPost: {
      title: "Intersex-centered sizing helped me",
      author: "TransAlly",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  },
  {
    id: 5,
    name: "Relationship & Communication",
    slug: "relationships",
    description: "Discuss monogamy, partner communication, and building healthy relationships",
    icon: "Users",
    color: "green",
    postCount: 203,
    latestPost: {
      title: "How to discuss testing with partner",
      author: "OpenHeart",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  },
  {
    id: 6,
    name: "Cooperative & Governance",
    slug: "coop-governance",
    description: "Participate in cooperative decisions, budget voting, and community governance",
    icon: "Globe",
    color: "orange",
    postCount: 78,
    latestPost: {
      title: "Q4 dividend proposal discussion",
      author: "CoopMember",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
    }
  },
  {
    id: 7,
    name: "Accessibility & Inclusion",
    slug: "accessibility",
    description: "Discussions about platform accessibility, Deaf/blind support, and inclusive design",
    icon: "Accessibility",
    color: "teal",
    postCount: 45,
    latestPost: {
      title: "ASL support experience",
      author: "DeafCommunity",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
    }
  },
  {
    id: 8,
    name: "Materials & Sustainability",
    slug: "sustainability",
    description: "Discuss ocean plastic recycling, sustainable materials, and environmental impact",
    icon: "Leaf",
    color: "emerald",
    postCount: 92,
    latestPost: {
      title: "How the reprocessing works",
      author: "EcoWarrior",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    }
  }
];

const samplePosts: ForumPost[] = [
  {
    id: 1,
    categoryId: 3,
    categoryName: "Peer Support & Wellness",
    authorId: 1,
    authorName: "WellnessJourney",
    authorBadge: "Verified Member",
    title: "Finding peace after an STI diagnosis - my story",
    content: "I was diagnosed with HSV-2 six months ago, and I want to share how this community helped me through the initial shock and stigma. The peer mentors here were incredible, and the 4D monitoring gave me so much peace of mind about my health...",
    isPinned: true,
    isLocked: false,
    isAnonymous: false,
    viewCount: 1247,
    likeCount: 89,
    replyCount: 34,
    tags: ["mental-health", "hsv", "support", "stigma"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    categoryId: 2,
    categoryName: "Product Sizing & Fit",
    authorId: 2,
    authorName: "FirstTimer",
    authorBadge: "New Member",
    title: "3D scanning vs manual measurements - which is better?",
    content: "I'm trying to decide whether to use the 3D scanning feature or do manual measurements. Has anyone compared both methods? I'm a bit nervous about the scanning process...",
    isPinned: false,
    isLocked: false,
    isAnonymous: false,
    viewCount: 342,
    likeCount: 23,
    replyCount: 18,
    tags: ["sizing", "3d-scanning", "measurements"],
    isSolved: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: 3,
    categoryId: 4,
    categoryName: "Trans & Non-Binary Health",
    authorId: 3,
    authorName: "Anonymous",
    title: "Intersex-centered sizing changed everything for me",
    content: "As a trans woman, I've always struggled with finding protection that actually fits. The intersex-centered approach here finally acknowledged that my body exists on the natural spectrum. No more 'special' categories - just human bodies...",
    isPinned: false,
    isLocked: false,
    isAnonymous: true,
    viewCount: 567,
    likeCount: 78,
    replyCount: 25,
    tags: ["trans", "intersex", "sizing", "affirmation"],
    contentWarning: "Discussion of body dysphoria",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: 4,
    categoryId: 1,
    categoryName: "Sexual Health Questions",
    authorId: 4,
    authorName: "CuriousLearner",
    authorBadge: "Active Contributor",
    title: "How does the 4D STI bioregional monitoring actually work?",
    content: "I've been reading about the 4D STI intervention system and the water/sewer sampling. Can someone explain how this protects individual privacy while still providing community health insights?",
    isPinned: false,
    isLocked: false,
    isAnonymous: false,
    viewCount: 891,
    likeCount: 45,
    replyCount: 32,
    tags: ["4d-monitoring", "privacy", "public-health"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 5,
    categoryId: 5,
    categoryName: "Relationship & Communication",
    authorId: 5,
    authorName: "MonogamyAdvocate",
    authorBadge: "Mentor",
    title: "Scripts for discussing STI testing with a new partner",
    content: "After many conversations with my peer mentor, I've developed some helpful scripts for bringing up STI testing with a new monogamous partner. These have worked well in my experience...",
    isPinned: false,
    isLocked: false,
    isAnonymous: false,
    viewCount: 1023,
    likeCount: 112,
    replyCount: 47,
    tags: ["communication", "testing", "relationships", "tips"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: 6,
    categoryId: 6,
    categoryName: "Cooperative & Governance",
    authorId: 6,
    authorName: "CoopVoter",
    authorBadge: "Cooperative Member",
    title: "Proposal: Increase NanoHeal R&D budget for Q1 2025",
    content: "I'm proposing we allocate an additional 15% of the participatory budget toward NanoHeal lubricant research. The preliminary results from the naturopathic STI treatment trials are promising...",
    isPinned: true,
    isLocked: false,
    isAnonymous: false,
    viewCount: 234,
    likeCount: 56,
    replyCount: 28,
    tags: ["governance", "budget", "nanoheal", "proposal"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

const sampleReplies: ForumReply[] = [
  {
    id: 1,
    postId: 2,
    authorId: 10,
    authorName: "SizingExpert",
    authorBadge: "Mentor",
    content: "I've used both methods! The 3D scanning is definitely more accurate, especially for the girth measurements. The manual method works fine if you're comfortable with it, but the scanner removes any measurement error. Pro tip: do the scan in a warm room for best results.",
    isAnonymous: false,
    likeCount: 15,
    isSolution: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    postId: 2,
    authorId: 11,
    authorName: "TechEnthusiast",
    content: "The scanning process is really private - all data stays on your device until you explicitly save it. I was nervous too but it's much easier than I expected!",
    isAnonymous: false,
    likeCount: 8,
    isSolution: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000)
  }
];

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Stethoscope,
    Heart,
    Users,
    Sparkles,
    Globe,
    Leaf,
    Accessibility,
    MessageCircle,
    Brain
  };
  return icons[iconName] || MessageCircle;
};

const getColorClasses = (color: string) => {
  const colors: { [key: string]: string } = {
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    teal: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
  };
  return colors[color] || colors.purple;
};

export default function CommunityForum() {
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    categoryId: 0,
    tags: "",
    isAnonymous: false,
    contentWarning: ""
  });

  const filteredPosts = samplePosts.filter(post => {
    if (selectedCategory && post.categoryId !== selectedCategory.id) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleCreatePost = () => {
    console.log("Creating post:", newPost);
    setShowNewPostDialog(false);
    setNewPost({
      title: "",
      content: "",
      categoryId: 0,
      tags: "",
      isAnonymous: false,
      contentWarning: ""
    });
  };

  const renderCategoryCard = (category: ForumCategory) => {
    const IconComponent = getIconComponent(category.icon);
    return (
      <Card 
        key={category.id}
        className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]"
        onClick={() => {
          setSelectedCategory(category);
          setActiveTab("posts");
        }}
        data-testid={`category-card-${category.id}`}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${getColorClasses(category.color)}`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {category.postCount} posts
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
              {category.latestPost && (
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Latest: "{category.latestPost.title}" by {category.latestPost.author}</span>
                  <span>• {formatDistanceToNow(category.latestPost.timestamp, { addSuffix: true })}</span>
                </div>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPostCard = (post: ForumPost) => (
    <Card 
      key={post.id}
      className={`cursor-pointer hover:shadow-md transition-all ${post.isPinned ? 'border-primary border-2' : ''}`}
      onClick={() => {
        setSelectedPost(post);
        setActiveTab("post-detail");
      }}
      data-testid={`post-card-${post.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
              {post.isAnonymous ? "?" : post.authorName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {post.isPinned && (
                <Badge variant="default" className="bg-primary text-xs">
                  <Pin className="h-3 w-3 mr-1" />
                  Pinned
                </Badge>
              )}
              {post.isLocked && (
                <Badge variant="secondary" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
              {post.isSolved && (
                <Badge variant="default" className="bg-green-600 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Solved
                </Badge>
              )}
              {post.contentWarning && (
                <Badge variant="outline" className="text-xs border-orange-400 text-orange-600">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  CW
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-base mb-1 line-clamp-1">{post.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span>{post.isAnonymous ? "Anonymous" : post.authorName}</span>
                {post.authorBadge && !post.isAnonymous && (
                  <Badge variant="outline" className="text-[10px] py-0">{post.authorBadge}</Badge>
                )}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {post.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {post.replyCount}
              </span>
              <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.slice(0, 4).map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px] py-0">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPostDetail = () => {
    if (!selectedPost) return null;
    const postReplies = sampleReplies.filter(r => r.postId === selectedPost.id);

    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => {
            setSelectedPost(null);
            setActiveTab("posts");
          }}
          data-testid="button-back-to-posts"
        >
          ← Back to posts
        </Button>

        <Card>
          <CardContent className="p-6">
            {selectedPost.contentWarning && (
              <Alert className="mb-4 border-orange-400 bg-orange-50 dark:bg-orange-950/30">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>Content Warning:</strong> {selectedPost.contentWarning}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg">
                  {selectedPost.isAnonymous ? "?" : selectedPost.authorName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">
                    {selectedPost.isAnonymous ? "Anonymous" : selectedPost.authorName}
                  </span>
                  {selectedPost.authorBadge && !selectedPost.isAnonymous && (
                    <Badge variant="secondary">{selectedPost.authorBadge}</Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {format(selectedPost.createdAt, "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
                <div className="prose dark:prose-invert max-w-none mb-4">
                  <p>{selectedPost.content}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPost.tags.map(tag => (
                    <Badge key={tag} variant="outline">#{tag}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" data-testid="button-like-post">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Like ({selectedPost.likeCount})
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-bookmark-post">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Bookmark
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-share-post">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" data-testid="button-report-post">
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{selectedPost.replyCount} Replies</h3>
            <Select defaultValue="newest">
              <SelectTrigger className="w-40" data-testid="select-sort-replies">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="popular">Most liked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-4">
              <Textarea 
                placeholder="Write a thoughtful reply... Be respectful and supportive."
                className="mb-3"
                data-testid="input-reply-content"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="anonymous-reply" data-testid="checkbox-anonymous-reply" />
                  <Label htmlFor="anonymous-reply" className="text-sm">Post anonymously</Label>
                </div>
                <Button data-testid="button-submit-reply">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>

          {postReplies.map(reply => (
            <Card key={reply.id} className={reply.isSolution ? "border-green-500 border-2" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                      {reply.isAnonymous ? "?" : reply.authorName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">
                        {reply.isAnonymous ? "Anonymous" : reply.authorName}
                      </span>
                      {reply.authorBadge && !reply.isAnonymous && (
                        <Badge variant="secondary" className="text-xs">{reply.authorBadge}</Badge>
                      )}
                      {reply.isSolution && (
                        <Badge className="bg-green-600 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Solution
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mb-3">{reply.content}</p>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="h-8" data-testid={`button-like-reply-${reply.id}`}>
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {reply.likeCount}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8" data-testid={`button-reply-to-${reply.id}`}>
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Alert className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-purple-200">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Community forums center intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—peer support serves ALL bodies by design.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Community Forum
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Connect, share, and support each other in a safe, moderated space
          </p>
          <div className="flex justify-center mb-4">
            <FediverseShare
              title="Join the TriSex.org Community Forum"
              description="Peer support, knowledge sharing, and cooperative governance for sexual health"
              hashtags={["CommunityForum", "PeerSupport", "SexualHealth", "Cooperative"]}
              imagePrompt="Community forum icons with hearts and speech bubbles"
            />
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              2,847 Members
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <MessageCircle className="h-4 w-4 mr-2" />
              1,422 Posts
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Moderated Space
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <TabsList>
              <TabsTrigger value="categories" data-testid="tab-categories">Categories</TabsTrigger>
              <TabsTrigger value="posts" data-testid="tab-posts">
                {selectedCategory ? selectedCategory.name : "All Posts"}
              </TabsTrigger>
              <TabsTrigger value="trending" data-testid="tab-trending">Trending</TabsTrigger>
              <TabsTrigger value="bookmarks" data-testid="tab-bookmarks">My Bookmarks</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-forum"
                />
              </div>
              <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-post">
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                    <DialogDescription>
                      Share your question, experience, or insight with the community
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="post-category">Category</Label>
                      <Select 
                        value={newPost.categoryId.toString()} 
                        onValueChange={(v) => setNewPost({...newPost, categoryId: parseInt(v)})}
                      >
                        <SelectTrigger data-testid="select-post-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {forumCategories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="post-title">Title</Label>
                      <Input
                        id="post-title"
                        placeholder="What's your post about?"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        data-testid="input-post-title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="post-content">Content</Label>
                      <Textarea
                        id="post-content"
                        placeholder="Share your thoughts, questions, or experiences..."
                        rows={6}
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        data-testid="input-post-content"
                      />
                    </div>
                    <div>
                      <Label htmlFor="post-tags">Tags (comma separated)</Label>
                      <Input
                        id="post-tags"
                        placeholder="e.g., sizing, support, question"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                        data-testid="input-post-tags"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content-warning">Content Warning (optional)</Label>
                      <Input
                        id="content-warning"
                        placeholder="e.g., Discussion of trauma, explicit content"
                        value={newPost.contentWarning}
                        onChange={(e) => setNewPost({...newPost, contentWarning: e.target.value})}
                        data-testid="input-content-warning"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="anonymous" 
                        checked={newPost.isAnonymous}
                        onCheckedChange={(checked) => setNewPost({...newPost, isAnonymous: checked as boolean})}
                        data-testid="checkbox-anonymous-post"
                      />
                      <Label htmlFor="anonymous">Post anonymously</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost} data-testid="button-submit-post">
                      Create Post
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4">
              {forumCategories.map(renderCategoryCard)}
            </div>
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            {selectedCategory && (
              <Card className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                        data-testid="button-clear-category"
                      >
                        ← All Categories
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <div className={`p-2 rounded-lg ${getColorClasses(selectedCategory.color)}`}>
                        {(() => {
                          const IconComponent = getIconComponent(selectedCategory.icon);
                          return <IconComponent className="h-5 w-5" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedCategory.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
                      </div>
                    </div>
                    <Badge>{selectedCategory.postCount} posts</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex items-center gap-2 mb-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Select defaultValue="recent">
                <SelectTrigger className="w-40" data-testid="select-sort-posts">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="replies">Most Replies</SelectItem>
                  <SelectItem value="unanswered">Unanswered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(renderPostCard)
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? "Try adjusting your search terms" : "Be the first to start a conversation!"}
                    </p>
                    <Button onClick={() => setShowNewPostDialog(true)} data-testid="button-create-first-post">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Trending This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {samplePosts
                    .sort((a, b) => b.likeCount - a.likeCount)
                    .slice(0, 5)
                    .map((post, index) => (
                      <div 
                        key={post.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedPost(post);
                          setActiveTab("post-detail");
                        }}
                        data-testid={`trending-post-${post.id}`}
                      >
                        <div className="text-2xl font-bold text-muted-foreground w-8">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold line-clamp-1">{post.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{post.categoryName}</span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {post.likeCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {post.replyCount}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Top Contributors This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "SizingExpert", posts: 23, likes: 156, badge: "Mentor" },
                    { name: "WellnessJourney", posts: 18, likes: 134, badge: "Verified" },
                    { name: "MonogamyAdvocate", posts: 15, likes: 112, badge: "Mentor" },
                    { name: "CoopVoter", posts: 12, likes: 89, badge: "Member" }
                  ].map((contributor, index) => (
                    <Card key={contributor.name} className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-1">#{index + 1}</div>
                        <Avatar className="h-12 w-12 mx-auto mb-2">
                          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                            {contributor.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-semibold text-sm">{contributor.name}</div>
                        <Badge variant="secondary" className="text-xs mt-1">{contributor.badge}</Badge>
                        <div className="text-xs text-muted-foreground mt-2">
                          {contributor.posts} posts • {contributor.likes} likes
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <BookmarkPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                <p className="text-muted-foreground mb-4">
                  Bookmark posts you want to revisit later
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("categories")}
                  data-testid="button-browse-posts"
                >
                  Browse Posts
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="post-detail">
            {renderPostDetail()}
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Community Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <strong className="block">Be Respectful</strong>
                    <span className="text-sm text-muted-foreground">
                      Treat all members with dignity regardless of identity, anatomy, or experience
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <strong className="block">Protect Privacy</strong>
                    <span className="text-sm text-muted-foreground">
                      Never share others' personal or health information without consent
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <strong className="block">Use Content Warnings</strong>
                    <span className="text-sm text-muted-foreground">
                      Tag potentially triggering content to help others navigate safely
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <strong className="block">No Medical Advice</strong>
                    <span className="text-sm text-muted-foreground">
                      Share experiences but don't replace professional healthcare guidance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
