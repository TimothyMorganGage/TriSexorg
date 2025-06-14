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
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Lightbulb,
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
  estimatedTime: number;
  gboardFeatures?: string[];
  practicePrompts?: string[];
  culturalFocus?: string[];
  accessibilityTips?: string[];
}

interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  tutorialStarted: boolean;
  gboardConnected: boolean;
  firstStoryCompleted: boolean;
  mentorMatched: boolean;
  accessibilityEnabled: boolean;
}

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingTutorial({ isOpen, onClose, onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 0,
    completedSteps: [],
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
        "Practice typing in your preferred language"
      ],
      accessibilityTips: [
        "Voice input works in all supported languages",
        "Haptic feedback available for typing assistance",
        "Large key mode for better visibility",
        "Switch access compatible"
      ]
    },
    {
      id: "interactive-stories",
      title: "Cultural Stories & Wisdom Learning",
      description: "Explore interactive stories that honor diverse cultural perspectives on sexual health, relationships, and community wisdom.",
      component: "stories",
      objectives: [
        "Read your first cultural wisdom story",
        "Practice making choices in interactive narratives",
        "Connect with diverse perspectives on health",
        "Learn about inclusive terminology"
      ],
      estimatedTime: 8,
      culturalFocus: ["Indigenous Teachings", "Ubuntu Philosophy", "Reproductive Justice", "Community Care"],
      accessibilityTips: [
        "Stories available in audio format",
        "Text can be enlarged for better reading",
        "Voice navigation through story choices",
        "Alternative text for all visual elements"
      ]
    },
    {
      id: "peer-mentor",
      title: "Connect with Peer Mentors",
      description: "Join our time banking community where you can both give and receive support from peers who understand your health journey.",
      component: "mentor",
      objectives: [
        "Understand the peer mentor matching system",
        "Learn about time banking for mutual support",
        "See how to request help or offer assistance",
        "Explore communication preferences"
      ],
      estimatedTime: 6,
      accessibilityTips: [
        "Video calls include ASL interpretation options",
        "Text-only communication available",
        "Audio calls with transcription",
        "Flexible scheduling accommodates different needs"
      ]
    },
    {
      id: "analytics-dashboard",
      title: "Your Health Journey Analytics",
      description: "Discover insights about your learning progress, cultural competency growth, and community engagement through respectful data visualization.",
      component: "analytics",
      objectives: [
        "Understand your learning progress tracking",
        "Review cultural competency progress",
        "See community impact measurements"
      ],
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
      description: "You've completed the onboarding tutorial and are ready to begin. Your journey toward inclusive health and cultural wisdom starts now.",
      component: "completion",
      objectives: [
        "Celebrate completing the tutorial",
        "Set personal learning goals",
        "Join the community discussion"
      ],
      estimatedTime: 2
    }
  ];

  const handleStepComplete = () => {
    const currentStepData = tutorialSteps[currentStep];
    setProgress(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, currentStepData.id]
    }));

    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipStep = () => {
    handleStepComplete();
  };

  const currentStepData = tutorialSteps[currentStep];
  const progressPercentage = ((currentStep + 1) / tutorialSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-recoleta">
              {currentStepData.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {tutorialSteps.length} • ~{currentStepData.estimatedTime} minutes
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tutorial Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>

          <div className="prose max-w-none">
            <p className="text-base leading-relaxed">{currentStepData.description}</p>
          </div>

          {currentStepData.objectives && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Learning Objectives
              </h4>
              <ul className="space-y-2">
                {currentStepData.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gboard Tutorial Component */}
          {currentStepData.component === "gboard" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Keyboard className="h-5 w-5 mr-2" />
                      Gboard Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentStepData.gboardFeatures?.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Hand className="h-5 w-5 mr-2" />
                      Practice Typing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input
                        placeholder="Practice typing inclusive terminology here..."
                        value={practiceText}
                        onChange={(e) => setPracticeText(e.target.value)}
                        className="mb-2"
                      />
                      <Button 
                        onClick={() => setGboardActive(!gboardActive)}
                        variant={gboardActive ? "default" : "outline"}
                        className="w-full"
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        {gboardActive ? "Voice Input Active" : "Enable Voice Input"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {currentStepData.practicePrompts && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Try These Practice Prompts:</h4>
                  <div className="space-y-2">
                    {currentStepData.practicePrompts.map((prompt, index) => (
                      <div key={index} className="text-sm bg-white p-2 rounded border">
                        {prompt}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stories Tutorial Component */}
          {currentStepData.component === "stories" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Cultural Wisdom Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Our interactive stories come from community elders, cultural practitioners, and 
                      health advocates who share wisdom about sexual health through their cultural lens.
                    </p>
                    
                    {currentStepData.culturalFocus && (
                      <div className="flex flex-wrap gap-2">
                        {currentStepData.culturalFocus.map((focus, index) => (
                          <Badge key={index} variant="secondary">
                            {focus}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Your First Story: "Medicine Wheel Teachings"
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mentor Tutorial Component */}
          {currentStepData.component === "mentor" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Peer Mentor Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Connect with peer mentors who understand your journey. Our time banking system 
                      ensures mutual support where everyone both gives and receives help.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Heart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h4 className="font-medium">Give Support</h4>
                        <p className="text-xs text-muted-foreground">Share your knowledge and experiences</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h4 className="font-medium">Receive Support</h4>
                        <p className="text-xs text-muted-foreground">Get help when you need it</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Tutorial Component */}
          {currentStepData.component === "analytics" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Track your growth in cultural competency, story completion, and community engagement 
                      while maintaining complete privacy and control over your data.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cultural Competency</span>
                        <Badge variant="outline">Growing</Badge>
                      </div>
                      <Progress value={65} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Story Completion</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Completion Component */}
          {currentStepData.component === "completion" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Welcome to the Community!</h3>
                <p className="text-muted-foreground">
                  You're now ready to explore fluck's inclusive health platform. Start with whatever feels most comfortable to you.
                </p>
              </div>
            </div>
          )}

          {currentStepData.accessibilityTips && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Accessibility Features
              </h4>
              <ul className="space-y-1">
                {currentStepData.accessibilityTips.map((tip, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>

        <div className="flex justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={handleSkipStep}
            >
              Skip
            </Button>
            <Button onClick={handleStepComplete}>
              {currentStep === tutorialSteps.length - 1 ? (
                "Complete Tutorial"
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}