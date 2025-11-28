import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, addMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Coffee, 
  Brain, 
  Heart, 
  Timer, 
  Play, 
  Pause, 
  Settings, 
  Zap, 
  Smile,
  TrendingUp,
  Bell,
  Lightbulb,
  Activity,
  Leaf
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import type { BreakPattern, RestSuggestion, SmartBreakSession } from "@shared/schema";

export default function SmartBreakSystem() {
  const [activeTab, setActiveTab] = useState("patterns");
  const [currentBreakSession, setCurrentBreakSession] = useState<SmartBreakSession | null>(null);
  const [breakTimer, setBreakTimer] = useState(0);
  const [isBreakActive, setIsBreakActive] = useState(false);
  
  const [newPattern, setNewPattern] = useState({
    patternName: "",
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
  });

  const [currentContext, setCurrentContext] = useState({
    energyLevel: 3,
    stressLevel: 3,
    workDuration: 0,
    lastBreakTime: new Date().toISOString(),
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch break patterns
  const { data: breakPatterns = [], isLoading: patternsLoading } = useQuery<BreakPattern[]>({
    queryKey: ["/api/break-patterns"],
    enabled: activeTab === "patterns",
  });

  // Fetch rest suggestions
  const { data: restSuggestions = [], isLoading: suggestionsLoading } = useQuery<RestSuggestion[]>({
    queryKey: ["/api/rest-suggestions"],
    enabled: activeTab === "suggestions",
  });

  // Fetch recent break sessions
  const { data: recentSessions = [], isLoading: sessionsLoading } = useQuery<SmartBreakSession[]>({
    queryKey: ["/api/smart-break-sessions"],
    enabled: activeTab === "analytics",
  });

  // Create break pattern mutation
  const createPattern = useMutation({
    mutationFn: async (pattern: any) => {
      const response = await fetch("/api/break-patterns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pattern),
      });
      if (!response.ok) throw new Error("Failed to create pattern");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/break-patterns"] });
      setNewPattern({
        patternName: "",
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
      });
      toast({
        title: "Break Pattern Created",
        description: "Your new break pattern has been saved!",
      });
    },
  });

  // Activate break pattern mutation
  const activatePattern = useMutation({
    mutationFn: async (patternId: number) => {
      const response = await fetch(`/api/break-patterns/${patternId}/activate`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to activate pattern");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/break-patterns"] });
      toast({
        title: "Pattern Activated",
        description: "Break pattern is now active for your sessions!",
      });
    },
  });

  // Get smart break suggestion mutation
  const getBreakSuggestion = useMutation({
    mutationFn: async (context: any) => {
      const response = await fetch("/api/suggest-break", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
      });
      if (!response.ok) throw new Error("Failed to get suggestion");
      return response.json();
    },
  });

  // Start break session mutation
  const startBreakSession = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await fetch("/api/smart-break-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });
      if (!response.ok) throw new Error("Failed to start break session");
      return response.json();
    },
    onSuccess: (session) => {
      setCurrentBreakSession(session);
      setIsBreakActive(true);
      setBreakTimer(0);
      toast({
        title: "Break Started",
        description: "Take your time to rest and recharge!",
      });
    },
  });

  // Complete break session mutation
  const completeBreakSession = useMutation({
    mutationFn: async ({ sessionId, completionData }: { sessionId: number; completionData: any }) => {
      const response = await fetch(`/api/smart-break-sessions/${sessionId}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completionData),
      });
      if (!response.ok) throw new Error("Failed to complete break session");
      return response.json();
    },
    onSuccess: () => {
      setCurrentBreakSession(null);
      setIsBreakActive(false);
      setBreakTimer(0);
      queryClient.invalidateQueries({ queryKey: ["/api/smart-break-sessions"] });
      toast({
        title: "Break Completed",
        description: "Hope you feel refreshed and ready to continue!",
      });
    },
  });

  // Timer effect for active break
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreakActive && currentBreakSession) {
      interval = setInterval(() => {
        setBreakTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreakActive, currentBreakSession]);

  const handleStartBreak = (suggestionType: string, duration: number, suggestion: string) => {
    startBreakSession.mutate({
      breakType: suggestionType,
      plannedDuration: duration,
      suggestion,
      energyBefore: currentContext.energyLevel,
      stressBefore: currentContext.stressLevel,
    });
  };

  const handleCompleteBreak = (energyAfter: number, stressAfter: number, effectiveness: number, notes: string) => {
    if (currentBreakSession) {
      completeBreakSession.mutate({
        sessionId: currentBreakSession.id,
        completionData: {
          actualDuration: Math.floor(breakTimer / 60),
          energyAfter,
          stressAfter,
          effectiveness,
          notes,
        },
      });
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const breakTypeIcons = {
    micro: Zap,
    short: Coffee,
    long: Heart,
    rest: Leaf,
  };

  const suggestionTypeColors = {
    micro_break: "bg-yellow-100 text-yellow-800",
    active_break: "bg-green-100 text-green-800",
    rest_period: "bg-blue-100 text-blue-800",
    energy_boost: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
          <Heart className="h-5 w-5 text-purple-600" />
          <AlertDescription className="ml-2">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Smart break systems center intersex anatomy as the universal baseline for rest recommendations. There is no separate "transgender healthcare" category—all wellness features serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 
            className="text-4xl font-bold text-primary"
            style={{ 
              fontFamily: 'cursive',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Smart Break & Rest System 🧘‍♀️
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered break suggestions and cross-platform notifications
          </p>
          <div className="text-sm text-muted-foreground">
            Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Creative Commons BY-SA 4.0
            </a>
          </div>
        </div>

        {/* Active Break Display */}
        {isBreakActive && currentBreakSession && (
          <Card className="border-2 border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Break in Progress
                </div>
                <div className="text-2xl font-mono">
                  {formatTimer(breakTimer)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{currentBreakSession.suggestion}</p>
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsBreakActive(false)}
                  variant="outline"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Break
                </Button>
                <Button
                  onClick={() => {
                    // Quick completion form would go here
                    handleCompleteBreak(4, 2, 4, "Felt refreshed");
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Complete Break
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patterns">Break Patterns</TabsTrigger>
            <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
            <TabsTrigger value="notifications">Cross-Platform Sync</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Break Patterns Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Break Patterns
                </CardTitle>
                <CardDescription>
                  Configure your work and break intervals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Create New Pattern */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Create New Pattern</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pattern-name">Pattern Name</Label>
                      <Input
                        id="pattern-name"
                        value={newPattern.patternName}
                        onChange={(e) => setNewPattern(prev => ({ ...prev, patternName: e.target.value }))}
                        placeholder="Pomodoro Technique"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Work Duration (minutes)</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[newPattern.workDuration]}
                          onValueChange={(value) => setNewPattern(prev => ({ ...prev, workDuration: value[0] }))}
                          max={120}
                          min={10}
                          step={5}
                        />
                        <div className="text-center text-sm text-muted-foreground">
                          {newPattern.workDuration} minutes
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Short Break (minutes)</Label>
                      <Slider
                        value={[newPattern.shortBreakDuration]}
                        onValueChange={(value) => setNewPattern(prev => ({ ...prev, shortBreakDuration: value[0] }))}
                        max={30}
                        min={1}
                        step={1}
                      />
                      <div className="text-center text-sm">{newPattern.shortBreakDuration}min</div>
                    </div>

                    <div className="space-y-2">
                      <Label>Long Break (minutes)</Label>
                      <Slider
                        value={[newPattern.longBreakDuration]}
                        onValueChange={(value) => setNewPattern(prev => ({ ...prev, longBreakDuration: value[0] }))}
                        max={60}
                        min={5}
                        step={5}
                      />
                      <div className="text-center text-sm">{newPattern.longBreakDuration}min</div>
                    </div>

                    <div className="space-y-2">
                      <Label>Long Break Interval</Label>
                      <Slider
                        value={[newPattern.longBreakInterval]}
                        onValueChange={(value) => setNewPattern(prev => ({ ...prev, longBreakInterval: value[0] }))}
                        max={8}
                        min={2}
                        step={1}
                      />
                      <div className="text-center text-sm">Every {newPattern.longBreakInterval} cycles</div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => createPattern.mutate(newPattern)}
                    disabled={!newPattern.patternName || createPattern.isPending}
                  >
                    {createPattern.isPending ? "Creating..." : "Create Pattern"}
                  </Button>
                </div>

                {/* Existing Patterns */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Your Patterns</h3>
                  {patternsLoading ? (
                    <div className="text-center py-4">Loading patterns...</div>
                  ) : breakPatterns.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No break patterns yet. Create your first pattern above!
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {breakPatterns.map((pattern) => (
                        <div key={pattern.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{pattern.patternName}</h4>
                              <p className="text-sm text-muted-foreground">
                                Work {pattern.workDuration}min • Short break {pattern.shortBreakDuration}min • 
                                Long break {pattern.longBreakDuration}min every {pattern.longBreakInterval} cycles
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={pattern.isActive ? "default" : "secondary"}>
                                {pattern.isActive ? "Active" : "Inactive"}
                              </Badge>
                              {!pattern.isActive && (
                                <Button
                                  size="sm"
                                  onClick={() => activatePattern.mutate(pattern.id)}
                                  disabled={activatePattern.isPending}
                                >
                                  Activate
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Smart Break Suggestions
                </CardTitle>
                <CardDescription>
                  AI-powered recommendations based on your current state
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Context */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Current State</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Energy Level</Label>
                      <Slider
                        value={[currentContext.energyLevel]}
                        onValueChange={(value) => setCurrentContext(prev => ({ ...prev, energyLevel: value[0] }))}
                        max={5}
                        min={1}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Stress Level</Label>
                      <Slider
                        value={[currentContext.stressLevel]}
                        onValueChange={(value) => setCurrentContext(prev => ({ ...prev, stressLevel: value[0] }))}
                        max={5}
                        min={1}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Calm</span>
                        <span>Stressed</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => getBreakSuggestion.mutate(currentContext)}
                    disabled={getBreakSuggestion.isPending}
                    className="w-full"
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    {getBreakSuggestion.isPending ? "Analyzing..." : "Get Smart Suggestion"}
                  </Button>

                  {getBreakSuggestion.data && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">Recommended Break</h4>
                      <p className="text-blue-700 mb-3">{getBreakSuggestion.data.suggestion}</p>
                      <Button
                        onClick={() => handleStartBreak(
                          getBreakSuggestion.data.type,
                          getBreakSuggestion.data.duration,
                          getBreakSuggestion.data.suggestion
                        )}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start {getBreakSuggestion.data.duration}min Break
                      </Button>
                    </div>
                  )}
                </div>

                {/* Available Suggestions */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Available Suggestions</h3>
                  {suggestionsLoading ? (
                    <div className="text-center py-4">Loading suggestions...</div>
                  ) : (
                    <div className="grid gap-4">
                      {restSuggestions.slice(0, 6).map((suggestion) => (
                        <div key={suggestion.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{suggestion.title}</h4>
                                <Badge 
                                  variant="secondary" 
                                  className={suggestionTypeColors[suggestion.suggestionType as keyof typeof suggestionTypeColors] || ""}
                                >
                                  {suggestion.suggestionType.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                              {suggestion.activity && (
                                <p className="text-sm"><strong>Activity:</strong> {suggestion.activity}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="text-sm text-muted-foreground">
                                {suggestion.duration}min
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleStartBreak(
                                  suggestion.suggestionType,
                                  suggestion.duration || 5,
                                  suggestion.description
                                )}
                                disabled={isBreakActive}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Start
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cross-Platform Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Cross-Platform Notification Sync
                </CardTitle>
                <CardDescription>
                  Sync break reminders across all your devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Web Browser Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notifications in your browser
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Desktop Application</h4>
                      <p className="text-sm text-muted-foreground">
                        System-wide desktop notifications
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Mobile Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Break reminders on your phone
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Reminders</h4>
                      <p className="text-sm text-muted-foreground">
                        Daily break pattern summaries
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Notification Preferences</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Break reminders</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rest suggestions</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Time wisdom insights</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly analytics</span>
                      <Switch />
                    </div>
                  </div>

                  <Button className="w-full">
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Break Analytics
                </CardTitle>
                <CardDescription>
                  Track your break effectiveness and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="text-center py-4">Loading analytics...</div>
                ) : recentSessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No break sessions yet. Start taking breaks to see analytics!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentSessions.slice(0, 10).map((session) => {
                      const BreakIcon = breakTypeIcons[session.breakType as keyof typeof breakTypeIcons] || Activity;
                      return (
                        <div key={session.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <BreakIcon className="h-5 w-5 text-primary" />
                              <div>
                                <h4 className="font-medium capitalize">{session.breakType} Break</h4>
                                <p className="text-sm text-muted-foreground">
                                  {session.actualDuration || session.plannedDuration} minutes • 
                                  {session.startedAt && format(new Date(session.startedAt), "MMM d, h:mm a")}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {session.effectiveness && (
                                <Badge variant="outline">
                                  <Smile className="h-3 w-3 mr-1" />
                                  {session.effectiveness}/5
                                </Badge>
                              )}
                              <Badge 
                                variant={session.completedAt ? "default" : "secondary"}
                              >
                                {session.completedAt ? "Completed" : "In Progress"}
                              </Badge>
                            </div>
                          </div>
                          {session.notes && (
                            <p className="text-sm mt-2 text-muted-foreground">
                              "{session.notes}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}