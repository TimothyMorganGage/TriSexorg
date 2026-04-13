import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { FediverseShare } from "@/components/FediverseShare";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import type { ForumCategory, ForumPost, ForumReply } from "@shared/schema";
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
  Filter,
  TrendingUp,
  Star,
  CheckCircle,
  Reply,
  Share2,
  Flag,
  ChevronRight,
  Sparkles,
  Brain,
  Stethoscope,
  Leaf,
  Globe,
  Accessibility,
  Loader2
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Stethoscope, Heart, Users, Sparkles, Globe, Leaf, Accessibility, MessageCircle, Brain
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
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyAnonymous, setReplyAnonymous] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    categoryId: 0,
    tags: "",
    isAnonymous: false,
    contentWarning: ""
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<ForumCategory[]>({
    queryKey: ['/api/forum/categories'],
  });

  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      apiRequest("POST", "/api/forum/categories/seed").then(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/forum/categories'] });
      }).catch(() => {});
    }
  }, [categories, categoriesLoading]);

  const { data: posts = [], isLoading: postsLoading } = useQuery<ForumPost[]>({
    queryKey: ['/api/forum/posts', selectedCategory?.id],
    queryFn: async () => {
      const url = selectedCategory
        ? `/api/forum/posts?categoryId=${selectedCategory.id}`
        : '/api/forum/posts';
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  const { data: trendingPosts = [], isLoading: trendingLoading } = useQuery<ForumPost[]>({
    queryKey: ['/api/forum/posts/trending'],
  });

  const { data: searchResults = [] } = useQuery<ForumPost[]>({
    queryKey: ['/api/forum/posts/search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const res = await fetch(`/api/forum/posts/search?q=${encodeURIComponent(debouncedSearch)}`, { credentials: "include" });
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: debouncedSearch.length > 0,
  });

  const { data: selectedPost, isLoading: postDetailLoading } = useQuery<ForumPost>({
    queryKey: ['/api/forum/posts', selectedPostId],
    queryFn: async () => {
      const res = await fetch(`/api/forum/posts/${selectedPostId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json();
    },
    enabled: !!selectedPostId,
  });

  const { data: replies = [], isLoading: repliesLoading } = useQuery<ForumReply[]>({
    queryKey: ['/api/forum/posts', selectedPostId, 'replies'],
    queryFn: async () => {
      const res = await fetch(`/api/forum/posts/${selectedPostId}/replies`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch replies");
      return res.json();
    },
    enabled: !!selectedPostId,
  });

  const { data: bookmarkIds = [] } = useQuery<number[]>({
    queryKey: ['/api/forum/bookmarks'],
    queryFn: async () => {
      const res = await fetch('/api/forum/bookmarks', { credentials: "include" });
      if (!res.ok) return [];
      const bookmarks = await res.json();
      return bookmarks.map((b: any) => b.postId);
    },
    enabled: !!user,
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: typeof newPost) => {
      const tags = data.tags.split(",").map(t => t.trim()).filter(Boolean);
      await apiRequest("POST", "/api/forum/posts", {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        tags,
        isAnonymous: data.isAnonymous,
        contentWarning: data.contentWarning || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/forum/categories'] });
      setShowNewPostDialog(false);
      setNewPost({ title: "", content: "", categoryId: 0, tags: "", isAnonymous: false, contentWarning: "" });
      toast({ title: "Post created", description: "Your post has been published to the forum." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create post", variant: "destructive" });
    }
  });

  const createReplyMutation = useMutation({
    mutationFn: async ({ postId, content, isAnonymous }: { postId: number; content: string; isAnonymous: boolean }) => {
      await apiRequest("POST", `/api/forum/posts/${postId}/replies`, { content, isAnonymous });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts', selectedPostId, 'replies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts', selectedPostId] });
      setReplyContent("");
      setReplyAnonymous(false);
      toast({ title: "Reply posted", description: "Your reply has been added." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to post reply", variant: "destructive" });
    }
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest("POST", `/api/forum/posts/${postId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
      if (selectedPostId) queryClient.invalidateQueries({ queryKey: ['/api/forum/posts', selectedPostId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Must be logged in to like", variant: "destructive" });
    }
  });

  const likeReplyMutation = useMutation({
    mutationFn: async (replyId: number) => {
      await apiRequest("POST", `/api/forum/replies/${replyId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts', selectedPostId, 'replies'] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Must be logged in to like", variant: "destructive" });
    }
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest("POST", `/api/forum/posts/${postId}/bookmark`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/bookmarks'] });
      toast({ title: "Bookmark updated" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Must be logged in to bookmark", variant: "destructive" });
    }
  });

  const displayPosts = debouncedSearch ? searchResults : posts;

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.categoryId) {
      toast({ title: "Missing fields", description: "Please fill in title, content, and category.", variant: "destructive" });
      return;
    }
    createPostMutation.mutate(newPost);
  };

  const handleSubmitReply = () => {
    if (!replyContent.trim() || !selectedPostId) return;
    createReplyMutation.mutate({ postId: selectedPostId, content: replyContent, isAnonymous: replyAnonymous });
  };

  const getCategoryName = (categoryId: number) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name || "Unknown";
  };

  const renderCategoryCard = (category: ForumCategory) => {
    const IconComponent = getIconComponent(category.icon || "MessageCircle");
    return (
      <Card
        key={category.id}
        className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]"
        onClick={() => {
          setSelectedCategory(category);
          setActiveTab("posts");
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${getColorClasses(category.color || "purple")}`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
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
        setSelectedPostId(post.id);
        setActiveTab("post-detail");
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
              {post.isAnonymous ? "?" : "U"}
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
              <span>{post.isAnonymous ? "Anonymous" : `User #${post.authorId}`}</span>
              <span className="text-xs">{getCategoryName(post.categoryId)}</span>
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
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.slice(0, 4).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] py-0">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPostDetail = () => {
    if (!selectedPostId) return null;
    if (postDetailLoading) return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
    if (!selectedPost) return null;

    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedPostId(null);
            setActiveTab("posts");
          }}
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
                  {selectedPost.isAnonymous ? "?" : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">
                    {selectedPost.isAnonymous ? "Anonymous" : `User #${selectedPost.authorId}`}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(selectedPost.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
                <div className="prose dark:prose-invert max-w-none mb-4">
                  <p>{selectedPost.content}</p>
                </div>
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedPost.tags.map(tag => (
                      <Badge key={tag} variant="outline">#{tag}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => likePostMutation.mutate(selectedPost.id)}>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Like ({selectedPost.likeCount})
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => bookmarkMutation.mutate(selectedPost.id)}>
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    {bookmarkIds.includes(selectedPost.id) ? "Bookmarked" : "Bookmark"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + `/community-forum?post=${selectedPost.id}`);
                    toast({ title: "Link copied to clipboard" });
                  }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{selectedPost.replyCount} Replies</h3>
          </div>

          {!selectedPost.isLocked && (
            <Card>
              <CardContent className="p-4">
                <Textarea
                  placeholder="Write a thoughtful reply... Be respectful and supportive."
                  className="mb-3"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="anonymous-reply"
                      checked={replyAnonymous}
                      onCheckedChange={(checked) => setReplyAnonymous(checked as boolean)}
                    />
                    <Label htmlFor="anonymous-reply" className="text-sm">Post anonymously</Label>
                  </div>
                  <Button
                    onClick={handleSubmitReply}
                    disabled={createReplyMutation.isPending || !replyContent.trim()}
                  >
                    {createReplyMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Reply className="h-4 w-4 mr-2" />
                    )}
                    Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {repliesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : replies.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No replies yet. Be the first to respond!</p>
              </CardContent>
            </Card>
          ) : (
            replies.map(reply => (
              <Card key={reply.id} className={reply.isSolution ? "border-green-500 border-2" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                        {reply.isAnonymous ? "?" : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          {reply.isAnonymous ? "Anonymous" : `User #${reply.authorId}`}
                        </span>
                        {reply.isSolution && (
                          <Badge className="bg-green-600 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Solution
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{reply.content}</p>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => likeReplyMutation.mutate(reply.id)}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {reply.likeCount}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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
              <MessageCircle className="h-4 w-4 mr-2" />
              {posts.length} Posts
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
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="posts">
                {selectedCategory ? selectedCategory.name : "All Posts"}
              </TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
                <DialogTrigger asChild>
                  <Button>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="post-tags">Tags (comma separated)</Label>
                      <Input
                        id="post-tags"
                        placeholder="e.g., sizing, support, question"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content-warning">Content Warning (optional)</Label>
                      <Input
                        id="content-warning"
                        placeholder="e.g., Discussion of trauma, explicit content"
                        value={newPost.contentWarning}
                        onChange={(e) => setNewPost({...newPost, contentWarning: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="anonymous"
                        checked={newPost.isAnonymous}
                        onCheckedChange={(checked) => setNewPost({...newPost, isAnonymous: checked as boolean})}
                      />
                      <Label htmlFor="anonymous">Post anonymously</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost} disabled={createPostMutation.isPending}>
                      {createPostMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Create Post
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="categories" className="space-y-4">
            {categoriesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid gap-4">
                {categories.map(renderCategoryCard)}
              </div>
            )}
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
                      >
                        ← All Categories
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <div className={`p-2 rounded-lg ${getColorClasses(selectedCategory.color || "purple")}`}>
                        {(() => {
                          const IconComponent = getIconComponent(selectedCategory.icon || "MessageCircle");
                          return <IconComponent className="h-5 w-5" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedCategory.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {postsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-3">
                {displayPosts.length > 0 ? (
                  displayPosts.map(renderPostCard)
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                      <p className="text-muted-foreground mb-4">
                        {debouncedSearch ? "Try adjusting your search terms" : "Be the first to start a conversation!"}
                      </p>
                      <Button onClick={() => setShowNewPostDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Post
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Trending Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trendingLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : trendingPosts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No trending posts yet.</p>
                ) : (
                  <div className="space-y-3">
                    {trendingPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedPostId(post.id);
                          setActiveTab("post-detail");
                        }}
                      >
                        <div className="text-2xl font-bold text-muted-foreground w-8">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold line-clamp-1">{post.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{getCategoryName(post.categoryId)}</span>
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-4">
            {!user ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookmarkPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Log in to see bookmarks</h3>
                  <p className="text-muted-foreground">You need to be logged in to save and view bookmarks.</p>
                </CardContent>
              </Card>
            ) : bookmarkIds.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookmarkPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Bookmark posts you want to revisit later
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab("categories")}>
                    Browse Posts
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {posts.filter(p => bookmarkIds.includes(p.id)).map(renderPostCard)}
              </div>
            )}
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
