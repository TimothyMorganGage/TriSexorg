import { useState } from "react";
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
  Globe,
  CheckCircle,
  Clock,
  Edit3,
  Send,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Story {
  id: string;
  title: string;
  author: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: number;
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
  isCompleted: boolean;
}

interface Choice {
  id: string;
  text: string;
  consequence: string;
  nextChapter?: string;
  culturalContext?: string;
}

interface UserProgress {
  completedStories: number;
  favoriteCategories: string[];
  culturalCompetency: {
    [key: string]: number;
  };
  intelligenceGrowth: {
    [key: string]: number;
  };
}

export default function InteractiveStories() {
  const [activeTab, setActiveTab] = useState("stories");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [newComment, setNewComment] = useState("");

  const userProgress: UserProgress = {
    completedStories: 23,
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
      description: "Learn about holistic health through traditional Indigenous teachings, exploring the four directions and their connection to sexual wellness and reproductive health.",
      chapters: [
        {
          id: "ch1",
          title: "The Eastern Direction - New Beginnings",
          content: "As the sun rises in the east, we begin our journey around the Medicine Wheel. The eastern direction represents new beginnings, birth, and the spring of life. In many Indigenous traditions, this is where we start when learning about our bodies and our relationship with health...",
          learningObjectives: ["Understanding the Medicine Wheel", "Connecting traditional wisdom to modern health"],
          isCompleted: false,
          choices: [
            {
              id: "choice1",
              text: "Learn about the significance of the eastern direction",
              consequence: "You gain deeper understanding of new beginnings and birth cycles",
              nextChapter: "ch2"
            },
            {
              id: "choice2", 
              text: "Ask about how this relates to reproductive health",
              consequence: "Elder shares wisdom about fertility and life cycles",
              nextChapter: "ch2"
            }
          ]
        },
        {
          id: "ch2",
          title: "The Southern Direction - Growth and Maturity", 
          content: "Moving to the south, we encounter the energy of growth, maturity, and the summer of life. This is where we learn about our bodies as they develop, about healthy relationships, and about taking responsibility for our sexual and reproductive health...",
          learningObjectives: ["Understanding personal growth", "Learning about healthy relationships"],
          isCompleted: false
        },
        {
          id: "ch3",
          title: "The Western Direction - Reflection and Wisdom",
          content: "In the west, we find the place of reflection, maturity, and the autumn of life. Here we learn to look back on our experiences, to share wisdom with younger generations, and to understand the deeper meanings of our health journey...",
          learningObjectives: ["Practicing reflection", "Understanding wisdom-sharing"],
          isCompleted: false
        }
      ],
      isCompleted: false,
      progress: 33,
      likes: 127,
      comments: 23,
      culturalTags: ["Indigenous", "Holistic Health", "Traditional Medicine"],
      intelligenceTypes: ["Multicultural", "Infinite"]
    },
    {
      id: "story-2",
      title: "Ubuntu and Sexual Wellness: A South African Perspective",
      author: "Dr. Nomsa Mbeki",
      category: "African Philosophy",
      difficulty: "Intermediate", 
      estimatedTime: 20,
      description: "Explore the Ubuntu philosophy - 'I am because we are' - and its profound implications for understanding sexual health as a community responsibility and collective wellness practice.",
      chapters: [
        {
          id: "ch1",
          title: "Understanding Ubuntu",
          content: "Ubuntu teaches us that our individual health is interconnected with the health of our community. When we think about sexual wellness through this lens, we see that caring for ourselves is caring for everyone...",
          learningObjectives: ["Understanding Ubuntu philosophy", "Community-centered health approaches"],
          isCompleted: false
        }
      ],
      isCompleted: false,
      progress: 0,
      likes: 89,
      comments: 16,
      culturalTags: ["African", "Philosophy", "Community Health"],
      intelligenceTypes: ["Multicultural", "Racial & Ethnic"]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800"; 
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
    setCurrentChapter(0);
    setActiveTab("reader");
  };

  const nextChapter = () => {
    if (selectedStory && currentChapter < selectedStory.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const toggleBookmark = (storyId: string) => {
    // Implementation for bookmarking stories
  };

  if (selectedStory && activeTab === "reader") {
    const chapter = selectedStory.chapters[currentChapter];
    
    return (
      <div className="min-h-screen bg-surface py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button 
              onClick={() => {
                setSelectedStory(null);
                setActiveTab("stories");
              }}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stories
            </Button>
            
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground font-recoleta">
                {selectedStory.title}
              </h1>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                >
                  {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleBookmark(selectedStory.id)}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Progress 
              value={(currentChapter + 1) / selectedStory.chapters.length * 100} 
              className="mb-4"
            />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Chapter {currentChapter + 1}: {chapter.title}</span>
                <Badge variant="outline">
                  {currentChapter + 1} of {selectedStory.chapters.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">{chapter.content}</p>
              </div>

              {chapter.learningObjectives && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Learning Objectives:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {chapter.learningObjectives.map((objective, index) => (
                      <li key={index} className="text-sm">{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {chapter.choices && (
                <div className="space-y-3">
                  <h4 className="font-medium">Choose your path:</h4>
                  {chapter.choices.map((choice) => (
                    <Button
                      key={choice.id}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4"
                      onClick={() => {
                        // Handle choice selection
                        if (choice.nextChapter) {
                          const nextChapterIndex = selectedStory.chapters.findIndex(
                            ch => ch.id === choice.nextChapter
                          );
                          if (nextChapterIndex !== -1) {
                            setCurrentChapter(nextChapterIndex);
                          }
                        }
                      }}
                    >
                      <div>
                        <div className="font-medium">{choice.text}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {choice.consequence}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  onClick={prevChapter}
                  disabled={currentChapter === 0}
                  variant="outline"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  onClick={nextChapter}
                  disabled={currentChapter === selectedStory.chapters.length - 1}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
          <Heart className="h-5 w-5 text-purple-600" />
          <AlertDescription className="ml-2">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Interactive health education centers intersex anatomy as the universal baseline. There is no separate "transgender healthcare" category—all stories reflect affirming care for ALL bodies by design.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground font-recoleta mb-4">
            Interactive Stories & Cultural Wisdom
          </h1>
          <p className="text-xl text-muted-foreground font-coolvetica">
            Learn through culturally rich narratives that honor diverse perspectives on health and wellness
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stories" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Stories
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Learning Progress
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stories">
            <div className="grid gap-6">
              {interactiveStories.map((story) => (
                <Card key={story.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-3 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                            <p className="text-muted-foreground mb-2">by {story.author}</p>
                            <p className="text-sm leading-relaxed">{story.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{story.estimatedTime} min</span>
                          </span>
                          <Badge className={getDifficultyColor(story.difficulty)}>
                            {story.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {story.culturalTags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {story.intelligenceTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              <Brain className="w-3 h-3 mr-1" />
                              {type}
                            </Badge>
                          ))}
                        </div>
                        
                        {story.progress > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{story.progress}%</span>
                            </div>
                            <Progress value={story.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center space-x-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{story.likes}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{story.comments}</span>
                            </span>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleStorySelect(story)}
                          className="w-full mt-4"
                        >
                          {story.progress > 0 ? "Continue Reading" : "Start Story"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Cultural Competency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(userProgress.culturalCompetency).map(([culture, score]) => (
                      <div key={culture} className="space-y-2">
                        <div className="flex justify-between text-sm">
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
                  <CardTitle className="font-recoleta">Intelligence Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(userProgress.intelligenceGrowth).map(([type, score]) => (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{type}</span>
                          <span>{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-recoleta">Reading Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {userProgress.completedStories}
                      </div>
                      <div className="text-sm text-muted-foreground">Stories Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {userProgress.favoriteCategories.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Favorite Categories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(Object.values(userProgress.culturalCompetency).reduce((a, b) => a + b, 0) / Object.keys(userProgress.culturalCompetency).length)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Cultural Competency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(Object.values(userProgress.intelligenceGrowth).reduce((a, b) => a + b, 0) / Object.keys(userProgress.intelligenceGrowth).length)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Intelligence Growth</div>
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
                  <CardTitle className="font-recoleta">Community Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <Textarea
                        placeholder="Share your thoughts about the stories or ask questions..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => {
                          // Handle comment submission
                          setNewComment("");
                        }}
                        disabled={!newComment.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Sarah Chen</span>
                          <span className="text-sm text-muted-foreground">2 hours ago</span>
                        </div>
                        <p className="text-sm">
                          The Medicine Wheel story really helped me understand how Indigenous perspectives on health are so holistic. Thank you for sharing this wisdom.
                        </p>
                        <div className="flex items-center space-x-4 mt-3">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            12
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
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