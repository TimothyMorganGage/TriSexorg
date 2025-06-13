import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Smartphone,
  Keyboard,
  Globe,
  Brain,
  Heart,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Lightbulb,
  Target,
  Award,
  Zap,
  Volume2,
  Hand,
  Eye,
  MessageCircle,
  Play
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  component: "gboard" | "stories" | "mentor" | "analytics" | "completion";
  objectives: string[];
  xpReward: number;
  estimatedTime: number;
  gboardFeatures?: string[];
  practicePrompts?: string[];
  culturalFocus?: string[];
  accessibilityTips?: string[];
}

interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  totalXP: number;
  tutorialStarted: boolean;
  gboardConnected: boolean;
  firstStoryCompleted: boolean;
  mentorMatched: boolean;
  accessibilityEnabled: boolean;
}

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (progress: OnboardingProgress) => void;
}

export function OnboardingTutorial({ isOpen, onClose, onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 0,
    completedSteps: [],
    totalXP: 0,
    tutorialStarted: false,
    gboardConnected: false,
    firstStoryCompleted: false,
    mentorMatched: false,
    accessibilityEnabled: false
  });
  const [practiceText, setPracticeText] = useState("");
  const [gboardActive, setGboardActive] = useState(false);

  const tutorialSteps: TutorialStep[] = [
    {
      id: "welcome",
      title: "Welcome to fluck: Your Inclusive Health Journey",
      description: "Discover a platform designed for the full 2SLGBTIQA+ community with cultural wisdom, peer support, and personalized learning.",
      component: "completion",
      objectives: [
        "Understand fluck's mission for inclusive sexual health",
        "Learn about our cultural wisdom approach",
        "See how technology supports human connection"
      ],
      xpReward: 50,
      estimatedTime: 3,
      culturalFocus: ["Indigenous Wisdom", "Reproductive Justice", "Community Healing"],
      accessibilityTips: [
        "Screen reader compatible throughout platform",
        "High contrast mode available in settings",
        "Voice input supported for all text fields",
        "Large text options for better readability"
      ]
    },
    {
      id: "gboard-setup",
      title: "Smart Keyboard Integration with Gboard",
      description: "Set up Gboard to get inclusive language suggestions, cultural terminology, and accessibility features while typing.",
      component: "gboard",
      objectives: [
        "Enable Gboard inclusive language suggestions",
        "Practice typing sexual health terminology",
        "Test voice input for anatomy terms",
        "Explore emoji options for diverse relationships"
      ],
      xpReward: 100,
      estimatedTime: 5,
      gboardFeatures: [
        "Inclusive Language Suggestions",
        "Cultural Terminology Database",
        "Voice-to-Text Accessibility",
        "Diverse Emoji Collections",
        "Multi-language Support"
      ],
      practicePrompts: [
        "Type 'sexual creativity' and see inclusive suggestions",
        "Try 'reproductive justice' for cultural context",
        "Use voice input: 'vulva health education'",
        "Explore relationship emoji options",
        "Practice anatomy terms in your preferred language"
      ],
      accessibilityTips: [
        "Voice input works with screen readers",
        "Haptic feedback for typing confirmation",
        "Large key mode available",
        "Swipe gestures for faster navigation"
      ]
    },
    {
      id: "story-introduction",
      title: "Interactive Story Learning System",
      description: "Experience cultural wisdom through interactive stories from Indigenous elders, curanderas, and traditional healers worldwide.",
      component: "stories",
      objectives: [
        "Start your first cultural wisdom story",
        "Make meaningful choices in story progression",
        "Earn XP and cultural competency badges",
        "Connect with community through story discussions"
      ],
      xpReward: 150,
      estimatedTime: 8,
      culturalFocus: [
        "Medicine Wheel Teachings",
        "Curanderismo Practices", 
        "African Traditional Healing",
        "Ayurvedic Wisdom"
      ],
      accessibilityTips: [
        "Audio narration available for all stories",
        "Text can be enlarged for better reading",
        "Story choices clearly marked and numbered",
        "Progress saved automatically"
      ]
    },
    {
      id: "peer-mentor-matching",
      title: "Peer Mentor Network Connection",
      description: "Connect with peer mentors using our intelligence framework matching system that values infinite, multicultural, multigenerational, and racial & ethnic intelligence.",
      component: "mentor",
      objectives: [
        "Complete cultural background profile",
        "Set intelligence framework preferences",
        "Connect with your first peer mentor",
        "Understand time banking and stablecoin rewards"
      ],
      xpReward: 125,
      estimatedTime: 6,
      culturalFocus: [
        "Cross-cultural mentorship",
        "Generational wisdom exchange",
        "Community healing practices",
        "Equitable compensation systems"
      ],
      accessibilityTips: [
        "Video calls with live captions",
        "Text-based mentoring available",
        "Translation services provided",
        "Flexible scheduling accommodations"
      ]
    },
    {
      id: "analytics-dashboard",
      title: "Personal Learning Analytics",
      description: "Track your health equity journey, cultural competency growth, and community impact through comprehensive analytics.",
      component: "analytics",
      objectives: [
        "Explore your personal learning dashboard",
        "Understand health equity metrics",
        "Review cultural competency progress",
        "See community impact measurements"
      ],
      xpReward: 75,
      estimatedTime: 4,
      accessibilityTips: [
        "Charts include text descriptions",
        "Data available in table format",
        "Color-blind friendly visualizations",
        "Export options for personal records"
      ]
    },
    {
      id: "completion",
      title: "Welcome to Your Health Equity Journey!",
      description: "You've completed the onboarding tutorial and earned your first badges. Your journey toward inclusive health and cultural wisdom begins now.",
      component: "completion",
      objectives: [
        "Celebrate completing the tutorial",
        "Receive welcome badges and XP",
        "Set personal learning goals",
        "Join the community discussion"
      ],
      xpReward: 200,
      estimatedTime: 2
    }
  ];

  const simulateGboardConnection = () => {
    setGboardActive(true);
    setProgress(prev => ({ ...prev, gboardConnected: true }));
    
    // Simulate haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    
    // Simulate typing suggestions appearing
    setTimeout(() => {
      if (practiceText.includes("sexual")) {
        // Show inclusive language suggestions
        console.log("Gboard suggestion: sexual creativity, sexual wellness, sexual autonomy");
      }
    }, 1000);
  };

  const completeStep = () => {
    const step = tutorialSteps[currentStep];
    const newProgress = {
      ...progress,
      completedSteps: [...progress.completedSteps, step.id],
      totalXP: progress.totalXP + step.xpReward,
      currentStep: currentStep + 1
    };
    
    setProgress(newProgress);
    
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(newProgress);
      onClose();
    }
  };

  const calculateOverallProgress = () => {
    return (progress.completedSteps.length / tutorialSteps.length) * 100;
  };

  if (!isOpen) return null;

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-6 w-6 text-primary" />
                {currentTutorialStep.title}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Step {currentStep + 1} of {tutorialSteps.length} • {currentTutorialStep.estimatedTime} min
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tutorial Progress</span>
              <span>{Math.round(calculateOverallProgress())}% complete</span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step Description */}
          <div className="text-center">
            <p className="text-lg">{currentTutorialStep.description}</p>
          </div>

          {/* Step-specific Content */}
          {currentTutorialStep.component === "gboard" && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Keyboard className="mr-2 h-5 w-5 text-purple-600" />
                    <Smartphone className="mr-2 h-5 w-5 text-blue-600" />
                    Gboard Integration Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {currentTutorialStep.gboardFeatures?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={simulateGboardConnection}
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600"
                    disabled={gboardActive}
                  >
                    {gboardActive ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Gboard Connected!
                      </>
                    ) : (
                      <>
                        <Hand className="mr-2 h-4 w-4" />
                        Connect Gboard
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {gboardActive && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Practice Typing with Inclusive Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input
                        placeholder="Start typing to see inclusive language suggestions..."
                        value={practiceText}
                        onChange={(e) => setPracticeText(e.target.value)}
                        className="text-lg"
                      />
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Try these practice prompts:</h4>
                        <div className="grid gap-2">
                          {currentTutorialStep.practicePrompts?.map((prompt, index) => (
                            <div key={index} className="flex items-start space-x-2 text-sm bg-muted/30 p-2 rounded">
                              <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{prompt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {currentTutorialStep.component === "stories" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-primary" />
                    Featured Cultural Wisdom Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {currentTutorialStep.culturalFocus?.map((culture, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-medium mb-2">{culture}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Learn from traditional healers and cultural wisdom keepers
                        </p>
                        <Badge variant="secondary">
                          <Star className="w-3 h-3 mr-1" />
                          Interactive Learning
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Play className="h-4 w-4 text-primary mr-2" />
                      <span className="font-medium">Ready to start your first story?</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose "Journey Through the Medicine Wheel" to begin learning about Indigenous approaches to holistic health.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentTutorialStep.component === "mentor" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-purple-500" />
                    Intelligence Framework Matching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-sm">Infinite Intelligence</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Collective wisdom and pattern recognition</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-cyan-500" />
                        <span className="font-medium text-sm">Multicultural Intelligence</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Cross-cultural understanding and healing</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-sm">Multigenerational Intelligence</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Wisdom across age groups and generations</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-amber-500" />
                        <span className="font-medium text-sm">Racial & Ethnic Intelligence</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Health equity and cultural competency</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentTutorialStep.component === "analytics" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-primary" />
                    Your Learning Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{progress.totalXP}</p>
                      <p className="text-sm text-muted-foreground">XP Earned</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-aquamarine">{progress.completedSteps.length}</p>
                      <p className="text-sm text-muted-foreground">Steps Completed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">1</p>
                      <p className="text-sm text-muted-foreground">Tutorial Level</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentTutorialStep.component === "completion" && (
            <div className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                <p className="text-muted-foreground">
                  You've completed the fluck onboarding tutorial and earned {progress.totalXP} XP!
                </p>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-medium mb-4">Your Tutorial Achievements:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <span>Tutorial Completion Badge</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Keyboard className="h-5 w-5 text-purple-500" />
                      <span>Gboard Integration Master</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-primary" />
                      <span>Cultural Wisdom Seeker</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-aquamarine" />
                      <span>Community Member</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentTutorialStep.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Tips */}
          {currentTutorialStep.accessibilityTips && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Eye className="mr-2 h-5 w-5 text-green-600" />
                  Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentTutorialStep.accessibilityTips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Button 
              variant="outline"
              onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">+{currentTutorialStep.xpReward} XP</span>
            </div>
            
            <Button onClick={completeStep}>
              {currentStep === tutorialSteps.length - 1 ? "Complete Tutorial" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}