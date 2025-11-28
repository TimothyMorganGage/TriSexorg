import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BetaDisclaimer } from "@/components/BetaDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, Heart, Leaf, MessageCircle, 
  Users, FlaskConical, Search, ArrowRight,
  BookOpen, Clock, User, Droplets, Target, Zap
} from "lucide-react";
import { Link } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { EducationalContent } from "@shared/schema";

const categoryIcons = {
  sti_prevention: ShieldCheck,
  inclusive_health: Heart,
  sustainable_health: Leaf,
  communication: MessageCircle,
  community_support: Users,
  research: FlaskConical,
};

const categoryColors = {
  sti_prevention: "bg-primary/10 text-primary",
  inclusive_health: "bg-secondary/10 text-secondary",
  sustainable_health: "bg-accent/10 text-accent",
  communication: "bg-purple-100 text-purple-600",
  community_support: "bg-pink-100 text-pink-600",
  research: "bg-indigo-100 text-indigo-600",
};

const categoryNames = {
  sti_prevention: "STI Prevention",
  inclusive_health: "Inclusive Health",
  sustainable_health: "Sustainable Health",
  communication: "Communication",
  community_support: "Community Support",
  research: "Research & Science",
};

export default function Education() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: content, isLoading } = useQuery<EducationalContent[]>({
    queryKey: ["/api/education"],
  });

  const filteredContent = content?.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = Object.keys(categoryNames) as (keyof typeof categoryNames)[];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading educational content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <BetaDisclaimer />
      <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Intersex Healthcare Affirmation */}
            <Alert className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
              <Heart className="h-5 w-5 text-purple-600" />
              <AlertDescription className="ml-2">
                <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Our educational content centers intersex anatomy as the universal baseline. There is no separate "transgender healthcare" category—all bodies receive evidence-based, affirming care by design.
              </AlertDescription>
            </Alert>

            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
            Health Education Hub
              </h1>
              <p className="text-xl text-gray-600">
                Evidence-based information for safer, healthier relationships
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="hidden sm:flex">
                  {categoryNames[category]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            const colorClass = categoryColors[category];
            const categoryContent = content?.filter((item) => item.category === category) || [];
            
            return (
              <Card 
                key={category} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setSelectedCategory(category)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{categoryNames[category]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {category === "sti_prevention" && "Comprehensive guide to sexually transmitted infection prevention, including latest research and best practices."}
                    {category === "inclusive_health" && "Health information specifically for LGBTQ+ individuals, including transgender and intersex health considerations."}
                    {category === "sustainable_health" && "Learn about eco-friendly sexual health products and their environmental impact compared to traditional options."}
                    {category === "communication" && "Tips for discussing sexual health, boundaries, and protection with partners in respectful, open ways."}
                    {category === "community_support" && "Connect with peer support networks and community resources for sexual health and wellness."}
                    {category === "research" && "Latest research in sexual health technology, materials science, and personalized protection solutions."}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {categoryContent.length} articles
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-neutral">
              {selectedCategory === "all" 
                ? "All Articles" 
                : `${categoryNames[selectedCategory as keyof typeof categoryNames]} Articles`}
            </h2>
            <div className="text-sm text-gray-600">
              {filteredContent.length} article{filteredContent.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {filteredContent.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No articles found</h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? "Try adjusting your search terms or browse different categories."
                    : "Content for this category is coming soon."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredContent.map((article) => {
                const Icon = categoryIcons[article.category as keyof typeof categoryIcons];
                const colorClass = categoryColors[article.category as keyof typeof categoryColors];
                
                return (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass} group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              {categoryNames[article.category as keyof typeof categoryNames]}
                            </Badge>
                            {article.tags?.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="text-xl font-semibold text-neutral mb-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(article.createdAt).toLocaleDateString()}
                            </div>
                            <Button variant="link" className="p-0 h-auto">
                              Read More
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Featured Wiki Articles */}
          <div className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Knowledge Wiki
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Comprehensive guides covering sexual health, inclusive practices, and community resources
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow border-primary/20">
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="h-5 w-5 text-pink-600" />
                      <Badge variant="outline" className="text-xs">Sexual Health</Badge>
                    </div>
                    <CardTitle className="text-lg">Anatomy Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Comprehensive guide to sexual anatomy diversity and reproductive justice frameworks.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">22 min read</span>
                      <Link href="/wiki">
                        <Button variant="outline" size="sm" className="text-xs">
                          Read <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-primary/20">
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-2">
                      <Droplets className="h-5 w-5 text-blue-600" />
                      <Badge variant="outline" className="text-xs">STI Prevention</Badge>
                    </div>
                    <CardTitle className="text-lg">4D STI Intervention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Advanced bioregional intervention strategies for sexually transmitted infection prevention.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">18 min read</span>
                      <Link href="/wiki">
                        <Button variant="outline" size="sm" className="text-xs">
                          Read <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-primary/20">
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <Badge variant="outline" className="text-xs">Community</Badge>
                    </div>
                    <CardTitle className="text-lg">Inclusive Terminology</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Cultural competency guide for 2SLGBTIQA+ terminology and inclusive communication.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">14 min read</span>
                      <Link href="/wiki">
                        <Button variant="outline" size="sm" className="text-xs">
                          Read <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-primary/20">
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <Badge variant="outline" className="text-xs">Intelligence</Badge>
                    </div>
                    <CardTitle className="text-lg">Peer Mentor Network</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Multigenerational intelligence framework for culturally competent health mentoring.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">22 min read</span>
                      <Link href="/wiki">
                        <Button variant="outline" size="sm" className="text-xs">
                          Read <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Link href="/wiki">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explore Complete Wiki Library
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
    </div>
  );
}
