import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Book, 
  Star, 
  Trophy, 
  Heart,
  Brain,
  Users,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Bookmark,
  Share2,
  MessageCircle,
  ThumbsUp,
  Award,
  Target,
  Zap,
  Globe,
  Sparkles,
  CheckCircle,
  Clock,
  Edit3,
  Send,
  Keyboard,
  Smartphone,
  Gamepad2
} from "lucide-react";

interface Story {
  id: string;
  title: string;
  author: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: number;
  xpReward: number;
  badges: string[];
  description: string;
  chapters: Chapter[];
  isCompleted: boolean;
  progress: number;
  likes: number;
  comments: number;
  culturalTags: string[];
  intelligenceTypes: string[];
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  choices?: Choice[];
  multimedia?: {
    audio?: string;
    images?: string[];
    interactive?: boolean;
  };
  learningObjectives: string[];
  xpReward: number;
  isCompleted: boolean;
}

interface Choice {
  id: string;
  text: string;
  consequence: string;
  nextChapter: string;
  xpBonus?: number;
  culturalContext?: string;
}

interface UserProgress {
  level: number;
  totalXP: number;
  xpToNextLevel: number;
  completedStories: number;
  badges: Badge[];
  streak: number;
  favoriteCategories: string[];
  culturalCompetency: {
    [key: string]: number;
  };
  intelligenceGrowth: {
    [key: string]: number;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  dateEarned?: string;
}

export default function InteractiveStories() {
  const [activeTab, setActiveTab] = useState("stories");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [gboardTutorial, setGboardTutorial] = useState(false);
  const [newComment, setNewComment] = useState("");

  const userProgress: UserProgress = {
    level: 8,
    totalXP: 4250,
    xpToNextLevel: 750,
    completedStories: 23,
    badges: [
      { id: "1", name: "Cultural Explorer", description: "Completed stories from 5 different cultures", icon: "🌍", rarity: "Rare" },
      { id: "2", name: "Wisdom Seeker", description: "Reached level 5", icon: "🧠", rarity: "Common" },
      { id: "3", name: "Story Master", description: "Completed 20 stories", icon: "📚", rarity: "Epic" }
    ],
    streak: 12,
    favoriteCategories: ["Sexual Health", "Reproductive Justice", "Cultural Wisdom"],
    culturalCompetency: {
      "Indigenous": 85,
      "African Diaspora": 72,
      "Latin American": 68,
      "Asian": 91,
      "European": 56
    },
    intelligenceGrowth: {
      "Infinite": 78,
      "Multicultural": 84,
      "Multigenerational": 71,
      "Racial & Ethnic": 89
    }
  };

  const interactiveStories: Story[] = [
    {
      id: "story-1",
      title: "Journey Through the Medicine Wheel: A Teaching Story",
      author: "Elder Maria Crow Feather",
      category: "Indigenous Wisdom",
      difficulty: "Beginner",
      estimatedTime: 15,
      xpReward: 150,
      badges: ["Cultural Explorer", "Wisdom Keeper"],
      description: "Learn about holistic health through traditional Indigenous teachings, exploring the four directions and their connection to sexual wellness and reproductive health.",
      chapters: [
        {
          id: "ch1",
          title: "The Eastern Direction: New Beginnings",
          content: "You stand at the eastern point of the medicine wheel, where the sun rises and new life begins. An elder approaches you with a warm smile...",
          choices: [
            { id: "c1", text: "Ask about the significance of this direction", consequence: "Learn about spiritual aspects of reproductive health", nextChapter: "ch2a" },
            { id: "c2", text: "Share your own experience with new beginnings", consequence: "Create deeper connection with teaching", nextChapter: "ch2b", xpBonus: 25 }
          ],
          learningObjectives: ["Understand Indigenous approaches to reproductive health", "Learn about ceremony and wellness"],
          xpReward: 50,
          isCompleted: false,
          multimedia: { audio: "elder-voice.mp3", interactive: true }
        }
      ],
      isCompleted: false,
      progress: 0,
      likes: 284,
      comments: 47,
      culturalTags: ["Indigenous", "Lakota", "Medicine Wheel"],
      intelligenceTypes: ["Multicultural", "Infinite"]
    },
    {
      id: "story-2",
      title: "Abuela's Wisdom: Curandera Teachings on Sexual Health",
      author: "Rosa Elena Martinez",
      category: "Latin American Healing",
      difficulty: "Intermediate",
      estimatedTime: 20,
      xpReward: 200,
      badges: ["Herbal Wisdom", "Family Healer"],
      description: "Experience traditional Mexican curanderismo as you learn from an abuela about plants, prayer, and reproductive wellness in your community.",
      chapters: [
        {
          id: "ch1",
          title: "The Herb Garden Teaching",
          content: "Abuela leads you through her garden filled with medicinal plants. She stops at a particular plant and begins to speak...",
          choices: [
            { id: "c1", text: "Ask about this plant's traditional uses", consequence: "Learn herbal medicine for reproductive health", nextChapter: "ch2a" },
            { id: "c2", text: "Share what your family taught you about plants", consequence: "Honor intergenerational knowledge", nextChapter: "ch2b", culturalContext: "Family traditions strengthen community healing" }
          ],
          learningObjectives: ["Learn traditional plant medicine", "Understand family-centered healing"],
          xpReward: 75,
          isCompleted: false,
          multimedia: { images: ["herb-garden.jpg", "medicinal-plants.jpg"], interactive: true }
        }
      ],
      isCompleted: false,
      progress: 0,
      likes: 156,
      comments: 32,
      culturalTags: ["Mexican", "Curanderismo", "Herbal Medicine"],
      intelligenceTypes: ["Multicultural", "Multigenerational"]
    },
    {
      id: "story-3",
      title: "The Village Healer: African Traditional Approaches to Wellness",
      author: "Dr. Amara Okonkwo",
      category: "African Healing Traditions",
      difficulty: "Advanced",
      estimatedTime: 25,
      xpReward: 250,
      badges: ["Ancestral Wisdom", "Community Healer"],
      description: "Join a village healing ceremony and learn how African traditional medicine approaches sexual health through community, spirituality, and ancestral wisdom.",
      chapters: [
        {
          id: "ch1",
          title: "The Calling of the Ancestors",
          content: "Drums echo across the village as the healing ceremony begins. The elder gestures for you to join the circle...",
          choices: [
            { id: "c1", text: "Step forward respectfully into the circle", consequence: "Show cultural respect and openness", nextChapter: "ch2a", xpBonus: 30 },
            { id: "c2", text: "Ask permission before joining", consequence: "Demonstrate cultural humility", nextChapter: "ch2b", xpBonus: 50 }
          ],
          learningObjectives: ["Understand community-centered healing", "Learn about ancestral wisdom in health"],
          xpReward: 85,
          isCompleted: false,
          multimedia: { audio: "village-drums.mp3", interactive: true }
        }
      ],
      isCompleted: false,
      progress: 0,
      likes: 198,
      comments: 28,
      culturalTags: ["West African", "Yoruba", "Community Healing"],
      intelligenceTypes: ["Multicultural", "Infinite", "Racial & Ethnic"]
    }
  ];

  const gboardPrompts = [
    "Try typing 'sexual health' - notice how Gboard suggests inclusive language options",
    "Type 'reproductive' and see culturally sensitive completions",
    "Use voice input to practice pronunciation of anatomy terms in different languages",
    "Explore emoji suggestions that represent diverse relationships and identities"
  ];

  const startGboardTutorial = () => {
    setGboardTutorial(true);
    // Simulate Gboard integration
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  const calculateLevelProgress = () => {
    return ((userProgress.totalXP % 1000) / 1000) * 100;
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-500";
      case "Rare": return "bg-blue-500";
      case "Epic": return "bg-purple-500";
      case "Legendary": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Book className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground font-recoleta">
                Interactive Story Knowledge Sharing
              </h1>
              <p className="text-xl text-muted-foreground mt-2 font-coolvetica">
                Gamified Learning • Cultural Wisdom • Progress Tracking • Gboard Integration
              </p>
            </div>
          </div>
          
          {/* User Progress Bar */}
          <Card className="max-w-2xl mx-auto mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {userProgress.level}
                  </div>
                  <div>
                    <h3 className="font-bold">Level {userProgress.level} Scholar</h3>
                    <p className="text-sm text-muted-foreground">{userProgress.totalXP} XP total</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-orange-500">
                    <Zap className="h-4 w-4" />
                    <span className="font-bold">{userProgress.streak}</span>
                    <span className="text-sm">day streak</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {userProgress.level + 1}</span>
                  <span>{userProgress.xpToNextLevel} XP remaining</span>
                </div>
                <Progress value={calculateLevelProgress()} className="h-3" />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {userProgress.badges.slice(0, 3).map((badge) => (
                  <Badge key={badge.id} className={`${getBadgeColor(badge.rarity)} text-white`}>
                    {badge.icon} {badge.name}
                  </Badge>
                ))}
                {userProgress.badges.length > 3 && (
                  <Badge variant="outline">+{userProgress.badges.length - 3} more</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gboard Tutorial Integration */}
          <Card className="max-w-2xl mx-auto mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Keyboard className="h-8 w-8 text-purple-600 mr-3" />
                <Smartphone className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-bold">Gboard Integration Tutorial</h3>
              </div>
              <p className="text-center text-muted-foreground mb-4">
                Learn inclusive language typing with Gboard's smart suggestions and voice input
              </p>
              <Button onClick={startGboardTutorial} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                <Gamepad2 className="mr-2 h-4 w-4" />
                Start Interactive Keyboard Tutorial
              </Button>
              
              {gboardTutorial && (
                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <h4 className="font-medium mb-3">Try These Exercises:</h4>
                  <div className="space-y-2">
                    {gboardPrompts.map((prompt, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <p className="text-sm">{prompt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="stories">Browse Stories</TabsTrigger>
            <TabsTrigger value="reading">Reading Experience</TabsTrigger>
            <TabsTrigger value="progress">Learning Progress</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="stories">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interactiveStories.map((story) => (
                <Card key={story.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">{story.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">by {story.author}</p>
                      </div>
                      <Badge variant={story.difficulty === "Beginner" ? "secondary" : 
                                    story.difficulty === "Intermediate" ? "default" : "destructive"}>
                        {story.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{story.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{story.estimatedTime}m</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{story.xpReward} XP</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {story.culturalTags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {story.intelligenceTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            <Brain className="w-3 h-3 mr-1" />
                            {type}
                          </Badge>
                        ))}
                      </div>
                      
                      {story.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{story.progress}%</span>
                          </div>
                          <Progress value={story.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{story.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{story.comments}</span>
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedStory(story);
                            setActiveTab("reading");
                          }}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {story.progress > 0 ? "Continue" : "Start"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reading">
            {selectedStory ? (
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedStory.title}</CardTitle>
                        <p className="text-muted-foreground">Chapter {currentChapter + 1}: {selectedStory.chapters[currentChapter]?.title}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setAudioEnabled(!audioEnabled)}>
                          {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Chapter Progress</span>
                        <span>{currentChapter + 1} of {selectedStory.chapters.length}</span>
                      </div>
                      <Progress value={((currentChapter + 1) / selectedStory.chapters.length) * 100} className="h-2" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="prose prose-lg max-w-none">
                        <p>{selectedStory.chapters[currentChapter]?.content}</p>
                      </div>
                      
                      {selectedStory.chapters[currentChapter]?.choices && (
                        <div className="space-y-3">
                          <h4 className="font-medium">What do you choose?</h4>
                          <div className="space-y-2">
                            {selectedStory.chapters[currentChapter].choices?.map((choice) => (
                              <Card key={choice.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                                <CardContent className="p-4">
                                  <p className="font-medium mb-1">{choice.text}</p>
                                  <p className="text-sm text-muted-foreground">{choice.consequence}</p>
                                  {choice.xpBonus && (
                                    <Badge variant="secondary" className="mt-2">
                                      <Star className="w-3 h-3 mr-1" />
                                      +{choice.xpBonus} XP
                                    </Badge>
                                  )}
                                  {choice.culturalContext && (
                                    <p className="text-xs text-blue-600 mt-2 italic">{choice.culturalContext}</p>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Learning Objectives:</h5>
                        <ul className="space-y-1 text-sm">
                          {selectedStory.chapters[currentChapter]?.learningObjectives.map((objective, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" disabled={currentChapter === 0}>
                          Previous Chapter
                        </Button>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            {isPlaying ? "Pause" : "Play Audio"}
                          </Button>
                          <Button>
                            <SkipForward className="h-4 w-4 mr-1" />
                            Next Chapter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Story Selected</h3>
                <p className="text-muted-foreground mb-4">Choose a story from the Browse Stories tab to begin your learning journey.</p>
                <Button onClick={() => setActiveTab("stories")}>
                  Browse Stories
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                    Achievement Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {userProgress.badges.map((badge) => (
                      <div key={badge.id} className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h4 className="font-medium text-sm">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                        <Badge className={`mt-2 ${getBadgeColor(badge.rarity)} text-white`}>
                          {badge.rarity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-6 w-6 text-primary" />
                    Cultural Competency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(userProgress.culturalCompetency).map(([culture, score]) => (
                      <div key={culture}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{culture}</span>
                          <span>{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-6 w-6 text-purple-500" />
                    Intelligence Framework Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(userProgress.intelligenceGrowth).map(([type, score]) => (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{type} Intelligence</span>
                          <span>{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-6 w-6 text-aquamarine" />
                    Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{userProgress.completedStories}</p>
                      <p className="text-sm text-muted-foreground">Stories Completed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-aquamarine">{userProgress.streak}</p>
                      <p className="text-sm text-muted-foreground">Day Streak</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">{userProgress.favoriteCategories.length}</p>
                      <p className="text-sm text-muted-foreground">Favorite Categories</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-500">{userProgress.badges.length}</p>
                      <p className="text-sm text-muted-foreground">Badges Earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-6 w-6 text-primary" />
                    Community Discussion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        AC
                      </div>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Share your thoughts about the stories, cultural insights, or ask questions..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Keyboard className="h-4 w-4" />
                            <span>Use Gboard for inclusive language suggestions</span>
                          </div>
                          <Button size="sm">
                            <Send className="h-4 w-4 mr-1" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                          MW
                        </div>
                        <div className="flex-1">
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <h4 className="font-medium">Marcus Williams</h4>
                            <p className="text-sm text-muted-foreground mb-2">2 hours ago</p>
                            <p>The medicine wheel story really helped me understand the holistic approach to reproductive health. Amazing how different cultures share similar wisdom!</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              12
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <div className="w-10 h-10 bg-aquamarine rounded-full flex items-center justify-center text-black font-bold">
                          PS
                        </div>
                        <div className="flex-1">
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <h4 className="font-medium">Priya Sharma</h4>
                            <p className="text-sm text-muted-foreground mb-2">4 hours ago</p>
                            <p>The Gboard integration is brilliant! It's helping me learn inclusive terminology while I type. Great accessibility feature for the whole community.</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              8
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Featured Story Contributors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                        MCF
                      </div>
                      <h4 className="font-medium">Elder Maria Crow Feather</h4>
                      <p className="text-sm text-muted-foreground">Lakota Nation Elder</p>
                      <Badge className="mt-2">Featured Author</Badge>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                        REM
                      </div>
                      <h4 className="font-medium">Rosa Elena Martinez</h4>
                      <p className="text-sm text-muted-foreground">Curandera & Educator</p>
                      <Badge className="mt-2">Community Leader</Badge>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="w-16 h-16 bg-aquamarine rounded-full flex items-center justify-center text-black font-bold mx-auto mb-3">
                        AO
                      </div>
                      <h4 className="font-medium">Dr. Amara Okonkwo</h4>
                      <p className="text-sm text-muted-foreground">Traditional Healer & PhD</p>
                      <Badge className="mt-2">Expert Contributor</Badge>
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